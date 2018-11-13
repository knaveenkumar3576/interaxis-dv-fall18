import React from 'react';
import ReactDOM from 'react-dom';
import {forceSimulation, forceManyBody, forceCenter, forceCollide} from 'd3-force';
import {select} from 'd3-selection';

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
            .force('charge', forceManyBody().strength(70))
            .force('center', forceCenter(self.props.width / 2, self.props.height / 2))
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
        console.log("Before adding " + self.props.position);
        console.log(self.state.nodes.length);
        console.log(self.state.nodes);
        self.setState({nodes: [...self.state.nodes, dataPoint]}, function() {
            console.log("After adding " + self.props.position);
            console.log(self.state.nodes.length);
            console.log(self.state.nodes);

            forceSimulation(self.state.nodes)
                .force('charge', forceManyBody().strength(70))
                .force('center', forceCenter(self.props.width / 2, self.props.height / 2))
                .force('collision', forceCollide().radius(function (d) {
                    return 7;
                }))
                .on('tick', function () {
                    var circles = select(ReactDOM.findDOMNode(self.refs.svg))
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

            let currDataPoints = self.state.nodes;
            let success = this.props.addDataPointCallback(currDataPoints, this.props.position);
            if (success) {
                console.log("Success");
            } else {
                console.log("Failure");
            }
        });

        // Update the force layout and re-render the svg
        /* let simulation = forceSimulation(self.state.nodes)
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
            }); */
        /* Invoke callback function, passing the dataPoint as data */
    }

    removeDataPoint(dataPoint) {
        let self = this
        console.log("Double Click ...");
        let that = this.props;
        /* TODO: uniquely identify the data point */
        let idKeyString = "";
        if (that.dataset == "football") {
            idKeyString = "Sno"; 
        }
        else if (that.dataset == "census") {
            idKeyString = "CensusId";
        }
        /* TODO: Remove data point from nodes in state */
        let newNodes = this.state.nodes.filter((node) => {
            return node[idKeyString] !== dataPoint[idKeyString]
        })
        this.setState({nodes: newNodes}, () => {
            /* Update the force layout and re-render */
            self.simulation = forceSimulation(self.state.nodes)
                .force('charge', forceManyBody().strength(70))
                .force('center', forceCenter(self.props.width / 2, self.props.height / 2))
                .force('collision', forceCollide().radius(function (d) {
                    return 7;
                }))
                .on('tick', function () {
                    var circles = select(ReactDOM.findDOMNode(self.refs.svg))
                        .selectAll('circle')
                        .data(self.state.nodes);

                    circles.enter()
                        .append('circle')
                        .attr('r', function (d) {
                            return 7;
                        })
                        .attr('cx', function (d) {
                            return d.x
                        })
                        .attr('cy', function (d) {
                            return d.y
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
            let success = this.props.removeDataPointCallback(currDataPoints, this.props.position);
            if (success) {
                console.log("Success");
            } else {
                console.log("Failure");
            }
        });  
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