import React, { Component } from 'react';
import { scaleLinear, scaleBand } from 'd3-scale';
import { max, range } from 'd3-array';
// import { axisBottom, axisLeft } from 'd3-axis';
import { transition } from 'd3-transition';
import { select } from 'd3-selection';
import { csv } from 'd3-request'
import * as d3 from 'd3';
import data from '../data/Census Data.csv';
import DataPointDetail from './DataPointDetail';

class MainData extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
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
            }
        };
    }

    componentWillMount() {
        let self = this
        
    }

    componentDidMount() {
        //Width and heig
        d3.csv(data).then((data) => {
            this.setState({
                data: data
            });
            console.log("Data: ");
            console.log(data);
            return data;
        });

        this.setState({hello: "World"});
        console.log("State: " + this.state.data)
    }
    

    render() {
        return (
            <div>
                <DataPointDetail dataPointDetails={this.state.dataPointDetails} />
            </div>
        )
    }

};

export default MainData;