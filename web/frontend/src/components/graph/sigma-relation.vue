<script setup>
import Sigma from "sigma";
import Graph from "graphology";
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

    const renderer = new Sigma(graph, container, {
      renderEdgeLabels: true,
    });
    const layout = new ForceSupervisor(graph);
    layout.start();
  }
});

onMounted(() => {
  const RED = "#FA4F40";
  const BLUE = "#727EE0";
  const GREEN = "#5DB346";
  graph.addNode("John", {
    size: 15,
    label: "John",

    color: RED,
  });
  graph.addNode("Mary", {
    size: 15,
    label: "Mary",

    color: RED,
  });
  graph.addNode("Suzan", {
    size: 15,
    label: "Suzan",

    color: RED,
  });
  graph.addNode("Nantes", {
    size: 15,
    label: "Nantes",

    color: BLUE,
  });
  graph.addNode("New-York", {
    size: 15,
    label: "New-York",

    color: BLUE,
  });
  graph.addNode("Sushis", {
    size: 7,
    label: "Sushis",

    color: GREEN,
  });
  graph.addNode("Falafels", {
    size: 7,
    label: "Falafels",

    color: GREEN,
  });
  graph.addNode("Kouign Amann", {
    size: 7,
    label: "Kouign Amann",

    color: GREEN,
  });

  graph.addEdge("John", "Mary", { type: "line", label: "works with", size: 5 });
  graph.addEdge("Mary", "Suzan", {
    type: "line",
    label: "works with",
    size: 5,
  });
  graph.addEdge("Mary", "Nantes", {
    type: "arrow",
    label: "lives in",
    size: 5,
  });
  graph.addEdge("John", "New-York", {
    type: "arrow",
    label: "lives in",
    size: 5,
  });
  graph.addEdge("Suzan", "New-York", {
    type: "arrow",
    label: "lives in",
    size: 5,
  });
  graph.addEdge("John", "Falafels", { type: "arrow", label: "eats", size: 5 });
  graph.addEdge("Mary", "Sushis", { type: "arrow", label: "eats", size: 5 });
  graph.addEdge("Suzan", "Kouign Amann", {
    type: "arrow",
    label: "eats",
    size: 5,
  });

  graph.nodes().forEach((node, i) => {
    const angle = (i * 2 * Math.PI) / graph.order;
    graph.setNodeAttribute(node, "x", 100 * Math.cos(angle));
    graph.setNodeAttribute(node, "y", 100 * Math.sin(angle));
  });

  // var g = {
  //   nodes: [
  //     { id: "n0", label: "node 1", x: 0, y: 0, size: 30, color: "#00BCD4" },
  //     { id: "n1", label: "node 2", x: 3, y: 1, size: 20, color: "#00BCD4" },
  //     { id: "n2", label: "node 3", x: 1, y: 3, size: 10, color: "#00BCD4" },
  //     { id: "n3", label: "node 4", x: 6, y: 0, size: 30, color: "#00BCD4" },
  //     { id: "n4", label: "node 5", x: 5, y: 1, size: 20, color: "#00BCD4" },
  //     { id: "n5", label: "node 6", x: 4, y: 3, size: 10, color: "#00BCD4" },
  //   ],
  //   edges: [
  //     { id: "e0", source: "n0", target: "n1", color: "#545454", type: "line" },
  //     { id: "e1", source: "n1", target: "n2", color: "#545454", type: "line" },
  //     { id: "e2", source: "n1", target: "n3", color: "#545454", type: "line" },
  //     { id: "e3", source: "n1", target: "n4", color: "#545454", type: "line" },
  //     { id: "e4", source: "n2", target: "n0", color: "#545454", type: "line" },
  //     { id: "e5", source: "n2", target: "n3", color: "#545454", type: "line" },
  //     { id: "e6", source: "n3", target: "n2", color: "#545454", type: "line" },
  //     { id: "e7", source: "n4", target: "n5", color: "#545454", type: "line" },
  //     { id: "e8", source: "n4", target: "n3", color: "#545454", type: "line" },
  //     { id: "e9", source: "n5", target: "n0", color: "#545454", type: "line" },
  //   ],
  // };

  // g.nodes.forEach(function (node) {
  //   graph.addNode(node.id, node);
  // });

  // g.edges.forEach(function (edge) {
  //   graph.addEdge(edge.id, edge.source, edge.target, edge);
  // });
});
</script>

<template>
  <div id="sigma-container" class="w-full h-full"></div>
</template>

<style lang="scss" scoped></style>
