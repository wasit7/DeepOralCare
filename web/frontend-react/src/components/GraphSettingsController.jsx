import React, { useEffect } from "react";

//NPM Packages
import { useSigma } from "@react-sigma/core";
import { drawHover } from "./canvas-utils";
import useDebounce from "../hooks/UseDebounce";

const NODE_FADE_COLOR = "#bbb";
const EDGE_FADE_COLOR = "#eee";

const GraphSettingsController = (props) => {
    const sigma = useSigma();
    const graph = sigma.getGraph();

    // Here we debounce the value to avoid having too much highlights refresh when
    // moving the mouse over the graph:
    const debouncedHoveredNode = useDebounce(props.hoveredNode, 40);

    /**
     * Initialize here settings that require to know the graph and/or the sigma
     * instance:
     */
    useEffect(() => {
        sigma.setSetting("hoverRenderer", (context, data, settings) =>
            drawHover(context, { ...sigma.getNodeDisplayData(data.key), ...data }, settings),
        );
    }, [sigma, graph]);

    /**
     * Update node and edge reducers when a node is hovered, to highlight its
     * neighborhood:
     */
    useEffect(() => {
        const hoveredColor = debouncedHoveredNode ? sigma.getNodeDisplayData(debouncedHoveredNode).color : "";

        sigma.setSetting(
            "nodeReducer",
            debouncedHoveredNode
                ? (node, data) =>
                    node === debouncedHoveredNode ||
                        graph.hasEdge(node, debouncedHoveredNode) ||
                        graph.hasEdge(debouncedHoveredNode, node)
                        ? { ...data, zIndex: 1 }
                        : { ...data, zIndex: 0, label: "", color: NODE_FADE_COLOR, highlighted: false }
                : null,
        );
        sigma.setSetting(
            "edgeReducer",
            debouncedHoveredNode
                ? (edge, data) =>
                    graph.hasExtremity(edge, debouncedHoveredNode)
                        ? { ...data, color: hoveredColor, size: 4 }
                        : { ...data, color: EDGE_FADE_COLOR, hidden: true }
                : null,
        );
    }, [debouncedHoveredNode]);

    return <>{props.children}</>;
};

export default GraphSettingsController;
