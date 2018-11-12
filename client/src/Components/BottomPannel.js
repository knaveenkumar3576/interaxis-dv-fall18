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
            rightBarWidth: 0
        }
    }

    componentWillReceiveProps(props) {
        this.setState({
            height: props.height,
            width: props.width,
            rightBarWidth: this.refs.rightBar.clientWidth,
            rightBarHeight: this.refs.rightBar.clientHeight
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
                <div key="a">
                    <DropZone position={"xMin"}/>
                </div>
                <div ref={'rightBar'} key="b" id={'rightBarChart'}>
                    {this.state.rightBarHeight > 0 && this.state.rightBarWidth > 0 ?
                        <BarChart height={this.state.rightBarHeight} width={this.state.rightBarWidth}
                                  barWidth={10} id={'rightBarChart'}/> : null}
                </div>
                <div key="c">
                    <DropZone position={"xMax"}/>
                </div>
            </GridLayout>
        );
    }
}

export default BottomPannel;