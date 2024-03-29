import React from 'react';
import {select} from 'd3-selection';
import {scaleBand, scaleLinear} from 'd3-scale';
import {min, max, domain, range} from 'd3-array';
import {axisTop} from 'd3-axis';

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

        let dataObject = this.props.dataObject;
        let dataset = []
        Object.keys(dataObject).forEach((k) => {
            let obj = {
                key: k,
                value: dataObject[k]
            }
            dataset.push(obj);
        });

        this.setState({
            dataset: dataset
        });
    }

    drawBars() {
        let width = this.state.width;
        let id = this.state.id;

        let marginRight = width * 0.05, 
        marginLeft = width * 0.05,
        marginTop = 15, marginBottom = 15,
        height = this.state.height - marginTop - marginBottom;

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
            .style("font-size", 7)
            .call(xAxis);

        let g = svg.append("g")
            .attr("transform", "translate(" + marginLeft + ", " + marginTop + ")");

        let bars = g.selectAll("rect")
            .data(this.state.dataset)
            .enter()
            .append("rect")
            .attr("class", function (d) {
                return d.value < 0 ? "negative" : "positive";
            })
            .attr("x", function (d, i) {
                return (d.value < 0 ? totalScale(d.value) : totalScale(0));
            })
            .attr("y", function (d, i) {
                return yScale(i);
            })
            .attr("width", function (d, i) {
                return Math.abs(totalScale(0) - totalScale(d.value));
            })
            .attr("height", yScale.bandwidth())
            .style("fill", function (d) {
                return d.value < 0 ? "#ff5454" : "#3a85ff";
            });

        let text = g.selectAll("text")
            .data(this.state.dataset)
            .enter()
            .append("text")
            .attr("x", function(d, i) {
                // return (d.value < 0 ? totalScale(d.value) : totalScale(0));
                return totalScale(0);
            })
            .attr("y", function (d, i) {
                return yScale(i) + yScale.bandwidth() * 0.9;
            })
            .attr("fill", "black")
            .style("font-size", yScale.bandwidth())
            // .style("font-size", 5)
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

export default BarChart;