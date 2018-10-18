import React from 'react'
// import * as d3 from 'd3'
import {withFauxDOM} from 'react-faux-dom'
import { select } from 'd3-selection';

class ScatterPlot extends React.Component {

    componentDidMount () {
    const faux = this.props.connectFauxDOM('div', 'chart')
    select(faux)
      .append('div')
      .html('Hello World!')
    this.props.animateFauxDOM(800)
  }

  render () {
    return (
      <div>
        <h2>Here is some fancy data:</h2>
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

export default withFauxDOM(ScatterPlot)