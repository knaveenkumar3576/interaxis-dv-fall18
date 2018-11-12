/* For use with DataPointDetail */
import React from 'react';

class ListItems extends React.Component {
    render() {

        let self = this

        let details = self.props.data.map((item) => {
            return ( 
                <tr>
                    <td > 
                        {/* { console.log(item.key) }  */}
                        { item.key } 
                    </td>  
                    <td> 
                        {/* { console.log(item.value) }  */}
                        { item.value } 
                    </td>  
                </tr>
            )
        })

        return (
            <div>
                <table>
                    <tr>
                        <p> { self.props.dataPointName } </p> 
                    </tr>  
                    { details } 
                </table> 
            </div>
        );
    }
}

export default ListItems;