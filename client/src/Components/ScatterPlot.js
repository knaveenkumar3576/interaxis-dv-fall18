import React from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import './Chart.css';
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
        if (this.props.searchString=='' && (this.props.dataPoints !== prevProps.dataPoints || this.props.labels !== prevProps.labels)) {
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
            <div style={{width: width, height: height}} ref="mainDiv">
                {this.props.chart}
            </div>
        )
    }

    renderD3() {
        const that = this.props;
        let self = this;

        var data = this.props.dataPoints;
        var labels = this.props.labels;

        var margin = {top: 30, right: 30, bottom: 30, left: 30},
            width = this.state.width - margin.left - margin.right,
            height = this.state.height - margin.top - margin.bottom;

        var zoom = d3.zoom()
            .scaleExtent([1, 100])
            .extent([
                [0, 0],
                [width, height]
            ])
            .on("zoom", () => {
                console.log("Zoom anonymous");
                console.log(x);
                console.log(y);
                console.log(gX);
                console.log(gY);
                var new_x = d3.event.transform.rescaleX(x);
                var new_y = d3.event.transform.rescaleY(y);
                // update axes
                gX.call(xAxis.scale(new_x));
                gY.call(yAxis.scale(new_y));
                dots.data(data)
                    .attr('cx', function (d) {
                        return new_x(d[labels.x])
                    })
                    .attr('cy', function (d) {
                        return new_y(d[labels.y])
                    }); 
        });

        var svg = d3.select(this.state.id).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .call(zoom);

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

        svg.append("g")			
            .attr("class", "grid")
            .attr("transform", "translate(0," + height + ")")
            .call(
                d3.axisBottom(x)
                .ticks(7)
            .tickSize(-height)
            .tickFormat("")
            );   

        // add the Y gridlines
        svg.append("g")			
            .attr("class", "grid")
            .call(
                d3.axisLeft(y)
                .ticks(7)
            .tickSize(-width)
            .tickFormat("")
            );

        var xAxis = d3.axisBottom(x);

        var yAxis = d3.axisLeft(y);

        svg.append("defs").append("clipPath")
            .attr("id", "clip") 
            .append("rect")
            .attr("width", width)
            .attr("height", height);
        
        var event_rect = svg.append("rect")
            .attr("width", width)
            .attr("height", height)
            .style("fill", "none")
            .style("pointer-events", "all")
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
            .call(zoom);

        var gX = svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("y", 25)
            .attr("x", width / 2)
            .style("text-anchor", "end")
            .text(labels.x);

        var gY = svg.append("g")
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
            .attr('class', 'lassoable')
            .attr("clip-path", "url(#clip)");
        
        var dots = dot_g.selectAll(".dot")
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
                d3.event.dataTransfer.setData("data", JSON.stringify(d));
            })
            .on("click", function(d, i) {
                console.log("Clicked on dot");
            })
            .on("mouseover", function (d, i) {
                console.log("Mouse over ...");
                // rect_ref.style("pointer-events", "none");
                select(this).style('cursor', 'move');
                that.detailViewCallback(i);
            })
            .on("mouseout", function (d) {
                console.log("Mouse out ...");
                // rect_ref.style("pointer-events", "all");
                select(this).style('cursor', 'auto');
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

        svg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", width)
            .attr("height", height);

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

        var gX = svg.select(".x")
            .transition(t)
            .call(xAxis)

        var gY = svg.select(".y")
            .transition(t)
            .call(yAxis)

        var dot_g = svg.select('g')
            .attr('class', 'lassoable')
            .attr("clip-path", "url(#clip)")
            .selectAll(".dot")
            .data(data);

        dot_g.exit().remove();

        var dots = dot_g.enter()
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
                d3.event.dataTransfer.setData("data", JSON.stringify(d));
            })
            .on("mouseover", function (d, i) {
                console.log("Mouse over ...");
                that.detailViewCallback(i);
                select(this).style('cursor', 'move');
            })
            .on("mouseout", function (d) {
                console.log("Mouse out ...");
                select(this).style('cursor', 'auto');
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

        // Zoom functionality
        // var zoom = d3.zoom()
        //     .scaleExtent([.5, 20])
        //     .extent([
        //         [0, 0],
        //         [width, height]
        //     ])
        //     .on("zoom", zoomed);

        function zoomed() {
            var new_x = d3.event.transform.rescaleX(x);
            var new_y = d3.event.transform.rescaleY(y);
            // update axes
            gX.call(xAxis.scale(new_x));
            gY.call(yAxis.scale(new_y));
            dots.data(data)
                .attr('cx', function (d) {
                    return new_x(d[labels.x])
                })
                .attr('cy', function (d) {
                    return new_y(d[labels.y])
                });
        }
    }
}

ScatterPlot.defaultProps = {
    chart: 'loading...'
};

export default ScatterPlot;
