import React, {Component} from 'react';
import PropTypes from 'prop-types';
import PanelGroup from 'react-panelgroup'
import * as Papa from 'papaparse';
import GridLayout from 'react-grid-layout';
import '../css/MainController.css'

import Header from './Header';
import ScatterPlot from '../Components/ScatterPlot';
import BarChart from '../Components/BarChart';
import DropZone from '../Components/DropZone';
import DataPointDetail from '../Components/DataPointDetail';
import Wrap from '../hoc/Wrap';
import SaveUtil from "../Components/SaveUtil";
import BottomPanel from '../Components/BottomPannel';

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
            xAxisWidth: 0,
            xAxisHeight: 0,
            leftBarWidth: 0,
            leftBarHeight: 0,
            rightBarWidth: 0,
            rightBarHeight: 0,
            // update the features selected from the drop down here
            dataPoints: [],
            originalDataPoints: [],
            selectedLabels: {
                x: '',
                y: ''
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
            currDataPoint: null
        };
    }

    componentWillMount(){
        // this.onDataSetChangedCallback("sample");

    }

    componentDidMount() {
        console.log("componentDidMount");
        this.setState({
            xAxisWidth: this.refs.middleBottom.clientWidth,
            xAxisHeight: this.refs.middleBottom.clientHeight - 10,
            leftBarWidth: this.refs.leftBar.clientWidth,
            leftBarHeight: this.refs.leftBar.clientHeight
        });
        this.onDataSetChangedCallback("sample");
    }

    changeData = () => {
        let csvFilePath = require("../data/" + this.state.dataset + ".csv");

        Papa.parse(csvFilePath, {
            header: true,
            download: true,
            skipEmptyLines: true,
            complete: (result) => {
                this.saveOriginalData(result)
                this.processAndNormalizeData(result)
            } 
        });
    }
    
    saveOriginalData = (result) => {
        this.setState({
            originalDataPoints: JSON.parse(JSON.stringify(result.data))
        });    
    } 

    processAndNormalizeData = (result) => {        
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
        });

    };

    // callback to show detail view
    scatterOnMouseOverCallback(i) {
        // update the props of DataPointDetail
        console.log("Datapoint callback!");
        console.log(i);
        this.setState({currDataPoint: this.state.originalDataPoints[i]});
    }

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
    }

    onVersionChangedCallback(versions, currentVersion) {
        this.setState({versions: versions, currentVersion: currentVersion});
    }

    onXAttributeChangedCallback(x) {
        let y = this.state.selectedLabels.y;
        this.setState({
            selectedLabels: {x: x, y: y}
        });
    }

    onYAttributeChangedCallback(y) {
        let x = this.state.selectedLabels.x;
        this.setState({
            selectedLabels: {x: x, y: y}
        });
    }

    render() {
        let columnLayout = [
            {i: 'a', x: 0, y: 0, w: 3, h: 1, static: true},
            {i: 'b', x: 3, y: 0, w: 6, h: 1, static: true},
            {i: 'c', x: 9, y: 0, w: 3, h: 1, static: true}
        ];
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
                        <div style={{height: '70%'}}>
                            {this.state.dataset !== '' ?
                            <ScatterPlot
                                dataPoints={this.state.dataPoints}
                                labels={this.state.selectedLabels}
                                detailViewCallback={this.scatterOnMouseOverCallback.bind(this)}
                            /> : null
                            }
                        </div>
                        <div ref={'middleBottom'} style={{height: '25%'}}>
                            <BottomPanel width={this.state.xAxisWidth} height={this.state.xAxisHeight}/>
                        </div>
                    </div>
                    <div key="c">
                        <DataPointDetail dataPointDetails={this.state.currDataPoint}/>
                    </div>
                </GridLayout>
            </Wrap>
        );
    }
}

export default MainController