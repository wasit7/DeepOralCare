<script setup>
import G6 from "@antv/g6";
import { defineProps, defineEmits, onMounted, watch, ref, toRaw } from "vue";

const emit = defineEmits(["clickNode", "dblclickNode", "rightclickNode"]);

const props = defineProps({
  nodeExplore: {
    type: Object,
    default: {},
  },
  data: {
    type: Object,
  },
});

const graph = ref(null);

onMounted(() => {
  // initialize graph
  const graphElement = document.getElementById("dagre-graph");
  const containerElement = document.getElementById("container");
  const calPadding = (num, percent) => (num / 100) * percent;
  const graphPaddingX = calPadding(containerElement.scrollWidth, 30);
  const graphPaddingY = calPadding(containerElement.scrollHeight, 30);
  const paddingDimension = [
    graphPaddingX,
    graphPaddingY,
    graphPaddingX,
    graphPaddingY,
  ];
  const width = containerElement.scrollWidth || 1600;
  const height = containerElement.scrollHeight || 1200;

  // console.log(paddingDimension, [width, height]);

  graph.value = new G6.Graph({
    container: graphElement,
    width: width,
    height: height,
    fitCenter: true,
    // fitView: true,
    fitViewPadding: paddingDimension,
    animate: true,
    animateCfg: {
      duration: 1200,
    },
    modes: {
      default: [
        "drag-canvas",
        "drag-node",
        // "brush-select",
        {
          type: "zoom-canvas",
        },
      ],
      // altSelect: [
      //   "drag-node",
      //   {
      //     type: "brush-select",
      //     trigger: "drag",
      //   },
      // ],
    },
    layout: {
      type: "dagre",
      rankdir: "LR",
      align: undefined, // undefined means 'start-node' and 'end-node' position are 'center' by defaults
      nodesepFunc: () => 1,
      ranksepFunc: () => 50,
      linkDistance: () => 20,
    },
    defaultNode: {
      size: [40, 40],
      type: "circle",
      labelCfg: {
        position: "top",
      },
      style: {
        lineWidth: 1,
        stroke: "#5B8FF9",
        fill: "#C6E5FF",
      },
    },
    defaultEdge: {
      size: 1,
      color: "lightgrey",
      labelCfg: {
        // position: "middle",
        refY: 15,
      },
      style: {
        opacity: 1,
        lineWidth: 1,
        endArrow: {
          path: "M 0,0 L 8,4 L 8,-4 Z",
          fill: "lightgrey",
        },
        startArrow: false,
      },
      nodeStateStyles: {
        // The node style when the state 'hover' is true
        hover: {
          fill: "lightsteelblue",
          stroke: "#000",
          lineWidth: 3,
        },
        // The node style when the state 'click' is true
        click: {
          stroke: "#000",
          lineWidth: 3,
        },
      },
    },
  });

  // data from props.data in the first-time maybe empty
  const data = {
    nodes: props.data.nodes,
    edges: props.data.edges,
  };
  // data data, then render graph
  graph.value.data(data);
  graph.value.render();

  // graph events-binding
  graph.value.on("node:click", (evt) => {
    const nodeModel = toRaw(evt.item._cfg.model);
    emit("clickNode", nodeModel.id);
  });

  graph.value.on("node:dblclick", (evt) => {
    const nodeModel = toRaw(evt.item._cfg.model);
    console.log("node has been double-clicked ", nodeModel);
    emit("dblclickNode", nodeModel.id);
  });

  const doubleTouchEventDelay = 300; // ms
  let lastTabTimestamp = 0;
  graph.value.on("node:touchstart", (event) => {
    const nodeItem = toRaw(event.item._cfg.model);
    console.log(nodeItem);

    const currentTimeMs = new Date().getTime();
    const tabDelay = currentTimeMs - lastTabTimestamp;
    if (tabDelay < doubleTouchEventDelay ) {
      console.log('double tab event emits');
      emit("dblclickNode", nodeItem.id);
    }
    lastTabTimestamp = tabDelay;
    emit("clickNode", nodeItem.id);
  })

  graph.value.on("node:contextmenu", (evt) => {
    const nodeModel = toRaw(evt.item._cfg.model);
    console.log("node has been right-clicked (contextmenu) ", nodeModel);
  });

  graph.value.on("node:mouseenter", (e) => {
    const nodeItem = e.item; // Get the target item
    console.log(`hover on `, nodeItem);
    graph.value.setItemState(nodeItem, "hover", true); // Set the state 'hover' of the item to be true
  });

  // Mouse leave a node
  graph.value.on("node:mouseleave", (e) => {
    const nodeItem = e.item; // Get the target item
    graph.value.setItemState(nodeItem, "hover", false); // Set the state 'hover' of the item to be false
  });

});

watch(
  () => props.data,
  (newValue, oldValue) => {
    // after search
    graph.value.data(newValue);
    graph.value.render();
  }
);

watch(
  () => props.nodeExplore,
  (newValue, oldValue) => {
    // after double-click on node
    newValue.nodes.forEach((node) => graph.value.addItem("node", node));
    newValue.edges.forEach((edge) => graph.value.addItem("edge", edge));
    graph.value.layout();
  }
);
</script>

<template>
  <div id="container" class="w-full h-full p-5">
    <div id="dagre-graph"></div>
  </div>
</template>
