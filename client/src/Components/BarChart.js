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
            dataset: [0.5, 0.5, -0.35, 0.25],
            // dataset: [
            //     {
            //         key: "hello",
            //         value: 0.5, 
            //     }, 
            //     {
            //         key: "world", 
            //         value: 0.5
            //     },
            //     {
            //         key: "foo",
            //         value: -0.35
            //     },
            //     {
            //         key: "bar", 
            //         value: 0.25
            //     }
            // ],
            height: props.height,
            width: props.width,
            barWidth: props.barWidth
        };

        select(props.id).selectAll("*").remove();

        this.drawBars = this.drawBars.bind(this)
    }

    componentWillReceiveProps(props) {

        // if (props.dataset) {
        //     let dataObject = props.dataObject;
        //     let dataset = []
        //     Object.keys(dataObject).forEach((k) => {
        //         let obj = {
        //             key: k,
        //             value: parseInt(dataObject[k])
        //         }
        //         dataset.push(obj);
        //     });

        //     this.setState({
        //         dataset: dataset
        //     });
        // }

        if (props.height > 0 && props.width > 0) {
            this.setState({
                height: props.height,
                width: props.width
            }, () => {
                select(this.state.id).selectAll("*").remove();
                this.drawBars();
            });
        }

        
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

        let minValue = min(this.state.dataset);
        let maxValue = max(this.state.dataset);

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
                return (d < 0 ? totalScale(d) : totalScale(0));
            })
            .attr("y", function (d, i) {
                return yScale(i);
            })
            .attr("width", function (d, i) {
                return Math.abs(totalScale(0) - totalScale(d));
            })
            .attr("height", barWidth)
            .style("fill", function (d) {
                return d < 0 ? "red" : "blue";
            });

        // let text = g.selectAll("text")
        //     .data(this.state.dataset)
        //     .enter()
        //     .append("text")
        //     .attr("class", function(d) {

        //     })
        //     .attr("x", function(d, i) {
        //         if (d.value < 0) 
        //             return totalScale(d.value) - 30;
        //         else 
        //             return totalScale(0) + Math.abs(totalScale(0) - totalScale(d.value)) + 10;
        //     })
        //     .attr("y", function(d, i) {
        //         return yScale(i) + 5;
        //     })
        //     .attr("text", function(d, i) {
        //         return d.key;
        //     });
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

export default BarChart;