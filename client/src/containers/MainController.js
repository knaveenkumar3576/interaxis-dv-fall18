import React,{Component} from 'react'
import PanelGroup from 'react-panelgroup'

import ScatterPlot from '../Components/ScatterPlot';
import BarChart from '../Components/BarChart';
import Wrap from '../hoc/Wrap';

class MainController extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedLabels : {
                x: 'x',
                y: 'y'
            },
            data : {
                dataPoints : [
                    {
                        x : 1,
                        y : 2,
                        name : "Point 1"
                    },
                    {
                        x : 5,
                        y : 5,
                        name : "Point 2"
                    },
                    {
                        x : 1,
                        y : 5,
                        name : "Point 3"
                    },
                    {
                        x : 1,
                        y : 1,
                        name : "Point 4"
                    },
                    {
                        x : 4,
                        y : 3,
                        name : "Point 5"
                    },
                ]
            }
        };
    }

    componentWillMount(){
        console.log("componentWillMount");
    }

    componentDidMount(){
        console.log("componentDidMount");
    }

    render() {
        console.log("render");
    
        return (
            <Wrap>
                <PanelGroup direction="column" borderColor="grey">
                    <PanelGroup direction="row" borderColor="grey" panelWidths={[
                        {size: 200, minSize:0, resize: "dynamic"},
                        {size: 50, minSize:0, resize: "dynamic"},
                        {size: 100, minSize:50, resize: "stretch"}
                    ]}>
                        <div> 
                            <p> Y Bar plots </p> 
                            <BarChart height = { 600 } width = { 250 } barWidth = { 25 } />
                        </div>
                        <div> Y dropzones  

                        </div>
                        <ScatterPlot dataPoints={this.state.data.dataPoints} labels={this.state.selectedLabels} /> 
                    </PanelGroup>                    
                    <PanelGroup direction="row" borderColor="grey" panelWidths={[
                        {size: 200, minSize:50, resize: "dynamic"},
                        {minSize:100, resize: "stretch"},
                    ]}>
                        <div> Filters </div>
                        <div> X dropzones  </div>
                    </PanelGroup>                    

                    <PanelGroup direction="row" borderColor="grey" panelWidths={[
                        {size: 200, minSize:50, resize: "dynamic"},
                        {size: 100, minSize:50, resize: "dynamic"}
                    ]}>
                        <div> Extra Filters </div>
                        <div> 
                            <p>
                                X Bar Plots
                            </p>
                            <BarChart height={ 250 } width={ 800 } barWidth = { 10 } />
                        </div>
                    </PanelGroup>                    

                </PanelGroup>
                
                {/* <div> 
                    A(Main Scatterplot)
                </div>
                <div> 
                    B()
                </div>
                <div> 
                    C
                </div>
                <div> 
                    D
                </div>
                <div> 
                    E
                </div> */}
            </Wrap>
        );
    }
 }

export default MainController