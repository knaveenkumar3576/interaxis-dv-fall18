import React from 'react'
import * as d3 from 'd3'
import './Chart.css'
import {select} from "d3";

class ScatterPlot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '#' + props.id,
            height: props.height,
            width: props.width
        };

        select(props.id).selectAll("*").remove();

        this.renderD3 = this.renderD3.bind(this);
        this.updateD3 = this.updateD3.bind(this);
    }

    componentDidMount() {
        this.renderD3()
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.dataPoints !== prevProps.dataPoints || this.props.labels !== prevProps.labels) {
            this.updateD3();
        }
    }

    componentWillReceiveProps(props) {
        if (props.width > 0 && props.height > 0) {
            this.setState({
                height: props.height,
                width: props.width
            }, () => {
                select(this.state.id).selectAll("*").remove();
                this.renderD3();
            });
        }
    }

    render() {

        let width = this.state.width, height = this.state.height;

        return (
            <div style={{width: width, height: height}}>
                {this.props.chart}
            </div>
        )
    }

    renderD3() {
        const that = this.props;

        var data = this.props.dataPoints;
        var labels = this.props.labels;

        var margin = {top: 30, right: 30, bottom: 100, left: 100},
            width = this.state.width - margin.left - margin.right,
            height = this.state.height - margin.top - margin.bottom;

        var svg = d3.select(this.state.id).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var x = d3.scaleLinear()
            .range([0, width]);

        var y = d3.scaleLinear()
            .range([height, 0]);

        var xAxis = d3.axisBottom(x);

        var yAxis = d3.axisLeft(y);

        x.domain(d3.extent(data, function (d) {
            return d[labels.x];
        })).nice();
        y.domain(d3.extent(data, function (d) {
            return d[labels.y];
        })).nice();

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("y", 25)
            .attr("x", width / 2)
            .style("text-anchor", "end")
            .text(labels.x);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("y", height / 2)
            .attr("transfsorm", "rotate(-90)")
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(labels.y)

        var dot_g = svg.append('g')
            .attr('class', 'lassoable');

        dot_g.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("id", function (d, i) {
                return "dot_" + i;
            }) // added
            .attr("class", "dot")
            .attr("r", 4)
            .attr("cx", function (d) {
                return x(d[labels.x]);
            })
            .attr("cy", function (d) {
                return y(d[labels.y]);
            })
            .attr("draggable", "true")
            .style("fill", "red")
            .on("dragstart", function (d, i) {
                console.log("Dragging started");
                console.log("DAtaPoint: ");
                console.log(d);
                d3.event.dataTransfer.setData("data", JSON.stringify(d));
            })
            .on("mouseover", function (d, i) {
                console.log("Mouse over ...");
                // that.detailViewCallback(i);
            })
            .on("mouseout", function (d) {
                console.log("Mouse out ...");
            });

    }

    updateD3() {

        const that = this.props;
        var data = this.props.dataPoints;
        var labels = this.props.labels;

        var margin = {top: 30, right: 30, bottom: 100, left: 100},
            width = this.state.width - margin.left - margin.right,
            height = this.state.height - margin.top - margin.bottom;

        var svg = d3.select(this.state.id).select('svg');

        var x = d3.scaleLinear()
            .range([0, width]);

        var y = d3.scaleLinear()
            .range([height, 0]);

        x.domain(d3.extent(data, function (d) {
            return d[labels.x];
        })).nice();
        y.domain(d3.extent(data, function (d) {
            return d[labels.y];
        })).nice();

        var xAxis = d3.axisBottom(x);

        var yAxis = d3.axisLeft(y);

        var t = d3.transition()
            .duration(500)

        svg.select(".x")
            .transition(t)
            .call(xAxis)

        svg.select(".y")
            .transition(t)
            .call(yAxis)

        var dot_g = svg.select('g')
            .attr('class', 'lassoable')
            .selectAll(".dot")
            .data(data);

        dot_g.exit().remove();

        dot_g.enter()
            .append("circle")
            .attr('r', 0)
            .attr("draggable", "true")
            .attr("id", function (d, i) {
                return "dot_" + i;
            })
            .attr("class", "dot")
            .attr("r", 4)
            .attr("cx", function (d) {
                return x(d[labels.x]);
            })
            .attr("cy", function (d) {
                return y(d[labels.y]);
            })
            .style("fill", "red")
            .on("dragstart", function (d, i) {
                console.log("Dragging started");
                console.log("DAtaPoint: ");
                console.log(d);
                d3.event.dataTransfer.setData("data", JSON.stringify(d));
            })
            .on("mouseover", function (d, i) {
                console.log("Mouse over ...");
                // that.detailViewCallback(i);
            })
            .on("mouseout", function (d) {
                console.log("Mouse out ...");
            })
            .merge(dot_g)
            .transition()
            .duration(500)
            .attr("id", function (d, i) {
                return "dot_" + i;
            }) // added
            .attr("class", "dot")
            .attr("r", 4)
            .attr("cx", function (d) {
                return x(d[labels.x]);
            })
            .attr("cy", function (d) {
                return y(d[labels.y]);
            })
            .attr("draggable", "true")
            .style("fill", "red");
    }
}

ScatterPlot.defaultProps = {
    chart: 'loading...'
};

export default ScatterPlot;
