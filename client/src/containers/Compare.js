import React from 'react';
import Select from 'react-select';
import * as Papa from 'papaparse';
import DataPointDetail from '../Components/DataPointDetail';
import MultiScatterPlot from '../Components/MultiScatterPlot';

import {Grid, Col, Row} from 'react-bootstrap'

const KEYS_TO_BE_USED = {
    sample: ['x', 'y', 'z'],
    census: ['TotalPop', 'Men', 'Women', 'Hispanic', 'White', 'Black', 'Native', 'Asian', 'Pacific', 'Citizen', 'Income', 'IncomeErr', 'IncomePerCap', 'IncomePerCapErr', 'Poverty', 'ChildPoverty', 'Professional', 'Service', 'Office', 'Construction', 'Production', 'Drive', 'Carpool', 'Transit', 'Walk', 'OtherTransp', 'WorkAtHome', 'MeanCommute', 'Employed', 'PrivateWork', 'PublicWork', 'SelfEmployed', 'FamilyWork', 'Unemployment'],
    car: ['Sedan', 'Sports Car', 'SUV', 'Wagon', 'Minivan', 'Pickup', 'AWD', 'RWD', 'Retail Price', 'Dealer Cost', 'Engine Size', 'Cyl', 'HP', 'City MPG', 'Hwy MPG', 'Weight', 'Wheel Base', 'Len', 'Width'],
    football: ['Age', 'Overall', 'Potential', 'Special', 'Acceleration', 'Aggression', 'Agility', 'Balance', 'Ball control', 'Composure', 'Crossing', 'Curve', 'Dribbling', 'Finishing', 'Free kick accuracy', 'GK diving', 'GK handling', 'GK kicking', 'GK positioning', 'GK reflexes', 'Heading accuracy', 'Interceptions', 'Jumping', 'Long passing', 'Long shots', 'Marking', 'Penalties', 'Positioning', 'Reactions', 'Short passing', 'Shot power', 'Sliding tackle', 'Sprint speed', 'Stamina', 'Standing tackle', 'Strength', 'Vision', 'Volleys']
};


class Compare extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            versions: props.versions,
            multiValue: [],
            filterOptions: [],
            dataPoints1: [],
            dataPoints2: [],
            originalDataPoints1: [],
            originalDataPoints2: [],
            selectedLabels1 : {},
            selectedLabels2: {},
            currDataPoint: null,
            scatterPlotWidth: 800,
            scatterPlotHeight: 600,

        };
        this.handleMultiChange = this.handleMultiChange.bind(this);
    }

    handleMultiChange(option) {
        this.setState({
            multiValue: option
        });
        if (option.length > 1) {
            this.onCompareChange(option.map(attr => {
                return attr.label;
            }));
        }
    }

    scatterOnMouseOverCallback(i) {
        this.setState({currDataPoint: this.state.originalDataPoints1[i]});


        // var svg = d3.select('#comparescatterPlotId').select('svg');

        // svg.selectAll(".dot")
        // .style("opacity","1")
        // .style("fill", "red");

        // let selectedDataset = this.state.dataset;

        // if(itemName !== '') {

        //     svg.selectAll(".dot")
        //     .style("opacity","0")
        //     .filter(function(d) { 
        //         var searchString = d[SEARCH_PARAMS[selectedDataset]].toLowerCase(); 
        //         var searchPattern = itemName.toLowerCase();
        //         if(searchString.indexOf(searchPattern)!=-1)
        //             return true; 
        //     })
        //     .style("opacity","1")
        //     .style("fill","yellow");
        // }
 

    }

    calculateCustomValues = (versioninfo, selectedIndex) => {

        let dataPointsxMin =  versioninfo.xMin || [];
        let dataPointsxMax =  versioninfo.xMax || [];
        let dataPointsyMin =  versioninfo.yMin || [];
        let dataPointsyMax =  versioninfo.yMax || [];

        let noOfDataPointsXMin = dataPointsxMin.length;
        let noOfDataPointsXMax = dataPointsxMax.length;

        let noOfDataPointsYMin = dataPointsyMin.length;
        let noOfDataPointsYMax = dataPointsyMax.length;

        let customX = {};
        let customY = {};

        let storedKeyLabel = "selectedLabels" + selectedIndex;
        let storedKeyDataPoints = "dataPoints" + selectedIndex;

        if (noOfDataPointsXMin > 0 && noOfDataPointsXMax > 0) {
            KEYS_TO_BE_USED[versioninfo.dataset].forEach(key => {
                let minWeights = 0;

                dataPointsxMin.forEach(d => {
                    minWeights += d[key];
                });
                let avgMinValue = minWeights / noOfDataPointsXMin;

                let maxWeights = 0;
                dataPointsxMax.forEach(d => {
                    maxWeights += d[key];
                });
                let avgMaxValue = maxWeights / noOfDataPointsXMax;
                customX[key] = avgMaxValue - avgMinValue;
            });

            this.state[storedKeyDataPoints].forEach(d => {
                let x = 0;
                KEYS_TO_BE_USED[versioninfo.dataset].forEach(key => {
                    x += d[key] * customX[key];
                });
                d["customX"] = x;
            });
        }

        if (noOfDataPointsYMin > 0 && noOfDataPointsYMax > 0) {
                KEYS_TO_BE_USED[versioninfo.dataset].forEach(key => {
                let minWeights = 0;

                dataPointsyMin.forEach(d => {
                    minWeights += d[key];
                });
                let avgMinValue = minWeights / noOfDataPointsYMin;

                let maxWeights = 0;
                dataPointsyMax.forEach(d => {
                    maxWeights += d[key];
                });
                let avgMaxValue = maxWeights / noOfDataPointsYMax;
                customY[key] = avgMaxValue - avgMinValue;
            });

            this.state[storedKeyDataPoints].forEach(d => {
                let y = 0;
                KEYS_TO_BE_USED[versioninfo.dataset].forEach(key => {
                    y += d[key] * customY[key];
                });
                d["customY"] = y;
            });
        }

        let labels = {
            x : versioninfo.xAttribute,
            y : versioninfo.yAttribute
        };

        this.setState({
            [storedKeyLabel]: labels
        });

    };

    processAndNormalizeData = (result, versioninfo, selectedIndex) => {

        let keysToNormalize = KEYS_TO_BE_USED[versioninfo.dataset];
        let resultdataPoints = result.data;
        keysToNormalize.forEach(key => {
            let max = Math.max.apply(null, resultdataPoints.map(d => d[key]));
            let min = Math.min.apply(null, resultdataPoints.map(d => d[key]));
            resultdataPoints.forEach(point => {
                point[key] = (point[key] - min) / (max - min);
            })
        });

        let storedKey = "dataPoints" + selectedIndex;
        this.setState({ [storedKey]: resultdataPoints });
        this.calculateCustomValues(versioninfo, selectedIndex);
    };

    saveOriginalData = (result, selectedIndex) => {
        let storedKey = "originalDataPoints" + selectedIndex;
        this.setState({ [storedKey]: JSON.parse(JSON.stringify(result.data)) });
    };

    changeData = (versioninfo, selectedIndex) => {

        let csvFilePath = require("../data/" + versioninfo.dataset + ".csv");

        Papa.parse(csvFilePath, {
            header: true,
            download: true,
            skipEmptyLines: true,
            complete: (result) => {
                this.saveOriginalData(result, selectedIndex);
                this.processAndNormalizeData(result, versioninfo, selectedIndex);
            }
        });
    };


    onCompareChange(options) {
        let compareData = [], that = this;

        options.forEach(function (option) {
            compareData.push(that.props.savedInfo.filter(attr => {
                return attr.version === option
            }));
        });
        this.changeData(compareData[0][0], 1);
        this.changeData(compareData[1][0], 2);
    }


    render() {

        let filterOptions = this.state.versions.map((attr, index) => {
            return {value: index, label: attr.name}
        });


        return (
            <div align="center" style={{width: '50%', margin: 'auto'}}>
                {filterOptions.length > 0 ?
                    <div>
                        <Select className={'compare'} placeholder="Select at least 2 versions to compare"
                            value={this.state.multiValue} options={filterOptions}
                            onChange={this.handleMultiChange} isMulti
                        />
                        <Grid>
                            <Row className="show-grid">
                                <Col xs={12} md={8}>
                                    <div ref={'comaparescatterPlot'} id={'comparescatterPlotId'} style={{height: '70%'}}>
                                        <MultiScatterPlot 
                                            id={'comparescatterPlotId'}
                                            dataPoints1={this.state.dataPoints1}
                                            labels1={this.state.selectedLabels1}
                                            dataPoints2={this.state.dataPoints2}
                                            labels2={this.state.selectedLabels2}
                                            width={this.state.scatterPlotWidth}
                                            height={this.state.scatterPlotHeight}
                                            detailViewCallback={this.scatterOnMouseOverCallback.bind(this)}
                                        />
                                    </div>
                                </Col>
                                <Col xs={6} md={4}>
                                    <DataPointDetail dataPointDetails={this.state.currDataPoint}/>
                                </Col>
                            </Row>
                        </Grid>

                    </div>
                    : null
                }
           </div>
        );
    }
}

export default Compare;