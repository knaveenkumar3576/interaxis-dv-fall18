import React from 'react';
import PropTypes from 'prop-types';

 let dropZoneDiv = {
     height: 75,
     width: 75,
     backgroundColor: "lightgreen"
 };

/** Props:
 * Position: xMax, xMin, yMax, yMin  
 * Callback: to restore circle back to the scatterplot on double click
 */
class DropZone extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            dataPointList: [], // List of objects having details about circles
        };

        // Function bindings
        this.addDataPoint = this.addDataPoint.bind(this);
        this.removeDataPoint = this.removeDataPoint.bind(this);
        this.dragOverHandler = this.dragOverHandler.bind(this);
    }

    addDataPoint(event) {
        event.preventDefault();
        console.log("Dropped ...");
    }

    removeDataPoint(event) {
        event.preventDefault();
        console.log("Double Click ...");
    }

    dragOverHandler(event) {
        event.preventDefault();
        console.log("Drag over ...");
        // Change background color
        this.setState({backgroundColor: "gray"});
    }

    render() {
        return (
            <div 
                style={dropZoneDiv} 
                onDragOver={this.dragOverHandler}
                onDragLeave={this.dragLeaveHandler}
                onDoubleClick={this.removeDataPoint} 
                onDrop={this.addDataPoint} >
            </div>
        )
    }

};

export default DropZone;