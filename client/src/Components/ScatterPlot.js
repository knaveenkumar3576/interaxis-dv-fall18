import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import {lasso} from 'd3-lasso';
import {withFauxDOM} from 'react-faux-dom';

class ScatterPlot extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount () {
    console.log(this.props.dataPoints);
    console.log(this.props.detailViewCallback);
    console.log(typeof(this.props.detailViewCallback));
    
    const faux = this.props.connectFauxDOM('div', 'chart')

      var margin = {top: 30, right: 30, bottom: 100, left: 100},
      width = 600 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;
 
      var svg = d3.select(faux).append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var tooltip = d3.select(faux).append("div")
                      .attr("class", "tooltip")
                      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                      .text("tooltip")
                      .style("opacity", 0.5)
                      .style("background-color", "#4DC9DD");

    //   svg.append("rect")
    //   .attr('class','lassoable')
    //   .attr("width",width)
    //   .attr("height",height)
    //   .style("opacity",0);
    
    // // Lasso functions to execute while lassoing
    // var lasso_start = function() {
    //   lasso.items()
    //     .attr("r",3.5) // reset size
    //     .style("fill",null) // clear all of the fills
    //     .classed({"not_possible":true,"selected":false}); // style as not possible
    // };
    
    // var lasso_draw = function() {
    //   // Style the possible dots
    //   lasso.items().filter(function(d) {return d.possible===true})
    //     .classed({"not_possible":false,"possible":true});
    
    //   // Style the not possible dot
    //   lasso.items().filter(function(d) {return d.possible===false})
    //     .classed({"not_possible":true,"possible":false});
    // };
    
    // var lasso_end = function() {
    //   // Reset the color of all dots
    //   lasso.items()
    //      .style("fill", "green");
    
    //   // Style the selected dots
    //   lasso.items().filter(function(d) {return d.selected===true})
    //     .classed({"not_possible":false,"possible":false})
    //     .attr("r",7);
    
    //   // Reset the style of the not selected dots
    //   lasso.items().filter(function(d) {return d.selected===false})
    //     .classed({"not_possible":false,"possible":false})
    //     .attr("r",3.5);
    
    // };
    
    
    // // Define the lasso
    // var lasso = lasso()
    //       .closePathDistance(75) // max distance for the lasso loop to be closed
    //       .closePathSelect(true) // can items be selected by closing the path?
    //       .hoverSelect(true) // can items by selected by hovering over them?
    //       .on("start",lasso_start) // lasso start function
    //       .on("draw",lasso_draw) // lasso draw function
    //       .on("end",lasso_end); // lasso end function
    
      var x = d3.scaleLinear()
          .range([0, width]);
      
      var y = d3.scaleLinear()
          .range([height, 0]);
            
      var xAxis = d3.axisBottom(x);

      var yAxis = d3.axisLeft(y);

      var data= this.props.dataPoints;
      var labels= this.props.labels;
      console.log(labels);

      x.domain(d3.extent(data, function(d) { return d[labels.x]; })).nice();
      y.domain(d3.extent(data, function(d) { return d[labels.y]; })).nice();

      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
          .append("text")
          .attr("class", "label")
          .attr("x", width)
          .attr("y", -6)
          .style("text-anchor", "end")
          .text("Sepal Width (cm)");

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
          .append("text")
          .attr("class", "label")
          .attr("trasnsform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Sepal Length (cm)")

        var dot_g = svg.append('g')
          .attr('class','lassoable');
      
        dot_g.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("id",function(d,i) {return "dot_" + i;}) // added
            .attr("class", "dot")
            .attr("r", 3.5)
            .attr("cx", function(d) { return x(d[labels.x]); })
            .attr("cy", function(d) { return y(d[labels.y]); })
            .attr("draggable", "true")
            .style("fill",  "red")  
            .on("mouseover", function(d) {

              // this.props.detailViewCallback(d);

              console.log("mouseover");

              tooltip.transition()
                  .duration(200)
                  .style("opacity", .9);
              tooltip.html(d["name"] + "<br/> (" + d[labels.x] 
              + ", " + d[labels.y] + ")")
                  .style("left", (d3.event.pageX + 5) + "px")
                  .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                console.log("mouseout");
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            })
            .on("dragstart", function(d) {
              console.log("Dragging the circle... ");
              d3.event.dataTransfer.setData("data", JSON.stringify(d));
              console.log(d3.event.dataTransfer.getData("data"));
            });

        // lasso.items(d3.selectAll(".dot"));

        // lasso.area(svg.selectAll('.lassoable'));
        // // Init the lasso on the svg:g that contains the dots
        // svg.call(lasso);

        this.props.animateFauxDOM(800)
  }

  render () {
    return (
      <div>
        <h2>ScatterPlot</h2>
        <div className='renderedD3'>
          {this.props.chart}
        </div>
      </div>
    )
  }
}

ScatterPlot.defaultProps = {
  chart: 'loading'
}

ScatterPlot.propTypes = {
  detailViewCallback: PropTypes.func
}

export default withFauxDOM(ScatterPlot)