import React, {Component} from 'react';
import PropTypes from 'prop-types';
import PanelGroup from 'react-panelgroup'

import ScatterPlot from '../Components/ScatterPlot';
import BarChart from '../Components/BarChart';
import DropZone from '../Components/DropZone';
import DataPointDetail from '../Components/DataPointDetail';
import Wrap from '../hoc/Wrap';
import SaveUtil from "../Components/SaveUtil";

class MainController extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // update the features selected from the drop down here
            selectedLabels: {
                x: 'x',
                y: 'z'
            },
            data: {
                dataPoints: [
                    {
                        x: 1,
                        y: 2,
                        z: 8,
                        name: "Point 1"
                    },
                    {
                        x: 5,
                        y: 5,
                        z: 1,
                        name: "Point 2"
                    },
                    {
                        x: 1,
                        y: 5,
                        z: 8,
                        name: "Point 3"
                    },
                    {
                        x: 1,
                        y: 1,
                        z: 7,
                        name: "Point 4"
                    },
                    {
                        x: 4,
                        y: 3,
                        z: 2,
                        name: "Point 5"
                    },
                ]
            },
            dataPointDetails: {
                Asian: "14",
                Black: "8",
                Carpool: "9.9",
                CensusId: "6037",
                FamilyWork: "0.2",
                Hispanic: "48.2",
                Income: "56196.0",
                IncomeErr: "270.0",
                IncomePerCap: "28337",
                IncomePerCapErr: "113",
                MeanCommute: "30",
                Men: "4945351",
                Native: "0.2",
                Office: "24.6",
                OtherTransp: "2.3",
                Pacific: "0.2",
                Poverty: "18.2",
                PrivateWork: "79",
                Production: "12.8",
                Professional: "35.7",
                PublicWork: "11.5"
            },
            currDataPoint: null,
            xAttributes: [{name: 'testx1'}, {name: 'testx2'}],
            yAttributes: [{name: 'testy1'}, {name: 'testy2'}],
        };
    }

    componentWillMount() {
        console.log("componentWillMount");
    }

    componentDidMount() {
        console.log("componentDidMount");
    }

    // callback to show detail view
    scatterOnMouseOverCallback(dataPoint) {
        // update the props of DataPointDetail
        console.log("Datapoint callback!");
        console.log(dataPoint);
        this.setState({currDataPoint: dataPoint});
    }

    render() {
        console.log("render");

        return (
            <Wrap>
                <PanelGroup direction="column" borderColor="grey">
                    <PanelGroup direction="row" borderColor="grey" panelWidths={[
                        {size: 200, minSize: 0, resize: "dynamic"},
                        {size: 50, minSize: 0, resize: "dynamic"},
                        {size: 100, minSize: 50, resize: "stretch"}
                    ]}>
                        <div>
                            <p> Y Bar plots </p>
                            <BarChart height={600} width={250} barWidth={25}/>
                        </div>
                        <div> Y dropzones

                        </div>
                        <ScatterPlot
                            dataPoints={this.state.data.dataPoints}
                            labels={this.state.selectedLabels}
                            detailViewCallback={this.scatterOnMouseOverCallback.bind(this)}/>

                        <DropZone position={"xMin"}/>
                        <DropZone position={"xMax"}/>
                    </PanelGroup>
                    <PanelGroup direction="row" borderColor="grey" panelWidths={[
                        {size: 200, minSize: 50, resize: "dynamic"},
                        {minSize: 100, resize: "stretch"},
                    ]}>
                        <div>
                            <SaveUtil xAttributes={this.state.xAttributes} yAttributes={this.state.yAttributes}/></div>
                        <div>
                            <p>X dropzones</p>
                        </div>
                    </PanelGroup>

                    <PanelGroup direction="row" borderColor="grey" panelWidths={[
                        {size: 200, minSize: 50, resize: "dynamic"},
                        {size: 100, minSize: 50, resize: "dynamic"}
                    ]}>
                        <div> Extra Filters</div>
                        <div>
                            <p>
                                X Bar Plots
                            </p>
                            <BarChart height={250} width={800} barWidth={10}/>
                        </div>
                    </PanelGroup>

                    <DataPointDetail dataPointDetails={this.state.currDataPoint}/>

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