<script setup>
import Sigma from "sigma";
import Graph from "graphology";
import { MultiGraph } from "graphology";
import getNodeProgramImage from "sigma/rendering/webgl/programs/node.image";
import ForceSupervisor from "graphology-layout-force/worker";
import circleLoading from "../loading/circle-loading.vue";

import { onMounted, onUpdated, ref, watch, watchEffect } from "vue";

const props = defineProps({
  graphData: {
    type: Object,
    required: true,
  },
});

const graphLoading = ref(true);
let draggedNode = ref(null);
let isDragging = ref(false);
let isHovering = ref(false);
let hoveredNode = ref(null);
let hoveredNeighbors = ref(null);
let selectedNode = ref(null);

const emits = defineEmits(["clickNode", "dbClickNode"]);

watch(
  () => props.graphData,
  (newValue, oldValue) => {
    const graph = new Graph({ multi: true, type: "mixed" });
    graph.clear();
    newValue.nodes.map((node) => {
      graph.addNode(node.id, {
        size: 15,
        label: node.label,
        color: node?.color,
      });
    });
    newValue.edges.map((edge) => {
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
    refresh_Graph(graph);
  },
  { deep: true }
);

const create_Graph = (graph) => {
  graphLoading.value = false;

  const container = document.getElementById("sigma-container");
  const renderer = new Sigma(graph, container, {
    renderEdgeLabels: true,
    allowInvalidContainer: true,
  });
  const layout = new ForceSupervisor(graph, {
    isNodeFixed: (_, attr) => attr.highlighted,
  });
  layout.start();

  renderer.on("doubleClickNode", (event) => {
    emits.dbClickNode(event.node);
  });

  function setHoveredNode(node) {
    if (node) {
      hoveredNode.value = node;
      hoveredNeighbors.value = new Set(graph.neighbors(node));
    } else {
      hoveredNode.value = null;
      hoveredNeighbors.value = null;
    }
    renderer.refresh();
  }

  renderer.setSetting("nodeReducer", (node, data) => {
    const res = { ...data };

    if (
      hoveredNeighbors.value &&
      !hoveredNeighbors.value.has(node) &&
      hoveredNode.value !== node
    ) {
      res.label = "";
      res.color = "#f6f6f6";
    }

    if (selectedNode.value === node) {
      res.highlighted = true;
    }
    return res;
  });

  renderer.setSetting("edgeReducer", (edge, data) => {
    const res = { ...data };
    if (hoveredNode.value && !graph.hasExtremity(edge, hoveredNode.value)) {
      res.hidden = true;
    }

    return res;
  });

  renderer.on("downNode", (e) => {
    console.log("downNode", e);
    isDragging.value = true;
    draggedNode.value = e.node;
    emits("clickNode", e.node);
    graph.setNodeAttribute(draggedNode.value, "highlighted", true);
  });
  // On mouse move, if the drag mode is enabled, we change the position of the draggedNode
  renderer.getMouseCaptor().on("mousemovebody", (e) => {
    if (!isDragging.value || !draggedNode.value) return;

    // Get new position of node
    const pos = renderer.viewportToGraph(e);

    graph.setNodeAttribute(draggedNode.value, "x", pos.x);
    graph.setNodeAttribute(draggedNode.value, "y", pos.y);

    // Prevent sigma to move camera:
    e.preventSigmaDefault();
    e.original.preventDefault();
    e.original.stopPropagation();
    layout.start();
  });

  // On mouse up, we reset the autoscale and the dragging mode
  renderer.getMouseCaptor().on("mouseup", () => {
    if (draggedNode.value) {
      graph.removeNodeAttribute(draggedNode.value, "highlighted");
    }
    isDragging.value = false;
    draggedNode.value = null;
    layout.stop();
  });

  // Disable the autoscale at the first down interaction
  renderer.getMouseCaptor().on("mousedown", () => {
    if (!renderer.getCustomBBox()) renderer.setCustomBBox(renderer.getBBox());
  });

  renderer.on("enterNode", ({ node }) => {
    setHoveredNode(node);
  });

  renderer.on("leaveNode", () => {
    setHoveredNode(null);
  });
};

const refresh_Graph = (graph) => {
  var g = document.querySelector("#sigma-container");
  var p = g.parentNode;
  p.removeChild(g);
  var c = document.createElement("div");
  c.setAttribute("id", "sigma-container");
  c.setAttribute("class", "w-full h-full");
  p.appendChild(c);

  create_Graph(graph);
};

// watchEffect(() => {
//   if (props.graphData?.nodes && props.graphData?.edges) {
//     const container = document.getElementById("sigma-container");

//     props.graphData.nodes.map((node) => {
//       graph.addNode(node.id, {
//         size: 15,

//         label: node.label,
//         color: node?.color,
//       });
//     });
//     props.graphData.edges.map((edge) => {
//       graph.addEdge(edge.source, edge.target, {
//         type: "line",
//         label: edge.relation,
//         size: 5,
//       });
//     });

//     graph.nodes().forEach((node, i) => {
//       const angle = (i * 2 * Math.PI) / graph.order;
//       graph.setNodeAttribute(node, "x", 100 * Math.cos(angle));
//       graph.setNodeAttribute(node, "y", 100 * Math.sin(angle));
//     });
//     const renderer = new Sigma(graph, container, {
//       renderEdgeLabels: true,
//       allowInvalidContainer: true,
//     });
//     const layout = new ForceSupervisor(graph, {
//       isNodeFixed: (_, attr) => attr.highlighted,
//     });
//     layout.start();
//     let draggedNode = null;
//     let isDragging = false;
//     let isHovering = null;
//     let hoveredNeighbor = null;
//     let selectedNode = null;
//     renderer.on("downNode", (e) => {
//       console.log("downNode", e);
//       isDragging = true;
//       draggedNode = e.node;
//       emits("clickNode", e.node);
//       graph.setNodeAttribute(draggedNode, "highlighted", true);
//     });

//     renderer.getMouseCaptor().on("click", (node) => {
//       console.log("click", node);
//     });

//     // On mouse move, if the drag mode is enabled, we change the position of the draggedNode
//     renderer.getMouseCaptor().on("mousemovebody", (e) => {
//       if (!isDragging || !draggedNode) return;

//       // Get new position of node
//       const pos = renderer.viewportToGraph(e);

//       graph.setNodeAttribute(draggedNode, "x", pos.x);
//       graph.setNodeAttribute(draggedNode, "y", pos.y);

//       // Prevent sigma to move camera:
//       e.preventSigmaDefault();
//       e.original.preventDefault();
//       e.original.stopPropagation();
//       layout.start();
//     });

//     // On mouse up, we reset the autoscale and the dragging mode
//     renderer.getMouseCaptor().on("mouseup", () => {
//       if (draggedNode) {
//         graph.removeNodeAttribute(draggedNode, "highlighted");
//       }
//       isDragging = false;
//       draggedNode = null;
//       layout.stop();
//     });

//     // Disable the autoscale at the first down interaction
//     renderer.getMouseCaptor().on("mousedown", () => {
//       if (!renderer.getCustomBBox()) renderer.setCustomBBox(renderer.getBBox());
//     });

//     renderer.on("enterNode", ({ node }) => {
//       setHoveredNode(node);
//       // isHovering = e.node;
//       // hoveredNeighbor = graph.neighbors(isHovering);
//       // hoveredNeighbor.push(isHovering);
//       // graph.forEachNode((node) => {
//       //   if (hoveredNeighbor.indexOf(node) > -1) {
//       //     graph.setNodeAttribute(node, "highlighted", true);
//       //   } else {
//       //     graph.setNodeAttribute(node, "highlighted", false);
//       //   }
//       // });
//     });

//     renderer.on("leaveNode", () => {
//       setHoveredNode(null);
//       // isHovering = null;
//       // hoveredNeighbor = null;
//       // graph.forEachNode((node) => {
//       //   graph.setNodeAttribute(node, "highlighted", false);
//       // });
//     });

//     const setHoveredNode = (node) => {
//       if (node) {
//         hoveredNode.value = node;
//         hoveredNeighbor.value = new Set(graph.neighbors(node));
//       } else {
//         hoveredNode.value = null;
//         hoveredNeighbor.value = null;
//       }
//       renderer.refresh();
//     };

//     //
//     // Create node (and edge) by click
//     // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//     //

//     // When clicking on the stage, we add a new node and connect it to the closest node
//     // renderer.on("clickStage", ({ event }) => {
//     // Sigma (ie. graph) and screen (viewport) coordinates are not the same.
//     // So we need to translate the screen x & y coordinates to the graph one by calling the sigma helper `viewportToGraph`
//     // const coordForGraph = renderer.viewportToGraph({
//     //   x: event.x,
//     //   y: event.y,
//     // });

//     // We create a new node
//     // const node = {
//     //   ...coordForGraph,
//     //   size: 10,
//     //   color: chroma.random().hex(),
//     // };

//     // Searching the two closest nodes to auto-create an edge to it
//     // const closestNodes = graph
//     //   .nodes()
//     //   .map((nodeId) => {
//     //     const attrs = graph.getNodeAttributes(nodeId);
//     //     const distance =
//     //       Math.pow(node.x - attrs.x, 2) + Math.pow(node.y - attrs.y, 2);
//     //     return { nodeId, distance };
//     //   })
//     //   .sort((a, b) => a.distance - b.distance)
//     //   .slice(0, 2);

//     // We register the new node into graphology instance
//     // const id = uuid();
//     // graph.addNode(id, node);

//     // We create the edges
//     // closestNodes.forEach((e) => graph.addEdge(id, e.nodeId));
//     // });

//     renderer.refresh();
//   }
// });
</script>

<template>
  <circle-loading v-if="graphLoading" column />

  <div id="sigma-container" class="w-full h-full"></div>
</template>

<style lang="scss" scoped>
.sigma-container {
  width: 100%;
  height: 100%;
}
</style>
