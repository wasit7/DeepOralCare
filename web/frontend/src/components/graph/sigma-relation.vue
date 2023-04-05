<script setup>
import Sigma from "sigma";
import Graph from "graphology";
import { MultiGraph } from "graphology";
import getNodeProgramImage from "sigma/rendering/webgl/programs/node.image";
import ForceSupervisor from "graphology-layout-force/worker";

import circleLoading from "../loading/circle-loading.vue";

import { onMounted, onUpdated, ref, reactive, watch, watchEffect } from "vue";


//  props
const props = defineProps({
  graphData: {
    type: Object,
    required: true,
  },
  exploreData: Object,
});

// state
const graphLoading = ref(false);
let draggedNode = ref(null);
let isDragging = ref(false);
let isHovering = ref(false);
let hoveredNode = ref(null);
let hoveredNeighbors = ref(null);
let selectedNode = ref(null);

const searchInputFocus = ref(false);
const searchHightlightNode = ref('');
const selectedNodeHightlight = ref({});
const nodeFilter = ref([]);
const sigmaRenderer = ref(null);
/* 
  Configure graph
  Document https://graphology.github.io/standard-library/layout-force.html
*/
const CONFIG_GRAPH = {
  maxIterations: 120,
  isNodeFixed: (_, attr) => attr.highlighted,
  settings: {
    attraction: 0.0005, // default 0.0005
    repulsion: 0.1, // default 0.1
    gravity: 0.0001, // default 0.0001
    inertia: 0.3, // default 0.6
    maxMove: 70, // default 200
    draggedNode: true
  },
};

const emits = defineEmits(["clickNode", "doubleClickNode"]);
const graph = new Graph({ multi: true, type: "mixed" });
// TODO: Layout can fix here
const layout = ref();

onMounted(() => {
  layout.value = new ForceSupervisor(graph, CONFIG_GRAPH);
});

watch(
  () => props.graphData,
  (newValue, oldValue) => {
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
        type: "arrow",
        label: edge.relation,
        size: 2,
      });
    });
    graph.nodes().forEach((node, i) => {
      const angle = (i * 2 * Math.PI) / graph.order;
      // graph.setNodeAttribute(node, "x", 100 * Math.cos(angle));
      // graph.setNodeAttribute(node, "y", 100 * Math.sin(angle));
      graph.setNodeAttribute(node, "x", Math.random(0, 100));
      graph.setNodeAttribute(node, "y", Math.random(0, 100));
    });
    refresh_Graph(graph);
  },
  { deep: true }
);

watch(
  () => props.exploreData,
  (newValue, oldValue) => {
    console.log("exploreData", newValue);
    if (newValue) {
      newValue.nodes.map((node) => {
        // check old node in graphData before add new node
        if (!props.graphData.nodes.find((n) => n.id === node.id)) {
          graph.addNode(node.id, {
            size: 18,
            label: node.label,
            color: node?.color,
          });
        }
      });
      newValue.edges.map((edge) => {
        graph.addEdge(edge.source, edge.target, {
          type: "arrow",
          label: edge.relation,
          size: 2,
          weight: 100,
        });
      });
      graph.nodes().forEach((node, i) => {
        const angle = (i * 2 * Math.PI) / graph.order;
        graph.setNodeAttribute(node, "x", 100 * Math.cos(angle));
        graph.setNodeAttribute(node, "y", 100 * Math.sin(angle));
      });
      layout.value.start();
    }
  },
  { deep: true }
);

const create_Graph = async (graph) => {
  graphLoading.value = false;
  console.log("G1:", graph);

  const container = document.getElementById("sigma-container");
  const renderer = new Sigma(graph, container, {
    renderEdgeLabels: true,
    allowInvalidContainer: true,
    stagePadding: 180,
  });
  layout.value.start();

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
    layout.value.start();
  });

  // On mouse up, we reset the autoscale and the dragging mode
  renderer.getMouseCaptor().on("mouseup", () => {
    if (draggedNode.value) {
      graph.removeNodeAttribute(draggedNode.value, "highlighted");
    }
    isDragging.value = false;
    draggedNode.value = null;
    layout.value.stop();
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

  renderer.on("doubleClickNode", (e) => {
    e.preventSigmaDefault();
    const { node } = e;
    emits("doubleClickNode", node);
  });

  sigmaRenderer.value = renderer;
};

const onBlur = () => {
  setTimeout(() => {
    searchInputFocus.value = false
  }, 150);
}

const onSearch = (value) => {
  searchInputFocus.value = true;
  searchHightlightNode.value = value
  console.log(value, searchHightlightNode.value);
  nodeFilter.value = props.graphData.nodes.filter( (node) => node.label.includes(searchHightlightNode.value));
  console.log(nodeFilter.value);
}

const onSelected = (node) => {
  selectedNodeHightlight.value = node;
  searchHightlightNode.value = node.label
}

const onNodeCameraHighlight = async () => {
  // setCamera
  const renderer = sigmaRenderer.value;
  const node = selectedNodeHightlight.value;
  // console.log(`set camera for `, node.id);
  console.log(sigmaRenderer.value);
  graph.setNodeAttribute(node.id, "cameraHightlightNode", true);
  const cameraHightlightNode = renderer.getNodeDisplayData(node.id);

  if (cameraHightlightNode)
      renderer.getCamera().animate(
        { ...cameraHightlightNode, ratio: 0.05 },
        {
          duration: 600,
        },
      );

    return () => {
      graph.setNodeAttribute(node.id, "cameraHightlightNode", false);
    };
}

const refresh_Graph = async (graph) => {
  layout.value.kill();
  layout.value = new ForceSupervisor(graph, CONFIG_GRAPH);
  var g = document.querySelector("#sigma-container");
  var p = g.parentNode;
  p.removeChild(g);
  var c = document.createElement("div");
  c.setAttribute("id", "sigma-container");
  c.setAttribute("class", "w-full h-full relative");
  p.appendChild(c);

  const renderer = await create_Graph(graph);
  return renderer
};
</script>

<template>
  <div class="relative z-50">
    <circle-loading v-if="graphLoading" column />
    <div class="search-node absolute w-4/12 m-auto left-0 right-0 top-28">
      <form>
        <label
          for="default-search"
          class="mb-2 text-xs font-medium text-gray-900 sr-only dark:text-white"
        >
          search in nodes
        </label>
        <div class="relative">
          <div
            class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
          >
            <svg
              aria-hidden="true"
              class="w-5 h-5 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
          <input
            type="search"
            @input="onSearch($event.target.value)"
            @blur="onBlur"
            v-model="searchHightlightNode"
            id="default-search"
            class="block w-full p-2.5 pl-10 text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-secondary-light focus:border-secondary-light dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            placeholder="search in nodes"
            required
          />
          <button
            @click="onNodeCameraHighlight"
            type="button"
            class="text-white absolute right-2.5 bottom-1.5 bg-secondary-light hover:bg-secondary focus:ring-4 focus:outline-none focus:ring-secondary-light font-light rounded-lg text-xs px-2 py-1"
          >
            Search
          </button>
        </div>
      </form>
    </div>

    <div
      id="dropdown"
      :class="`${
        searchInputFocus ? 'block ' : 'hidden'
      } absolute z-10 m-auto top-38 left-0 right-0 bg-white divide-y divide-gray-100 rounded-b-lg shadow w-4/12 max-h-80 overflow-scroll`"
    >
      <ul
        v-for="(node, index) in nodeFilter" :key="node.id"
        class="py-0 text-sm text-gray-700 dark:text-gray-200 divide-y divide-gray-200"
        aria-labelledby="dropdown-button"
      >
        <li @click="onSelected(node)">
          <button
            type="button"
            class="inline-flex content-center items-baseline gap-x-3 w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
          >
            <span 
              :style="{ backgroundColor: node.color}"
              :class="`flex w-3 h-3 rounded-full`"></span>
            {{ node.label }}
          </button>
        </li>

      </ul>
    </div>
  </div>
  <div id="sigma-container"></div>
</template>

<style lang="scss" scoped>
.sigma-container {
  width: 100%;
  height: 100%;
}
</style>
