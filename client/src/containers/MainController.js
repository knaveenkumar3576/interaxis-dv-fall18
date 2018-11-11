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

const DEFAULT_FILTERS = {
    sample: ['x', 'y'],
    census: ['Men', 'Women']
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
<<<<<<< HEAD

            selectedLabels : {
                x: 'Men',
                y: 'Women'
            },
            
            dataPoints : [],

=======
            dataPoints: [],
            selectedLabels: {
                x: '',
                y: ''
            },
>>>>>>> ea14ecf8c7b64ae834fe9c9674197559a1900d6d
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

    componentWillMount(){
        // this.onDataSetChangedCallback("sample");

    }

    componentDidMount(){
        console.log("componentDidMount");
<<<<<<< HEAD
=======
        this.setState({
            xAxisWidth: this.refs.middleBottom.clientWidth,
            xAxisHeight: this.refs.middleBottom.clientHeight - 10,
            leftBarWidth: this.refs.leftBar.clientWidth,
            leftBarHeight: this.refs.leftBar.clientHeight
        });
        this.onDataSetChangedCallback("sample");
>>>>>>> ea14ecf8c7b64ae834fe9c9674197559a1900d6d
    }

    changeData = () => {
        let csvFilePath = require("../data/" + this.state.dataset + ".csv");

        Papa.parse(csvFilePath, {
            header: true,
            download: true,
            skipEmptyLines: true,
            complete: this.processAndNormalizeData
        });

    }    

<<<<<<< HEAD
    changeLabels = () => {
        let labels = {
            x: 'Income',
            y: 'TotalPop'
        };
        this.setState({ 
            selectedLabels: labels
         });
    }    

=======
>>>>>>> ea14ecf8c7b64ae834fe9c9674197559a1900d6d
    processAndNormalizeData = (result) => {
        console.log("updateDatadata");
        console.log(result.data);

<<<<<<< HEAD
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

=======
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
            dataPoints: resultdataPoints,
>>>>>>> ea14ecf8c7b64ae834fe9c9674197559a1900d6d
        });

    };

    // callback to show detail view
    scatterOnMouseOverCallback(dataPoint) {
        // update the props of DataPointDetail
        console.log("Datapoint callback!");
        console.log(dataPoint);
        this.setState({currDataPoint: dataPoint});
    }

<<<<<<< HEAD
    addPointToScatterCallback(dataPoint, position) {
        console.log("Add data point - Data Point: ");
        console.log(dataPoint);
        console.log("Position: " + position);
        /* TODO: Add data point to scatter plot */
        /* TODO: Send return value to DropZone if success or failure */
=======
    onDataSetChangedCallback(dataset) {
        this.setState({dataset: dataset, columns: KEYS_TO_BE_USED[dataset]}, () => {
            this.changeData();
            this.setState({
                selectedLabels: {
                    x: DEFAULT_FILTERS[dataset][0],
                    y: DEFAULT_FILTERS[dataset][1]
                }
            });
        })
>>>>>>> ea14ecf8c7b64ae834fe9c9674197559a1900d6d
    }

    removePointFromScatterCallback(dataPoint, position) {
        console.log("Remove data point - Data Point: ");
        console.log(dataPoint);
        console.log("Position: " + position);
        /* TODO: Remove data point from scatter plot */
        /* TODO: Send return value to DropZone if success or failure */
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
                <GridLayout className="layout grid-layout" layout={columnLayout} cols={12}
                            rowHeight={window.innerHeight - 50}
                            width={window.innerWidth}>
                    <div key="a">
                        <div style={{height: '10%'}}>
                            <div className={'pull-right'}
                                 style={{height: '100%', width: '30%'}}>
                                <DropZone position={"yMax"}/>
                            </div>
                        </div>
                        <div ref={'leftBar'} id={'leftBarChart'} style={{height: '55%'}}>
                            <BarChart height={this.state.leftBarHeight} width={this.state.leftBarWidth} barWidth={25}
                                      id={'leftBarChart'}/>
                        </div>
                        <div style={{height: '10%'}}>
                            <div className={'pull-right'}
                                 style={{height: '100%', width: '30%'}}>
                                <DropZone position={"yMin"}/>
                            </div>
                        </div>
                        <div style={{height: '25%', position: 'relative'}}>
                            <div className={'save-util-panel'}>
                                {this.state.dataset !== '' ?
                                    <SaveUtil columns={this.state.columns} versions={this.state.versions}
                                              xAttribute={this.state.selectedLabels.x}
                                              yAttribute={this.state.selectedLabels.y}
                                              currentVersion={this.state.currentVersion}
                                              onXChange={this.onXAttributeChangedCallback.bind(this)}
                                              onYChange={this.onYAttributeChangedCallback.bind(this)}/> : null}
                            </div>
                        </div>
                    </div>
                    <div key="b">
<<<<<<< HEAD
                        <div style={{height: '75%'}}>
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

                        <DropZone 
                            position={"xMin"}
                            addDataPointCallback={this.removeDataPointFromScatterCallback} 
                            removeDataPointCallback = {this.addDataPointFromScatterCallback} 
                        />
                        
                        <DropZone 
                            position={"xMax"}
                            addDataPointCallback={this.removeDataPointFromScatterCallback} 
                            removeDataPointCallback = {this.addDataPointFromScatterCallback} 
                        />
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
=======
                        <div style={{height: '70%'}}>
                            {this.state.dataset !== '' ?
                            <ScatterPlot
                                dataPoints={this.state.dataPoints}
                                labels={this.state.selectedLabels}
                                detailViewCallback={this.scatterOnMouseOverCallback.bind(this)}
                            /> : null
                            }
>>>>>>> ea14ecf8c7b64ae834fe9c9674197559a1900d6d
                        </div>
                        <div ref={'middleBottom'} style={{height: '25%'}}>
                            <BottomPanel width={this.state.xAxisWidth} height={this.state.xAxisHeight}/>
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