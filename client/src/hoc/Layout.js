import React,{Component} from 'react'

import Wrap from './Wrap';
import MainController from '../containers/MainController'

class Layout extends Component {

    render() {
        return (
            <Wrap>
                <MainController />
            </Wrap>
        );
    }
 }

export default Layout;