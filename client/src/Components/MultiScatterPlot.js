import React from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import './Chart.css';
import {select} from "d3";

class MultiScatterPlot extends React.Component {
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
        if (this.props.dataPoints1 !== prevProps.dataPoints1 || this.props.labels1 !== prevProps.labels1) {
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

        var data1 = this.props.dataPoints1;
        var data2 = this.props.dataPoints2;

        var labels1 = this.props.labels1;
        var labels2 = this.props.labels2;

        var margin = {top: 30, right: 30, bottom: 100, left: 100},
            width = this.state.width - margin.left - margin.right,
            height = this.state.height - margin.top - margin.bottom;

        var svg = d3.select(this.state.id).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var x1 = d3.scaleLinear()
            .range([0, width]);

        var y1 = d3.scaleLinear()
            .range([height, 0]);

        var x2 = d3.scaleLinear()
            .range([0, width]);

        var y2 = d3.scaleLinear()
            .range([height, 0]);

        x1.domain(d3.extent(data1, function (d) {
            return d[labels1.x];
        })).nice();

        y1.domain(d3.extent(data1, function (d) {
            return d[labels1.y];
        })).nice();

        x2.domain(d3.extent(data2, function (d) {
            return d[labels2.x];
        })).nice();
        
        y2.domain(d3.extent(data2, function (d) {
            return d[labels2.y];
        })).nice();

        var dot_g = svg.append('g')
            .attr('class', 'lassoable');

        dot_g.selectAll(".dot1")
            .data(data1)
            .enter().append("circle")
            .attr("id", function (d, i) {
                return "dot1_" + i;
            }) // added
            .attr("class", "dot1")
            .attr("r", 4)
            .attr("cx", function (d) {
                return x1(d[labels1.x]);
            })
            .attr("cy", function (d) {
                return y1(d[labels1.y]);
            })
            .style("fill", "red")
            .on("mouseover", function (d, i) {
                that.detailViewCallback(i);
                select(this).style('cursor', 'move');
            })
            .on("mouseout", function (d) {
                select(this).style('cursor', 'auto');
            });

        dot_g.selectAll(".dot2")
            .data(data2)
            .enter().append("circle")
            .attr("id", function (d, i) {
                return "dot2_" + i;
            }) // added
            .attr("class", "dot2")
            .attr("r", 4)
            .attr("cx", function (d) {
                return x2(d[labels2.x]);
            })
            .attr("cy", function (d) {
                return y2(d[labels2.y]);
            })
            .style("fill", "green")
            .on("mouseover", function (d, i) {
                that.detailViewCallback(i);
                select(this).style('cursor', 'move');
            })
            .on("mouseout", function (d) {
                select(this).style('cursor', 'auto');
            });
    }

    updateD3() {

        const that = this.props;

        var data1 = this.props.dataPoints1;
        var data2 = this.props.dataPoints2;

        var labels1 = this.props.labels1;
        var labels2 = this.props.labels2;

        var margin = {top: 30, right: 30, bottom: 100, left: 100},
            width = this.state.width - margin.left - margin.right,
            height = this.state.height - margin.top - margin.bottom;

        var svg = d3.select(this.state.id).select('svg');

        // var x = d3.scaleLinear()
        //     .range([0, width]);

        // var y = d3.scaleLinear()
        //     .range([height, 0]);

        // var xMin1 = d3.min(data1, function (d) {
        //     return d[labels1.x];
        // });

        // var yMin1 = d3.min(data1, function (d) {
        //     return d[labels1.y];
        // });

        // var xMax1 = d3.max(data1, function (d) {
        //     return d[labels1.x];
        // });

        // var yMax1 = d3.max(data1, function (d) {
        //     return d[labels1.y];
        // });

        // var xMin2 = d3.min(data2, function (d) {
        //     return d[labels2.x];
        // });

        // var yMin2 = d3.min(data2, function (d) {
        //     return d[labels2.y];
        // });

        // var xMax2 = d3.max(data2, function (d) {
        //     return d[labels2.x];
        // });

        // var yMax2 = d3.max(data2, function (d) {
        //     return d[labels2.y];
        // });

        // x.domain(Math.min(xMin1, xMin2), Math.max(xMax1, xMax2));

        // y.domain(Math.min(yMin1, yMin2), Math.max(yMax1, yMax2));
    
        // x.domain(d3.extent(data1, function (d) {
        //     return d[labels1.x];
        // })).nice();
        // y.domain(d3.extent(data1, function (d) {
        //     return d[labels1.y];
        // })).nice();

        var x1 = d3.scaleLinear()
            .range([0, width]);

        var y1 = d3.scaleLinear()
            .range([height, 0]);

        var x2 = d3.scaleLinear()
            .range([0, width]);

        var y2 = d3.scaleLinear()
            .range([height, 0]);


        x1.domain(d3.extent(data1, function (d) {
            return d[labels1.x];
        })).nice();

        y1.domain(d3.extent(data1, function (d) {
            return d[labels1.y];
        })).nice();

        x2.domain(d3.extent(data2, function (d) {
            return d[labels2.x];
        })).nice();
        
        y2.domain(d3.extent(data2, function (d) {
            return d[labels2.y];
        })).nice();


        // var xAxis = d3.axisBottom(x);

        // var yAxis = d3.axisLeft(y);

        // var t = d3.transition()
        //     .duration(500)

        // svg.select(".x")
        //     .transition(t)
        //     .call(xAxis)

        // svg.select(".y")
        //     .transition(t)
        //     .call(yAxis)

        var dot1_g = svg.select('g')
            .attr('class', 'lassoable')
            .selectAll(".dot1")
            .data(data1);

        dot1_g.exit().remove();

        dot1_g.enter()
            .append("circle")
            .attr('r', 0)
            .attr("id", function (d, i) {
                return "dot1_" + i;
            })
            .attr("class", "dot1")
            .attr("r", 4)
            .attr("cx", function (d) {
                return x1(d[labels1.x]);
            })
            .attr("cy", function (d) {
                return y1(d[labels1.y]);
            })
            .style("fill", "red")
            .on("mouseover", function (d, i) {
                that.detailViewCallback(i);
                select(this).style('cursor', 'move');
            })
            .on("mouseout", function (d) {
                select(this).style('cursor', 'auto');
            })
            .merge(dot1_g)
            .transition()
            .duration(500)
            .attr("id", function (d, i) {
                return "dot1_" + i;
            }) // added
            .attr("class", "dot1")
            .attr("r", 4)
            .attr("cx", function (d) {
                return x1(d[labels1.x]);
            })
            .attr("cy", function (d) {
                return y1(d[labels1.y]);
            })
            .style("fill", "red");

        var dot2_g = svg.select('g')
        .attr('class', 'lassoable')
        .selectAll(".dot2")
        .data(data2);

        dot2_g.exit().remove();

        dot2_g.enter()
            .append("circle")
            .attr('r', 0)
            .attr("id", function (d, i) {
                return "dot2_" + i;
            })
            .attr("class", "dot2")
            .attr("r", 4)
            .attr("cx", function (d) {
                return x2(d[labels2.x]);
            })
            .attr("cy", function (d) {
                return y2(d[labels2.y]);
            })
            .style("fill", "green")
            .on("mouseover", function (d, i) {
                that.detailViewCallback(i);
                select(this).style('cursor', 'move');
            })
            .on("mouseout", function (d) {
                select(this).style('cursor', 'auto');
            })
            .merge(dot2_g)
            .transition()
            .duration(500)
            .attr("id", function (d, i) {
                return "dot2_" + i;
            }) // added
            .attr("class", "dot2")
            .attr("r", 4)
            .attr("cx", function (d) {
                return x2(d[labels2.x]);
            })
            .attr("cy", function (d) {
                return y2(d[labels1.y]);
            })
            .style("fill", "red");   
    }



}

MultiScatterPlot.defaultProps = {
    chart: 'loading...'
};

export default MultiScatterPlot;
