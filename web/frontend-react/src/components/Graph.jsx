import { useEffect, useState } from "react";
import { memo } from "react";

//NPM Packages
import { MultiDirectedGraph } from "graphology";
import { SigmaContainer, useLoadGraph, useRegisterEvents, useSigma } from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";
import { useLayoutRandom } from "@react-sigma/layout-random";
import { useLayoutCircular } from "@react-sigma/layout-circular";

//Redux
import { useDispatch } from 'react-redux';
import { openBottom } from '../redux/layout/LayoutSlice';

const DisplayGraph = (props) => {

    const LoadGraph = () => {

        const [draggedNode, setDraggedNode] = useState(null);

        const loadGraph = useLoadGraph();
        const { positions, assign } = useLayoutRandom();
        // const { positions, assign } = useLayoutCircular();
        const registerEvents = useRegisterEvents();
        const sigma = useSigma();

        const dispatch = useDispatch();

        useEffect(() => {
            const graph = new MultiDirectedGraph();
            if (props.nodes.length > 0) {

                //Graph need to have unique node name. So split the original nodes and remove duplications
                let heads = [];
                let tails = [];
                props.nodes.map(item => { heads.push({ node: item.head, id: item.originalHead }); tails.push({ node: item.tail, id: item.originalTail }) })
                let nodes = [...heads, ...tails];

                const uniqueNodeIds = [];

                const uniqueNodes = nodes.filter(element => {
                    const isDuplicate = uniqueNodeIds.includes(element.id);
                    if (!isDuplicate) {
                        uniqueNodeIds.push(element.id);
                        return true;
                    }
                    return false;
                });

                uniqueNodes.map(item => graph.addNode(item.id, { x: 0, y: 0, label: item.node, size: 10, color: '#E49244' }));
                //Use the original nodes for showing relations because each node can have multiple relations
                props.nodes.map((node, index) => graph.addEdgeWithKey(`node.relation${index}`, node.originalHead, node.originalTail, { label: node.relation }))
            }
            loadGraph(graph);
            assign();
        }, [loadGraph, props.nodes, assign]);

        useEffect(() => {
            // Register the events
            registerEvents({
                clickNode: (e) => {
                    props.fetchEntityDetail(e.node);
                    dispatch(openBottom());
                },
                doubleClickNode: (e) => {
                    props.fetchEntityData(e.node);
                },
                downNode: (e) => {
                    setDraggedNode(e.node);
                    sigma.getGraph().setNodeAttribute(e.node, "highlighted", true);
                },
                mouseup: (e) => {
                    if (draggedNode) {
                        setDraggedNode(null);
                        sigma.getGraph().removeNodeAttribute(draggedNode, "highlighted");
                    }
                },
                mousedown: (e) => {
                    // Disable the autoscale at the first down interaction
                    if (!sigma.getCustomBBox()) sigma.setCustomBBox(sigma.getBBox());
                },
                mousemove: (e) => {
                    if (draggedNode) {
                        // Get new position of node
                        const pos = sigma.viewportToGraph(e);
                        sigma.getGraph().setNodeAttribute(draggedNode, "x", pos.x);
                        sigma.getGraph().setNodeAttribute(draggedNode, "y", pos.y);

                        // Prevent sigma to move camera:
                        e.preventSigmaDefault();
                        e.original.preventDefault();
                        e.original.stopPropagation();
                    }
                },
                touchup: (e) => {
                    if (draggedNode) {
                        setDraggedNode(null);
                        sigma.getGraph().removeNodeAttribute(draggedNode, "highlighted");
                    }
                },
                touchdown: (e) => {
                    // Disable the autoscale at the first down interaction
                    if (!sigma.getCustomBBox()) sigma.setCustomBBox(sigma.getBBox());
                },
                touchmove: (e) => {
                    if (draggedNode) {
                        // Get new position of node
                        const pos = sigma.viewportToGraph(e);
                        sigma.getGraph().setNodeAttribute(draggedNode, "x", pos.x);
                        sigma.getGraph().setNodeAttribute(draggedNode, "y", pos.y);

                        // Prevent sigma to move camera:
                        e.preventSigmaDefault();
                        e.original.preventDefault();
                        e.original.stopPropagation();
                    }
                },
            });
        }, [registerEvents, sigma, draggedNode])

        return null;
    };

    return (
        <div className="h-full">
            <SigmaContainer
                graph={MultiDirectedGraph}
                settings={{
                    renderEdgeLabels: true,
                    defaultEdgeType: 'arrow'
                }}
                style={{
                    height: "100%",
                    width: "100%",
                    background: '#EEE',
                    fontSize: '1rem'
                }}
            >
                <LoadGraph />
            </SigmaContainer>
        </div>
    );
};

export default memo(DisplayGraph);
