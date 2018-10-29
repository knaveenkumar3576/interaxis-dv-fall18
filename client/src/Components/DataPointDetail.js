/* 
Pass an object {key: value, key: value, ... } as props
Will render the object as table
*/

import React from 'react';
import ListItems from './ListItems';

class DataPointDetail extends React.Component { 

    constructor(props) {
        super(props)

        this.state = {
        }
    }

    componentDidMount() {
    }

    componentDidUpdate() {
        return true
    }

    render() {

        let self = this

        let dataPointsArray = []

        if (this.props.dataPointDetails) {
            Object.keys(self.props.dataPointDetails).forEach((key) => {
                let attribute = {
                    key: key,
                    value: self.props.dataPointDetails[key]
                };
                dataPointsArray.push(attribute)
            })

            console.log("Dp array: ");
            console.log(dataPointsArray)

            return ( 
                <ListItems data={dataPointsArray} dataPointName={"Name"}/>
            )
        }
        else {
            return ("");
        }
    }
}

export default DataPointDetail;