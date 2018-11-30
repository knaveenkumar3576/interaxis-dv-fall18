/* For use with DataPointDetail */
import React from 'react';
import {ListGroupItem} from 'react-bootstrap'

class ListItems extends React.Component {
    render() {

        let self = this

        let details = self.props.data.map((item) => {
            return ( 
                <ListGroupItem> {item.key} -  {item.key} </ListGroupItem>
            )
        })

        return (
            {details}
        );
    }
}

export default ListItems;