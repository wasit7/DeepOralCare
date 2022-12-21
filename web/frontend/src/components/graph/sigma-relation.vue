<script setup>
import Sigma from "sigma";
import Graph from "graphology";
import { MultiGraph } from "graphology";
import getNodeProgramImage from "sigma/rendering/webgl/programs/node.image";
import ForceSupervisor from "graphology-layout-force/worker";

import { onMounted, onUpdated, ref, watchEffect } from "vue";

const props = defineProps({
  graphData: {
    type: Object,
    required: true,
  },
});

const graph = new Graph();

watchEffect(() => {
  if (props.graphData?.nodes && props.graphData?.edges) {
    console.log("watchEffect", props.graphData);
    const container = document.getElementById("sigma-container");
    props.graphData.nodes.map((node) => {
      graph.addNode(node.id, {
        size: 15,

        label: node.label,
        color: node?.color,
      });
    });
    props.graphData.edges.map((edge) => {
      graph.addEdge(edge.source, edge.target, {
        type: "line",
        label: edge.relation,
        size: 5,
      });
    });

    graph.nodes().forEach((node, i) => {
      const angle = (i * 2 * Math.PI) / graph.order;
      graph.setNodeAttribute(node, "x", 100 * Math.cos(angle));
      graph.setNodeAttribute(node, "y", 100 * Math.sin(angle));
    });

    const renderer = new Sigma(graph, container, {
      renderEdgeLabels: true,
    });
    const layout = new ForceSupervisor(graph, {
      isNodeFixed: (_, attr) => attr.highlighted,
    });
    layout.start();
    let draggedNode = null;
    let isDragging = false;
    renderer.on("downNode", (e) => {
      isDragging = true;
      draggedNode = e.node;
      graph.setNodeAttribute(draggedNode, "highlighted", true);
    });

    // On mouse move, if the drag mode is enabled, we change the position of the draggedNode
    renderer.getMouseCaptor().on("mousemovebody", (e) => {
      if (!isDragging || !draggedNode) return;

      // Get new position of node
      const pos = renderer.viewportToGraph(e);

      graph.setNodeAttribute(draggedNode, "x", pos.x);
      graph.setNodeAttribute(draggedNode, "y", pos.y);

      // Prevent sigma to move camera:
      e.preventSigmaDefault();
      e.original.preventDefault();
      e.original.stopPropagation();
    });

    // On mouse up, we reset the autoscale and the dragging mode
    renderer.getMouseCaptor().on("mouseup", () => {
      if (draggedNode) {
        graph.removeNodeAttribute(draggedNode, "highlighted");
      }
      isDragging = false;
      draggedNode = null;
    });

    // Disable the autoscale at the first down interaction
    renderer.getMouseCaptor().on("mousedown", () => {
      if (!renderer.getCustomBBox()) renderer.setCustomBBox(renderer.getBBox());
    });

    //
    // Create node (and edge) by click
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //

    // When clicking on the stage, we add a new node and connect it to the closest node
    renderer.on("clickStage", ({ event }) => {
      // Sigma (ie. graph) and screen (viewport) coordinates are not the same.
      // So we need to translate the screen x & y coordinates to the graph one by calling the sigma helper `viewportToGraph`
      const coordForGraph = renderer.viewportToGraph({
        x: event.x,
        y: event.y,
      });

      // We create a new node
      const node = {
        ...coordForGraph,
        size: 10,
        color: chroma.random().hex(),
      };

      // Searching the two closest nodes to auto-create an edge to it
      const closestNodes = graph
        .nodes()
        .map((nodeId) => {
          const attrs = graph.getNodeAttributes(nodeId);
          const distance =
            Math.pow(node.x - attrs.x, 2) + Math.pow(node.y - attrs.y, 2);
          return { nodeId, distance };
        })
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 2);

      // We register the new node into graphology instance
      const id = uuid();
      graph.addNode(id, node);

      // We create the edges
      closestNodes.forEach((e) => graph.addEdge(id, e.nodeId));
    });
  }
});
</script>

<template>
  <div id="sigma-container" class="w-full h-full"></div>
</template>

<style lang="scss" scoped></style>
