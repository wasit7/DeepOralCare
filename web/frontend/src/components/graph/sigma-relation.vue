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

const graph = new MultiGraph();

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
</script>

<template>
  <div id="sigma-container" class="w-full h-full"></div>
</template>

<style lang="scss" scoped></style>
