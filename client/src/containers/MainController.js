import React,{Component} from 'react'
import PanelGroup from 'react-panelgroup'


import Wrap from '../hoc/Wrap';

class MainController extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data : []
        };
    }

    render() {
        return (
            <Wrap>
                <PanelGroup direction="column" borderColor="grey">
                    <PanelGroup direction="row" borderColor="grey" panelWidths={[
                        {size: 200, minSize:0, resize: "dynamic"},
                        {size: 50, minSize:0, resize: "dynamic"},
                        {size: 100, minSize:50, resize: "stretch"}
                    ]}>
                        <div> Y Bar plots </div>
                        <div> Y dropzones  </div>
                        <div> Scatter plot </div>
                    </PanelGroup>                    
                    <PanelGroup direction="row" borderColor="grey" panelWidths={[
                        {size: 200, minSize:50, resize: "dynamic"},
                        {minSize:100, resize: "stretch"},
                    ]}>
                        <div> Filters </div>
                        <div> X dropzones  </div>
                    </PanelGroup>                    

                    <PanelGroup direction="row" borderColor="grey" panelWidths={[
                        {size: 200, minSize:50, resize: "dynamic"},
                        {size: 100, minSize:50, resize: "dynamic"}
                    ]}>
                        <div> Extra Filters </div>
                        <div> X Bar Plots </div>
                    </PanelGroup>                    

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