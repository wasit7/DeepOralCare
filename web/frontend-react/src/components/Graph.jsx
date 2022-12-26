import React, { useState } from "react";
import { memo } from "react";

//NPM Packages
import { MultiDirectedGraph } from "graphology";
import { SigmaContainer } from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";

//Components
import GraphDataController from "./GraphDataController";
import GraphEventsController from "./GraphEventsController";
import GraphSettingsController from "./GraphSettingsController";

const DisplayGraph = (props) => {

    const [hoveredNode, setHoveredNode] = useState(null);

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
                <GraphSettingsController hoveredNode={hoveredNode} />
                <GraphEventsController setHoveredNode={setHoveredNode} {...props} />
                <GraphDataController nodes={props.nodes} />
            </SigmaContainer>
        </div>
    );
};

export default memo(DisplayGraph);
