/* 
Pass an object {key: value, key: value, ... } as props
Will render the object as table
*/

import React from 'react';
import ListItems from './ListItems';
import {ListGroup, ListGroupItem, Label} from 'react-bootstrap'

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

            let details = dataPointsArray.map((item) => {
                return ( 
                    <ListGroupItem bsClass={"border: none"}> <Label bsStyle="default">{item.key}</Label>  <Label bsStyle="info">{item.value}</Label></ListGroupItem>
                )
            })

            return ( 
                <ListGroup>
                    {details}
                </ListGroup>
            )
        }
        else {
            return ("");
        }
    }
}

export default DataPointDetail;