import React, {Component} from 'react';
import PropTypes from 'prop-types';
import PanelGroup from 'react-panelgroup'
import * as Papa from 'papaparse';

import Header from './Header';
import ScatterPlot from '../Components/ScatterPlot';
import BarChart from '../Components/BarChart';
import DropZone from '../Components/DropZone';
import DataPointDetail from '../Components/DataPointDetail';
import Wrap from '../hoc/Wrap';
import SaveUtil from "../Components/SaveUtil";

const KEYS_TO_BE_USED = {
    sample: ['x', 'y', 'z'],
    census: ['TotalPop', 'Men', 'Women', 'Hispanic', 'White', 'Black', 'Native', 'Asian', 'Pacific', 'Citizen', 'Income', 'IncomeErr', 'IncomePerCap', 'IncomePerCapErr', 'Poverty', 'ChildPoverty', 'Professional', 'Service', 'Office', 'Construction', 'Production', 'Drive', 'Carpool', 'Transit', 'Walk', 'OtherTransp', 'WorkAtHome', 'MeanCommute', 'Employed', 'PrivateWork', 'PublicWork', 'SelfEmployed', 'FamilyWork', 'Unemployment']
};

class MainController extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataset: '',
            currentVersion: '',
            versions: [],
            columns: [],
            xAttribute: 'Choose X Attribute',
            yAttribute: 'Choose Y Attribute',
            // update the features selected from the drop down here

            selectedLabels : {
                x: 'Men',
                y: 'Women'
            },
            
            dataPoints : [],

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
            currDataPoint: null
        };
    }

    // componentWillMount(){

    // }

    componentDidMount(){
        console.log("componentDidMount");
    }

    changeData = () => {
        let csvFilePath = require("../data/census.csv");

        Papa.parse(csvFilePath, {
            header: true,
            download: true,
            skipEmptyLines: true,
            complete: this.processAndNormalizeData
        });

    }    

    changeLabels = () => {
        let labels = {
            x: 'Income',
            y: 'TotalPop'
        };
        this.setState({ 
            selectedLabels: labels
         });
    }    

    processAndNormalizeData = (result) => {
        console.log("updateDatadata");
        console.log(result.data);

        this.setState({dataset: 'census', columns: KEYS_TO_BE_USED['census']}, () => {
            let keysToNormalize = KEYS_TO_BE_USED[this.state.dataset];
            let resultdataPoints = result.data;
            keysToNormalize.forEach(key => {
                let max = Math.max.apply(null, resultdataPoints.map(d => d[key]));
                let min = Math.min.apply(null, resultdataPoints.map(d => d[key]));
                resultdataPoints.forEach(point => {
                    point[key] = (point[key] - min) / (max - min);
                })
            });
            console.log(resultdataPoints);        
            this.setState({ 
                dataPoints : resultdataPoints,
             });

        });

    };

    // callback to show detail view
    scatterOnMouseOverCallback(dataPoint) {
        // update the props of DataPointDetail
        console.log("Datapoint callback!");
        console.log(dataPoint);
        this.setState({currDataPoint: dataPoint});
    }

    onDataSetChangedCallback(dataset) {
        this.setState({dataset: dataset, columns: KEYS_TO_BE_USED[dataset]});
    }

    onVersionChangedCallback(versions, currentVersion) {
        this.setState({versions: versions, currentVersion: currentVersion});
    }

    render() {
        return (
            <Wrap>
                <Header dataset={KEYS_TO_BE_USED} onDataSetChanged={this.onDataSetChangedCallback.bind(this)}
                        onVersionChanged={this.onVersionChangedCallback.bind(this)}/>
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

                        <div>
                            <button onClick={this.changeData}>Upload Census data</button>
                            <button onClick={this.changeLabels}>Change data</button>
                            
                            <ScatterPlot
                                dataPoints={this.state.dataPoints}
                                labels={this.state.selectedLabels} 
                                detailViewCallback = {this.scatterOnMouseOverCallback.bind(this)} 
                            />
                            
                        </div>

                        {/* <ScatterPlot 
                                dataPoints={this.state.dataPoints} 
                                labels={this.state.selectedLabels} 
                                detailViewCallback = {this.scatterOnMouseOverCallback.bind(this)} 
                        /> */}

                        <DropZone position={"xMin"}/>
                        <DropZone position={"xMax"}/>
                    </PanelGroup>
                    <PanelGroup direction="row" borderColor="grey" panelWidths={[
                        {size: 300, minSize: 200, resize: "dynamic"},
                        {minSize: 100, resize: "stretch"},
                    ]}>
                        <div className={'save-util-panel'}>
                            {this.state.dataset !== '' ?
                                <SaveUtil columns={this.state.columns} versions={this.state.versions}
                                          xAttribute={this.state.xAttribute} yAttribute={this.state.yAttribute}
                                          currentVersion={this.state.currentVersion}/> : null}
                        </div>
                        <div className={'save-util-panel'}>
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