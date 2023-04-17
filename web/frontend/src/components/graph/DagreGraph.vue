<script setup>
import G6 from "@antv/g6";
import { defineProps, onMounted, watch, reactive, ref } from "vue";

const props = defineProps({
  nodes: {
    type: Array,
    // required: true,
    default: [],
  },
  edges: {
    type: Array,
    // required: true,
    default: [],
  },
  data: {
    type: Object,
  },
});

// Antv G6 Graph (Dagre)
const graph = ref();

watch(
  () => props.data,
  (newValue, oldValue) => {
    graph.value.data(newValue);
    graph.value.render();
  }
);

onMounted(() => {
  graph.value = new G6.Graph({
    container: document.getElementById("container"),
    width: 1000,
    height: 800,
    fitView: true,
    modes: {
      default: [
        "drag-canvas",
        "drag-node",
        {
          type: "zoom-canvas",
        },
      ],
    },
    layout: {
      type: "dagre",
      rankdir: "LR",
      align: undefined, // undefined means 'center' by defaults
      nodesepFunc: () => 1,
      ranksepFunc: () => 1,
      linkDistance: () => 300,
    },
    defaultNode: {
      // size: [30, 20],
      type: "rect",
      style: {
        lineWidth: 2,
        stroke: "#5B8FF9",
        fill: "#C6E5FF",
      },
    },
    defaultEdge: {
      size: 0.5,
      color: "#e2e2e2",
      style: {
        endArrow: {
          path: "M 0,0 L 8,4 L 8,-4 Z",
          fill: "#e2e2e2",
        },
      },
    },
  });
  // graph.container = document.getElementById("container");

  const data = {
    nodes: props.data.nodes,
    edges: props.data.edges,
  };
  console.log(props);
  graph.value.data(data);
  graph.value.render();
});

// onMounted(() => {
//   const data = {
//     nodes: props.nodes,
//     edges: props.edges,
//   };

//   console.log(props.nodes, props.edges);

//   const container = document.getElementById("container");
//   // const width = 1500;
//   // const height = 1500;
//   // const graph = new G6.Graph({
//   //   container: "container",
//   //   width,
//   //   height,
//   //   fitView: true,
//   //   modes: {
//   //     default: [
//   //       "drag-canvas",
//   //       "drag-node",
//   //       {
//   //         type: "zoom-canvas",
//   //       },
//   //     ],
//   //   },
//   //   layout: {
//   //     type: "dagre",
//   //     rankdir: "LR",
//   //     align: "DL",
//   //     nodesepFunc: () => 1,
//   //     ranksepFunc: () => 1,
//   //     linkDistance: () => 300,
//   //   },
//   //   defaultNode: {
//   //     // size: [30, 20],
//   //     type: "rect",
//   //     style: {
//   //       lineWidth: 2,
//   //       stroke: "#5B8FF9",
//   //       fill: "#C6E5FF",
//   //     },
//   //   },
//   //   defaultEdge: {
//   //     size: 1,
//   //     color: "#e2e2e2",
//   //     style: {
//   //       endArrow: {
//   //         path: "M 0,0 L 8,4 L 8,-4 Z",
//   //         fill: "#e2e2e2",
//   //       },
//   //     },
//   //   },
//   // });
//   graph.data(data);
//   graph.render();

//   if (typeof window !== "undefined")
//     window.onresize = () => {
//       if (!graph || graph.get("destroyed")) return;
//       if (!container || !container.scrollWidth || !container.scrollHeight)
//         return;
//       graph.changeSize(container.scrollWidth, container.scrollHeight);
//     };
// });
</script>

<template>
  <div>
    <h1>Dagre Graph G6</h1>
    <div id="container"></div>
  </div>
</template>
