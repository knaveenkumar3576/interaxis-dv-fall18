import React from 'react';
import ReactDOM from 'react-dom';
import {forceSimulation, forceManyBody, forceCenter, forceCollide} from 'd3-force';
import {select} from 'd3-selection';
import PropTypes from 'prop-types';

/** Props:
 * Position: xMax, xMin, yMax, yMin
 * Callback: to restore circle back to the scatterplot on double click
 */
class DropZone extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nodes: [],
            height: 0,
            width: 0
        };

        // Function bindings
        this.addDataPoint = this.addDataPoint.bind(this);
        this.removeDataPoint = this.removeDataPoint.bind(this);
        this.dragOverHandler = this.dragOverHandler.bind(this);
        // this.ticked = this.ticked.bind(this);
    }

    componentWillReceiveProps(props) {
        if (props.height > 0 && props.width > 0) {
            this.setState({
                height: props.height,
                width: props.width
            })
        }
    }

    // Create an empty SVG with a force layout with no nodes
    componentDidMount() {
        let self = this;
        console.log("REFS SVG: ");
        console.log(self.refs.svg);
        let simulation = forceSimulation(self.state.nodes)
            .force('charge', forceManyBody().strength(5))
            .force('center', forceCenter(self.width / 2, self.height / 2))
            .force('collision', forceCollide().radius(function (d) {
                return 7;
            }))
            .on('tick', function () {
                var circles = select(".svg")
                    .selectAll('circle')
                    .data(self.state.nodes);

                circles.enter(circles)
                    .append('circle')
                    .attr('r', function (d) {
                        return 7
                    }).merge(circles)
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
        let that = this.props;
        event.preventDefault();
        let self = this
        console.log("Dropped ... Adding point ...");
        // Add point to div
        console.log("Dropped point: ");
        console.log(event.dataTransfer.getData("data"));
        /* extract the points "data" from event.dataTrasnfer object */
        let datapointjson = event.dataTransfer.getData("data");
        console.log(datapointjson);
        let dataPoint = JSON.parse(datapointjson);
        console.log(dataPoint);
        /* Add data point to the nodes array in the state of this component*/
        /* TODO: Changing state manually, change state using setState() method*/
        self.setState({nodes: self.state.nodes.push(dataPoint)});

        // Update the force layout and re-render the svg
        let simulation = forceSimulation(self.state.nodes)
            .force('charge', forceManyBody().strength(5))
            .force('center', forceCenter(self.width / 2, self.height / 2))
            .force('collision', forceCollide().radius(function (d) {
                return 7;
            }))
            .on('tick', function () {
                var circles = select(".svg")
                    .selectAll('circle')
                    .data(self.state.nodes);

                circles.enter()
                    .append('circle')
                    .attr('r', function (d) {
                        return 7;
                    })
                    .on("dblclick", function (d, i) {
                        // event.preventDefault();
                        console.log("Double click on data point");
                        console.log("Datapoint: ");
                        console.log(d);

                        self.removeDataPoint(dataPoint);
                    })
                    .merge(circles)
                    .attr('cx', function (d) {
                        return d.x
                    })
                    .attr('cy', function (d) {
                        return d.y
                    });

                circles.exit()
                    .remove();
            });
        /* Invoke callback function, passing the dataPoint as data */
        let currDataPoints = self.state.nodes;
        let success = that.removeDataPointFromScatter(currDataPoints, that.position);
        if (success) {
            console.log("Success");
        }
        else {
            console.log("Failure");
        }
    }

    removeDataPoint(dataPoint) {
        let self = this
        console.log("Double Click ...");
        let that = this.props;
        /* TODO: uniquely identify the data point */
        /* TODO: Remove data point from nodes in state */
        /* Update the force layout and re-render */
        self.simulation = forceSimulation(self.state.nodes)
            .force('charge', forceManyBody().strength(5))
            .force('center', forceCenter(self.width / 2, self.height / 2))
            .force('collision', forceCollide().radius(function (d) {
                return 7;
            }))
            .on('tick', function () {
                var circles = select(".svg")
                    .selectAll('circle')
                    .data(self.state.nodes);

                circles.enter()
                    .append('circle')
                    .attr('r', function (d) {
                        return 7;
                    })
                    .merge(circles)
                    .attr('cx', function (d) {
                        return d.x
                    })
                    .attr('cy', function (d) {
                        return d.y
                    });

                circles.exit()
                    .remove();
            });
        /* Invoke callback to add dataPoint to the scatterplot */
        let currDataPoints = this.state.nodes;
        let success = that.addDataPointFromScatter(currDataPoints, that.position);
        if (success) {
            console.log("Success");
        } else {
            console.log("Failure");
        }
    }

    dragOverHandler(event) {
        event.preventDefault();
        console.log("Drag over ...");
        // Change background color
        this.setState({backgroundColor: "gray"});
    }

    render() {
        let dropZoneDiv = {
            width: this.state.width,
            height: this.state.height,
            backgroundColor: "lightgreen"
        };
        return (
            <div
                style={dropZoneDiv}
                onDragOver={this.dragOverHandler}
                onDragLeave={this.dragLeaveHandler}
                onDrop={this.addDataPoint}>
                <svg width={this.state.width} ref="svg" height={this.state.height} className="svg">
                </svg>
            </div>
        )
    }

};

export default DropZone;