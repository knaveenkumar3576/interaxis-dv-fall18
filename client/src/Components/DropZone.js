import React from 'react';
import ReactDOM from 'react-dom';
import { forceSimulation, forceManyBody, forceCenter, forceCollide } from 'd3-force';
import { select } from 'd3-selection';
import PropTypes from 'prop-types';

 let dropZoneDiv = {
     height: 75,
     width: 75,
     backgroundColor: "lightgreen"
 };

/** Props:
 * Position: xMax, xMin, yMax, yMin  
 * Callback: to restore circle back to the scatterplot on double click
 */
class DropZone extends React.Component {

    height = 100;
    width = 100;
    simulation = null;

    constructor(props) {
        super(props)
        this.state = {
            dataPointList: {}, // List of objects having details about circles
            nodes: [
            ]
        };

        // Function bindings
        this.addDataPoint = this.addDataPoint.bind(this);
        this.removeDataPoint = this.removeDataPoint.bind(this);
        this.dragOverHandler = this.dragOverHandler.bind(this);
        // this.ticked = this.ticked.bind(this);
    }

    // Create an empty SVG with a force layout with no nodes
    componentDidMount() {
        let self = this;
        console.log("REFS SVG: ");
        console.log(self.refs.svg);
        self.simulation = forceSimulation(self.state.nodes)
            .force('charge', forceManyBody().strength(5))
            .force('center', forceCenter(self.width / 2, self.height / 2))
            .force('collision', forceCollide().radius(function (d) {
                return 7;
            }))
            .on('tick', function () {
                var circles = select(self.refs.svg)
                    .selectAll('circle')
                    .data(self.state.nodes);

                circles.enter()
                    .append('circle')
                    .attr('r', function (d) {
                        return 10
                    }).merge()
                    .attr('cx', function (d) {
                        return d.x
                    })
                    .attr('cy', function (d) {
                        return d.y
                    });

                circles.exit()
                    .remove();
            });
    }

    // Re-render when state/props changes
    shouldComponentUpdate() {
        return true
    }

    // On Drop action: 
    /* On dropping a point, 
     */
    addDataPoint(event) {
        event.preventDefault();
        let self = this
        console.log("Dropped ... Adding point ...");
        // Add point to div
        console.log("Dropped point: ");
        console.log(event.dataTransfer.getData("data"));
        /* extract the points "data" from event.dataTrasnfer object */
        let dataPoint = event.dataTransfer.getData("data");
        console.log(dataPoint);
        /* Add data point to the nodes array in the state of this component*/ 
        /* TODO: Changing state manually, change state using setState() method*/
        self.state.node.push(dataPoint);

        // Update the force layout and re-render the svg
        self.simulation = forceSimulation(self.state.nodes)
            .force('charge', forceManyBody().strength(5))
            .force('center', forceCenter(self.width / 2,  self.height / 2))
            .force('collision', forceCollide().radius(function (d) {
                return 7;
            }))
            .on('tick', function() {
                var circles = select(self.refs.svg)
                    .selectAll('circle')
                    .data(self.state.nodes);

                circles.enter()
                    .append('circle')
                    .attr('r', function (d) {
                        return 10
                    }).merge()
                    .attr('cx', function (d) {
                        return d.x
                    })
                    .attr('cy', function (d) {
                        return d.y
                    });
                    
                circles.exit()
                    .remove();
            });
        /* 
         * TODO: Invoke callback function, passing the dataPoint as data 
         * 
        */
    }

    removeDataPoint(event) {
        event.preventDefault();
        console.log("Double Click ...");
        /* TODO: uniquely identify the data point */
        /* Remove data point from nodes in state */
        /* Update the force layout and re-render */
        /* Invoke callback to add dataPoint to the scatterplot */
    }

    dragOverHandler(event) {
        event.preventDefault();
        console.log("Drag over ...");
        // Change background color
        this.setState({backgroundColor: "gray"});
    }

    render() {
        return (
            <div 
                style={dropZoneDiv} 
                onDragOver={this.dragOverHandler}
                onDragLeave={this.dragLeaveHandler}
                onDoubleClick={this.removeDataPoint} 
                onDrop={this.addDataPoint} >
                <svg width={this.width} ref="svg" height={this.height} >
                </svg>
           </div>
        )
    }

};

export default DropZone;