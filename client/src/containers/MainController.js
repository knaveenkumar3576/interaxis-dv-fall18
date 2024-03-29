import React, {Component} from 'react';
import * as Papa from 'papaparse';
import GridLayout from 'react-grid-layout';
import * as d3 from 'd3';
import {Tabs, Tab} from 'react-bootstrap'

import Header from './Header';
import ScatterPlot from '../Components/ScatterPlot';
import BarChart from '../Components/BarChart';
import DropZone from '../Components/DropZone';
import DataPointDetail from '../Components/DataPointDetail';
import Wrap from '../hoc/Wrap';
import SaveUtil from "../Components/SaveUtil";
import BottomPanel from '../Components/BottomPannel';
import Compare from './Compare';


import '../css/MainController.css'

const KEYS_TO_BE_USED = {
    sample: ['x', 'y', 'z'],
    census: ['TotalPop', 'Men', 'Women', 'Hispanic', 'White', 'Black', 'Native', 'Asian', 'Pacific', 'Citizen', 'Income', 'IncomeErr', 'IncomePerCap', 'IncomePerCapErr', 'Poverty', 'ChildPoverty', 'Professional', 'Service', 'Office', 'Construction', 'Production', 'Drive', 'Carpool', 'Transit', 'Walk', 'OtherTransp', 'WorkAtHome', 'MeanCommute', 'Employed', 'PrivateWork', 'PublicWork', 'SelfEmployed', 'FamilyWork', 'Unemployment'],
    car: ['Sedan', 'Sports Car', 'SUV', 'Wagon', 'Minivan', 'Pickup', 'AWD', 'RWD', 'Retail Price', 'Dealer Cost', 'Engine Size', 'Cyl', 'HP', 'City MPG', 'Hwy MPG', 'Weight', 'Wheel Base', 'Len', 'Width'],
    football: ['Age', 'Overall', 'Potential', 'Special', 'Acceleration', 'Aggression', 'Agility', 'Balance', 'Ball control', 'Composure', 'Crossing', 'Curve', 'Dribbling', 'Finishing', 'Free kick accuracy', 'GK diving', 'GK handling', 'GK kicking', 'GK positioning', 'GK reflexes', 'Heading accuracy', 'Interceptions', 'Jumping', 'Long passing', 'Long shots', 'Marking', 'Penalties', 'Positioning', 'Reactions', 'Short passing', 'Shot power', 'Sliding tackle', 'Sprint speed', 'Stamina', 'Standing tackle', 'Strength', 'Vision', 'Volleys']
};

const DEFAULT_FILTERS = {
    sample: ['x', 'y'],
    census: ['Men', 'Women'],
    car: ['Retail Price', 'HP'],
    football: ['Age', 'Overall'],
};

const SEARCH_PARAMS = {
    sample: 'x',
    census: 'County',
    car: 'Vehicle Name',
    football: 'Name',
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
            yMaxDropZoneHeight: 0,
            yMinDropZoneHeight: 0,
            yMaxDropZoneWidth: 0,
            yMinDropZoneWidth: 0,
            scatterPlotWidth: 0,
            scatterPlotHeight: 0,
            savedInfo: [],
            // update the features selected from the drop down here
            dataPoints: [],
            originalDataPoints: [],
            dataPointsxMin: [],
            dataPointsxMax: [],
            dataPointsyMin: [],
            dataPointsyMax: [],
            customXWeights: {},
            customYWeights: {},
            selectedLabels: {
                x: '',
                y: ''
            },
            currDataPoint: null,
            searchString: '',
            reloadHeader: false
        };
    }

    componentWillMount() {
        // this.onDataSetChangedCallback("sample");
    }

    calculateCustomValues = () => {

        let noOfDataPointsXMin = this.state.dataPointsxMin.length;
        let noOfDataPointsXMax = this.state.dataPointsxMax.length;

        let noOfDataPointsYMin = this.state.dataPointsyMin.length;
        let noOfDataPointsYMax = this.state.dataPointsyMax.length;

        let customX = {};
        let customY = {};

        let labels = Object.assign({}, this.state.selectedLabels);
        let newColumns = this.state.columns;

        if (labels.x == "customX") {
            labels.x = DEFAULT_FILTERS[this.state.dataset][0];
        }

        if (labels.y == "customY") {
            labels.y = DEFAULT_FILTERS[this.state.dataset][1];
        }

        if (noOfDataPointsXMin > 0 && noOfDataPointsXMax > 0) {
            KEYS_TO_BE_USED[this.state.dataset].forEach(key => {
                let minWeights = 0;

                this.state.dataPointsxMin.forEach(d => {
                    minWeights += d[key];
                });
                let avgMinValue = minWeights / noOfDataPointsXMin;

                let maxWeights = 0;
                this.state.dataPointsxMax.forEach(d => {
                    maxWeights += d[key];
                });
                let avgMaxValue = maxWeights / noOfDataPointsXMax;
                customX[key] = avgMaxValue - avgMinValue;
            });

            this.state.dataPoints.forEach(d => {
                let x = 0;
                KEYS_TO_BE_USED[this.state.dataset].forEach(key => {
                    x += d[key] * customX[key];
                });
                d["customX"] = x;
            });

            labels.x = "customX";
        }

        if (noOfDataPointsYMin > 0 && noOfDataPointsYMax > 0) {
            KEYS_TO_BE_USED[this.state.dataset].forEach(key => {
                let minWeights = 0;

                this.state.dataPointsyMin.forEach(d => {
                    minWeights += d[key];
                });
                let avgMinValue = minWeights / noOfDataPointsYMin;

                let maxWeights = 0;
                this.state.dataPointsyMax.forEach(d => {
                    maxWeights += d[key];
                });
                let avgMaxValue = maxWeights / noOfDataPointsYMax;
                customY[key] = avgMaxValue - avgMinValue;
            });

            this.state.dataPoints.forEach(d => {
                let y = 0;
                KEYS_TO_BE_USED[this.state.dataset].forEach(key => {
                    y += d[key] * customY[key];
                });
                d["customY"] = y;
            });

            labels.y = "customY";
        }

        this.setState({
            customXWeights: customX,
            customYWeights: customY,
        });

        this.setState({
            columns: newColumns,
            selectedLabels: labels
        });
    };

    componentDidMount() {
        this.setState({
            xAxisWidth: this.refs.middleBottom.clientWidth,
            xAxisHeight: this.refs.middleBottom.clientHeight - 10,
            leftBarWidth: this.refs.leftBar.clientWidth,
            leftBarHeight: this.refs.leftBar.clientHeight,
            yMaxDropZoneHeight: this.refs.yMaxDropZone.clientHeight,
            yMinDropZoneHeight: this.refs.yMinDropZone.clientHeight,
            yMaxDropZoneWidth: this.refs.yMaxDropZone.clientWidth,
            yMinDropZoneWidth: this.refs.yMinDropZone.clientWidth,
            scatterPlotWidth: this.refs.scatterPlot.clientWidth,
            scatterPlotHeight: this.refs.scatterPlot.clientHeight,
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
                this.saveOriginalData(result);
                this.processAndNormalizeData(result);
            }
        });
    };

    saveOriginalData = (result) => {
        this.setState({
            originalDataPoints: JSON.parse(JSON.stringify(result.data))
        });
    };

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
        this.setState({
            dataPoints: resultdataPoints,
        });
        this.calculateCustomValues();
    };

    // callback to show detail view
    scatterOnMouseOverCallback(i) {
        this.setState({currDataPoint: this.state.originalDataPoints[i]});
    }

    onDataSetChangedCallback(dataset) {
        this.setState({dataset: dataset, columns: KEYS_TO_BE_USED[dataset]}, () => {
            this.changeData();
            this.setState({
                selectedLabels: {
                    x: DEFAULT_FILTERS[this.state.dataset][0],
                    y: DEFAULT_FILTERS[this.state.dataset][1]
                },
                dataPointsxMin: [],
                dataPointsxMax: [],
                dataPointsyMin: [],
                dataPointsyMax: []
            });
        })
    }

    onVersionChangedCallback(versions, currentVersion, infos) {
        this.setState({
            savedInfo: infos
        }, () => {
            let info = infos.filter((attr) => {
                return attr.version === currentVersion;
            })[0];
            if (versions.length > 0) {
                this.setState({
                    dataset: info.dataset,
                    columns: KEYS_TO_BE_USED[info.dataset],
                    versions: versions,
                    currentVersion: currentVersion,
                    selectedLabels: {
                        x: info.xAttribute,
                        y: info.yAttribute
                    },
                    dataPointsxMin: info.xMin || [],
                    dataPointsxMax: info.xMax || [],
                    dataPointsyMin: info.yMin || [],
                    dataPointsyMax: info.yMax || []
                }, () => {
                    this.changeData();
                });
            }
        });
    }

    onXAttributeChangedCallback(x) {
        let y = this.state.selectedLabels.y;

        let customX = {};

        KEYS_TO_BE_USED[this.state.dataset].forEach(key => {
            customX[key] = 0;
        });

        customX[x] = 1.0;

        this.setState({
            selectedLabels: {x: x, y: y},
            customXWeights: customX
        });

    }

    onYAttributeChangedCallback(y) {
        let x = this.state.selectedLabels.x;

        let customY = {};

        KEYS_TO_BE_USED[this.state.dataset].forEach(key => {
            customY[key] = 0;
        });

        customY[y] = 1.0;

        this.setState({
            selectedLabels: {x: x, y: y},
            customYWeights: customY
        });


    }

    onRefreshCallback() {

        this.setState({
            selectedLabels: {
                x: DEFAULT_FILTERS[this.state.dataset][0],
                y: DEFAULT_FILTERS[this.state.dataset][1]
            },
            dataPointsxMin: [],
            dataPointsxMax: [],
            dataPointsyMin: [],
            dataPointsyMax: []
        }, () => {
            this.calculateCustomValues();
        });

    }

    onSearchScatter = (event) => {
        // if (event.keyCode === 13) {


        let itemName = (document.getElementById('search-scatter').value);

        var svg = d3.select('#scatterPlotId').select('svg');

        svg.selectAll(".dot")
            .style("opacity", "1")
            .style("fill", "red");

        let selectedDataset = this.state.dataset;

        if (itemName !== '') {

            svg.selectAll(".dot")
                .style("opacity", "0")
                .filter(function (d) {
                    var searchString = d[SEARCH_PARAMS[selectedDataset]].toLowerCase();
                    var searchPattern = itemName.toLowerCase();
                    if (searchString.indexOf(searchPattern) != -1)
                        return true;
                })
                .style("opacity", "1")
                .style("fill", "yellow");
        }
    }

    removeDataPointFromScatterCallback(dataPoints, position) {
        switch (position) {
            case "xMin":
                this.setState({dataPointsxMin: dataPoints}, () => {
                    this.calculateCustomValues();
                });
                break;
            case "xMax":
                this.setState({dataPointsxMax: dataPoints}, () => {
                    this.calculateCustomValues();
                });
                break;
            case "yMin":
                this.setState({dataPointsyMin: dataPoints}, () => {
                    this.calculateCustomValues();
                });
                break;
            case "yMax":
                this.setState({dataPointsyMax: dataPoints}, () => {
                    this.calculateCustomValues();
                });
                break;
            default:
                return false;
        }
        return true;
    }

    addDataPointToScatterCallback(dataPoints, position) {
        switch (position) {
            case "xMin":
                this.setState({dataPointsxMin: dataPoints}, () => {
                    this.calculateCustomValues();
                });
                break;
            case "xMax":
                this.setState({dataPointsxMax: dataPoints}, () => {
                    this.calculateCustomValues();
                });
                break;
            case "yMin":
                this.setState({dataPointsyMin: dataPoints}, () => {
                    this.calculateCustomValues();
                });
                break;
            case "yMax":
                this.setState({dataPointsyMax: dataPoints}, () => {
                    this.calculateCustomValues();
                });
                break;
            default:
                return false;
        }
        return true;
    }

    render() {
        let columnLayout = [
            {i: 'a', x: 0, y: 0, w: 3, h: 1, static: true},
            {i: 'b', x: 3, y: 0, w: 7, h: 1, static: true},
            {i: 'c', x: 10, y: 0, w: 2, h: 1, static: true}
        ];
        return (
            <Wrap>
                <Header dataset={KEYS_TO_BE_USED} onDataSetChanged={this.onDataSetChangedCallback.bind(this)}
                        onVersionChanged={this.onVersionChangedCallback.bind(this)}
                        reload={this.state.reloadHeader}/>
                <Tabs id={'tabs'} defaultActiveKey={1}>
                    <Tab key={1} eventKey={1} title="Main">
                        <GridLayout className="layout grid-layout" layout={columnLayout} cols={12}
                                    rowHeight={window.innerHeight - 100}
                                    width={window.innerWidth}>
                            <div key="a">
                                <div style={{height: '10%'}}>
                                    <div ref={'yMaxDropZone'} className={'pull-right'}
                                         style={{height: '100%', width: '30%'}}>
                                        <DropZone position={"yMax"} height={this.state.yMaxDropZoneHeight}
                                                  width={this.state.yMaxDropZoneWidth}
                                                  dataset={this.state.dataPointsyMax}
                                                  addDataPointCallback={this.removeDataPointFromScatterCallback.bind(this)}
                                                  removeDataPointCallback={this.addDataPointToScatterCallback.bind(this)}
                                            /* currNodes = {[]} *//>
                                    </div>
                                </div>
                                <div ref={'leftBar'} id={'leftBarChart'} style={{height: '55%'}}>
                                    {/* {this.state.leftBarHeight > 0 && this.state.leftBarWidth > 0 ? */}
                                    <BarChart height={this.state.leftBarHeight} width={this.state.leftBarWidth}
                                              barWidth={25}
                                              id={'leftBarChart'}
                                              dataObject={this.state.customYWeights}/>
                                    {/* : null} */}
                                </div>
                                <div style={{height: '10%'}}>
                                    <div ref={'yMinDropZone'} className={'pull-right'}
                                         style={{height: '100%', width: '30%'}}>
                                        <DropZone position={"yMin"} height={this.state.yMinDropZoneHeight}
                                                  width={this.state.yMinDropZoneWidth}
                                                  dataset={this.state.dataPointsyMin}
                                                  addDataPointCallback={this.removeDataPointFromScatterCallback.bind(this)}
                                                  removeDataPointCallback={this.addDataPointToScatterCallback.bind(this)}
                                            /* currNodes = {[]} *//>
                                    </div>
                                </div>
                                <div style={{height: '25%', position: 'relative'}}>
                                    <div className={'save-util-panel'}>
                                        {this.state.dataset !== '' ?
                                            <SaveUtil columns={this.state.columns} versions={this.state.versions}
                                                      dataset={this.state.dataset}
                                                      default={DEFAULT_FILTERS[this.state.dataset]}
                                                      xAttribute={this.state.selectedLabels.x}
                                                      yAttribute={this.state.selectedLabels.y}
                                                      xMin={this.state.dataPointsxMin} xMax={this.state.dataPointsxMax}
                                                      yMin={this.state.dataPointsyMin} yMax={this.state.dataPointsyMax}
                                                      currentVersion={this.state.currentVersion}
                                                      onXChange={this.onXAttributeChangedCallback.bind(this)}
                                                      onYChange={this.onYAttributeChangedCallback.bind(this)}
                                                      onRefresh={this.onRefreshCallback.bind(this)}/> : null}
                                    </div>
                                </div>
                            </div>
                            <div key="b">
                                <div align="center" style={{width: '75%', margin: 'auto'}}>
                                    <div id="custom-search-input" className="input-group col-md-6">
                                        <input id="search-scatter" type="text"
                                               onKeyDown={this.onSearchScatter.bind(this)}
                                               className="search-query form-control"
                                               placeholder="Search"/>
                                        <span className="input-group-btn">
                                        <button className="btn btn-danger" type="button"
                                                onclick={this.onSearchScatter.bind(this)}>
                                            <span className=" glyphicon glyphicon-search"></span>
                                        </button>
                                    </span>
                                    </div>
                                </div>
                                <div ref={'scatterPlot'} id={'scatterPlotId'} style={{height: '70%'}}>
                                    {this.state.dataset !== '' ?
                                        <ScatterPlot id={'scatterPlotId'}
                                                     dataPoints={this.state.dataPoints}
                                                     labels={this.state.selectedLabels}
                                                     width={this.state.scatterPlotWidth}
                                                     height={this.state.scatterPlotHeight}
                                                     searchString={this.state.searchString}
                                                     detailViewCallback={this.scatterOnMouseOverCallback.bind(this)}
                                        /> : null
                                    }
                                </div>
                                <div ref={'middleBottom'} style={{height: '25%'}}>
                                    <BottomPanel
                                        width={this.state.xAxisWidth}
                                        height={this.state.xAxisHeight}
                                        dataset={this.state.dataset}
                                        removeDataPointFromScatterCallback={this.removeDataPointFromScatterCallback.bind(this)}
                                        addDataPointToScatterCallback={this.addDataPointToScatterCallback.bind(this)}
                                        dataObject={this.state.customXWeights}
                                        dataPointsxMin={this.state.dataPointsxMin}
                                        dataPointsxMax={this.state.dataPointsxMax}
                                        /* xMinNodes = {[]} */
                                        /* xMaxNods = {[]} */
                                    />
                                </div>
                            </div>
                            <div style={{'overflowY': 'scroll'}} key="c">
                                <DataPointDetail dataPointDetails={this.state.currDataPoint}/>
                            </div>
                        </GridLayout>
                    </Tab>
                    <Tab key={2} eventKey={2} title="Compare">
                        <div>
                            {this.state.versions.length > 0 && this.state.dataset !== '' ?
                                <Compare
                                    savedInfo={this.state.savedInfo}
                                    versions={this.state.versions}
                                /> : null
                            }
                        </div>
                    </Tab>
                </Tabs>

            </Wrap>
        );
    }
}

export default MainController