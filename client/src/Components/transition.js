import React, { Component } from 'react';
import { scaleLinear, scaleBand } from 'd3-scale';
import { max, range } from 'd3-array';
// import { axisBottom, axisLeft } from 'd3-axis';
import { transition } from 'd3-transition';
import { select } from 'd3-selection';

class Transition extends Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentDidMount() {
        //Width and heig
        var node = this.node;
        var w = 600;
        var h = 250;
        this.setState({w: 600});
        this.setState({h: 250});

        var dataset = [ 5, 10, 13, 19, 21, 25, 22, 18, 15, 13,
        				11, 12, 15, 20, 18, 17, 16, 18, 23, 25 ];
        
        // var xScale = d3.scaleBand()s
        var xScale = scaleBand()
            .domain(range(dataset.length))
            .rangeRound([0, w])
            .paddingInner(0.05);

        // var yScale = d3.scaleLinear()
        var yScale = scaleLinear()
            .domain([0, max(dataset)])
            .range([0, h]);

        //Create SVG element
        // var svg = d3.select("body")
        // var svg = select("body")
        //     .append("svg")
        //     .attr("width", w)
        //     .attr("height", h);

        //Create bars
        select(node).selectAll("rect")
            .data([11, 12, 15, 20, 18, 17, 16, 18, 23, 25,
                5, 10, 13, 19, 21, 25, 22, 18, 15, 13])
            .enter()
            .append("rect")
            .attr("x", function (d, i) {
                return xScale(i);
            })
            .attr("y", function (d) {
                return h - d * 20;
            })
            .attr("width", xScale.bandwidth())
            .attr("height", function (d) {
                return d * 20;
            })
            .attr("fill", function (d) {
                return "rgb(0, 0, " + Math.round(d * 10) + ")";
            });

        //Create labels
        select(node).selectAll("text")
            .data([11, 12, 15, 20, 18, 17, 16, 18, 23, 25,
                5, 10, 13, 19, 21, 25, 22, 18, 15, 13])
            .enter()
            .append("text")
            .text(function (d) {
                return d;
            })
            .attr("text-anchor", "middle")
            .attr("x", function (d, i) {
                return xScale(i) + xScale.bandwidth() / 2;
            })
            .attr("y", function (d) {
                return h - d * 20 + 14;
            })
            .attr("font-family", "sans-serif")
            .attr("font-size", "11px")
            .attr("fill", "white");


        //On click, update with new data
        select("p")
            .on("click", function () {

                //New values for dataset
                dataset = [11, 12, 15, 20, 18, 17, 16, 18, 23, 25,
                    5, 10, 13, 19, 21, 25, 22, 18, 15, 13];

                //Update all rects
                transition(select(node).selectAll("rect"))
                    .data(dataset)
                    .transition()								// <-- This makes it a smooth transition!
                    .attr("y", function (d) {
                        return h - yScale(d);
                    })
                    .attr("height", function (d) {
                        return yScale(d);
                    })
                    .attr("fill", function (d) {
                        return "rgb(0, 0, " + Math.round(d * 10) + ")";
                    });

                //Update all labels
                select(node).selectAll("text")
                    .data(dataset)
                    .text(function (d) {
                        return d;
                    })
                    .attr("x", function (d, i) {
                        return xScale(i) + xScale.bandwidth() / 2;
                    })
                    .attr("y", function (d) {
                        return h - yScale(d) + 14;
                    });

            });
    }
    

    render() {
        return (
            <div>
                <p>Click on this text to update the chart with new data values (once).</p>
                <svg width={this.state.width} height={this.state.h} ref={node => this.node = node}></svg>
            </div>
        )
    }

};

export default Transition;