import React from 'react';
import DropZone from "./DropZone";
import BarChart from "./BarChart";
import GridLayout from "react-grid-layout";

class BottomPannel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            height: props.height,
            width: props.width,
            rightBarHeight: 0,
            rightBarWidth: 0,
            xMaxDropZoneHeight: 0,
            xMinDropZoneHeight: 0,
            xMaxDropZoneWidth: 0,
            xMinDropZoneWidth: 0
        }

        console.log("Props: Add: ");
        console.log(this.props.removeDataPointFromScatterCallback);
        console.log("Props: Remove: ");
        console.log(this.props.addDataPointToScatterCallback);
    }

    componentWillReceiveProps(props) {
        this.setState({
            height: props.height,
            width: props.width,
            rightBarWidth: this.refs.rightBar.clientWidth,
            rightBarHeight: this.refs.rightBar.clientHeight,
            xMaxDropZoneHeight: this.refs.xMaxDropZone.clientHeight,
            xMinDropZoneHeight: this.refs.xMinDropZone.clientHeight,
            xMaxDropZoneWidth: this.refs.xMaxDropZone.clientWidth,
            xMinDropZoneWidth: this.refs.xMinDropZone.clientWidth,
        });
    }

    render() {
        let columnLayout = [
            {i: 'a', x: 0, y: 0, w: 2, h: 0.5, static: true},
            {i: 'b', x: 2, y: 0, w: 8, h: 1, static: true},
            {i: 'c', x: 10, y: 0, w: 2, h: 0.5, static: true}
        ];
        return (
            <GridLayout className="layout" layout={columnLayout} cols={12}
                        rowHeight={this.state.height} width={this.state.width}>
                <div ref={'xMinDropZone'} key="a">
                    <DropZone position={"xMin"} height={this.state.xMinDropZoneHeight}
                              width={this.state.xMinDropZoneWidth}
                              dataset={this.props.dataset}
                              addDataPointCallback={this.props.removeDataPointFromScatterCallback}
                              removeDataPointCallback={this.props.addDataPointToScatterCallback}
                              /* currNodes={this.props.xMinNodes} */ />
                </div>
                <div ref={'rightBar'} key="b" id={'rightBarChart'}>
                    <BarChart height={this.state.rightBarHeight} 
                            width={this.state.rightBarWidth}
                            barWidth={10} id={'rightBarChart'}
                            dataObject = {this.props.dataObject} />
                </div>
                <div ref={'xMaxDropZone'} key="c">
                    <DropZone position={"xMax"}
                              height={this.state.xMinDropZoneHeight}
                              width={this.state.xMinDropZoneWidth}
                              dataset={this.props.dataset}
                              addDataPointCallback={this.props.removeDataPointFromScatterCallback}
                              removeDataPointCallback={this.props.addDataPointToScatterCallback}
                              /* currNodes={this.props.xMaxNodes} */ />
                </div>
            </GridLayout>
        );
    }
}

export default BottomPannel;