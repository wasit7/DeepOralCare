import React, { useState, useEffect } from 'react';

//NPM Packages
import { useRegisterEvents, useSigma } from "@react-sigma/core";

//Redux
import { useDispatch } from 'react-redux';
import { openBottom } from '../redux/layout/LayoutSlice';

function GraphEventsController(props) {

    const [draggedNode, setDraggedNode] = useState(null);

    const registerEvents = useRegisterEvents();
    const dispatch = useDispatch();
    const sigma = useSigma();
    /**
   * Initialize here settings that require to know the graph and/or the sigma
   * instance:
   */
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
            enterNode: (e) => {
                props.setHoveredNode(e.node);
            },
            leaveNode: () => {
                props.setHoveredNode(null);
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

    return (
        <div>{props.children}</div>
    )
}

export default GraphEventsController;