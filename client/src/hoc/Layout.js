import React,{Component} from 'react'
import BarChart from '../Components/BarChart';

import Wrap from './Wrap';
import MainController from '../containers/MainController'

class Layout extends Component {

    constructor() {
        super()
    }

    render() {
        return (
            <Wrap>
                <MainController />
            </Wrap>
        );
    }
 }

export default Layout