import React, { useEffect } from 'react';

//NPM Packages
import { useLoadGraph } from "@react-sigma/core";
import { useLayoutRandom } from "@react-sigma/layout-random";
import { MultiDirectedGraph } from 'graphology';

function GraphDataController(props) {

    const loadGraph = useLoadGraph();
    const { positions, assign } = useLayoutRandom();

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

    return (
        <div>{props.children}</div>
    )
}

export default GraphDataController;