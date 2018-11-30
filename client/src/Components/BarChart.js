import React from 'react';
import {select} from 'd3-selection';
import {scaleBand, scaleLinear} from 'd3-scale';
import {min, max, domain, range} from 'd3-array';
import {axisTop} from 'd3-axis';
import {transition} from 'd3-transition';

let svgStyle = {
    backgoundColor: "black"
};

class BarChart extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            id: '#' + props.id,
            dataset: [],
            height: props.height,
            width: props.width,
            barWidth: props.barWidth
        };

        select(props.id).selectAll("*").remove();

        this.drawBars = this.drawBars.bind(this);

    }

    componentWillReceiveProps(props) {
        if (props.height > 0 && props.width > 0) {
            this.setState({
                height: props.height,
                width: props.width
            }, () => {
                select(this.state.id).selectAll("*").remove();
                this.drawBars();
            });
        }

        console.log("Props");
        console.log(this.props);
        console.log("Accessing data object");
        console.log(this.props.dataObject);
        let dataObject = this.props.dataObject;
        let dataset = []
        console.log(typeof (dataObject));
        Object.keys(dataObject).forEach((k) => {
            let obj = {
                key: k,
                value: parseInt(dataObject[k])
            }
            console.log("Object barchart: ");
            console.log(obj);
            dataset.push(obj);
        });

        this.setState({
            dataset: dataset
        });

        console.log("Dataset:");
        console.log(this.state.dataset);

    }

    drawBars() {
        let height = this.state.height;
        let width = this.state.width;
        let barWidth = this.state.barWidth;
        let id = this.state.id;

        // this.setState({height: height, width: width});

        let marginLeft, marginRight, marginTop, marginBottom;
        marginRight = marginLeft = width * 0.05;
        marginTop = marginBottom = 20;

        let minValue = min(this.state.dataset, function(d) {
            return d.value;
        });
        let maxValue = max(this.state.dataset, function(d) {
            return d.value;
        });

        let totalScale = scaleLinear()
            .domain([minValue, maxValue])
            .range([0, width]);

        var yScale = scaleBand()
            .domain(range(this.state.dataset.length))
            .range([0, height])
            .padding(0.05);

        var xAxis = axisTop()
            .scale(totalScale);

        let svg = select(id)
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        let axis = svg.append("g")
            .attr("transform", function () {
                return "translate(" + marginLeft + ", " + marginTop + ")";
            })
            .call(xAxis);

        let g = svg.append("g")
            .attr("transform", "translate(" + marginLeft + ", " + (marginTop + 5) + ")");

        let bars = g.selectAll("rect")
            .data(this.state.dataset)
            .enter()
            .append("rect")
            .attr("class", function (d) {
                // console.log("class: " + d + " " + d.value);
                return d.value < 0 ? "negative" : "positive";
            })
            .attr("x", function (d, i) {
                // console.log("x: " + d.value < 0 ? totalScale(d.value) : totalScale(0));
                // console.log(typeof(d.value));
                // console.log(d.value);
                // console.log(totalScale(d.value));
                // console.log(typeof(totalScale(d.value)));
                return (d.value < 0 ? totalScale(d.value) : totalScale(0));
            })
            .attr("y", function (d, i) {
                return yScale(i);
            })
            .attr("width", function (d, i) {
                return Math.abs(totalScale(0) - totalScale(d.value));
            })
            .attr("height", barWidth)
            .style("fill", function (d) {
                return d.value < 0 ? "red" : "blue";
            });

        let text = g.selectAll("text")
            .data(this.state.dataset)
            .enter()
            .append("text")
            .attr("x", function(d, i) {
                return (d.value < 0 ? totalScale(d.value) : totalScale(0));
            })
            .attr("y", function (d, i) {
                return yScale(i);
            })
            .attr("fill", "black")
            .style("font-size", 5)
            .text(function(d) {
                return d.key;
            });
    }

    componentDidUpdate() {
        return true
    }

    render() {
        return (
            <div ref={node => this.node = node} className=".container">
            </div>
        )
    }
}

 /* dataset: [
                {
                    key: "hello",
                    value: 0.5, 
                }, {
                    key: "world", 
                    value: 0.5
                }, {
                    key: "Attribute 1",
                    value: -0.35
                }, {
                    key: "barchart", 
                    value: 0.35
                }, {
                    key: "foobars",
                    value: -0.15
                }, {
                    key: "HP",
                    value: 0.15
                }, {
                    key: "foo",
                    value: -0.50
                }, {
                    key: "bar",
                    value: 0.25
                }
            ],
            */

export default BarChart;