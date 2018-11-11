import React from 'react';
import firebase from '../hoc/firebase';
import PanelGroup from 'react-panelgroup';
import {Button, DropdownButton, MenuItem, Label, Grid, Row, Col} from 'react-bootstrap';
import '../css/SaveUtil.css';

var Multiselect = require('react-bootstrap-multiselect');

class SaveUtil extends React.Component {
    constructor(props) {
        super(props);
        let columns = this.parseColumns(props.columns);
        this.state = {
            xAttributes: columns,
            yAttributes: columns,
            xAttribute: props.xAttribute,
            yAttribute: props.yAttribute,
            xLow: [],
            yLow: [],
            xHigh: [],
            yHigh: [],
            currentVersion: props.currentVersion,
            versions: props.versions
        };
        this.handleXChange = this.handleXChange.bind(this);
        this.handleYChange = this.handleYChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    parseColumns(data) {
        let columns = [];
        data.forEach(function (column) {
            columns.push({name: column});
        });
        return columns;
    }

    handleXChange(e) {
        this.setState({
            xAttribute: e
        });
        this.props.onXChange(e);
    }

    handleYChange(e) {
        this.setState({
            yAttribute: e
        });
        this.props.onYChange(e);
    }

    handleSubmit(e) {
        e.preventDefault();
        const itemsRef = firebase.database().ref('items');
        const item = {
            title: this.state.currentItem,
            user: this.state.username
        };

        itemsRef.push(item);
        this.setState({
            version: ''
        });
    }

    componentDidMount() {
        const itemsRef = firebase.database().ref('items');
        itemsRef.on('value', (snapshot) => {
            let items = snapshot.val();
            let newState = [];
            for (let item in items) {
                if (items.hasOwnProperty(item)) {
                    newState.push({
                        id: item,
                        xAttribute: items[item].xAttribute,
                        yAttribute: items[item].yAttribute,
                        xLow: items[item].xLow,
                        yLow: items[item].yLow,
                        xHigh: items[item].xHigh,
                        yHigh: items[item].yHigh,
                    });
                }
            }

        });
    }

    refreshPage(props, columns) {
        this.setState({
            xAttributes: columns,
            yAttributes: columns,
            xAttribute: props.xAttribute,
            yAttribute: props.yAttribute
        })
    }

    componentWillReceiveProps(props) {
        if (props.currentVersion !== this.state.currentVersion) {
            this.setState({
                versions: props.versions,
                currentVersion: props.currentVersion
            });
        }
        let columns = this.parseColumns(props.columns);
        if (columns.join('') !== this.state.xAttributes.join('')) {
            this.refreshPage(props, columns);
        }
    }

    removeItem(itemId) {
        const itemRef = firebase.database().ref(`/items/${itemId}`);
        itemRef.remove().then(function () {
            console.log('Items Removed');
        })
    }

    onStartFresh(e) {

    }

    render() {
        let xAttributes = this.state.xAttributes.map((attr, index) => <MenuItem
            key={index} eventKey={attr.name} onSelect={this.handleXChange}>{attr.name}</MenuItem>);
        let yAttributes = this.state.yAttributes.map((attr, index) => <MenuItem
            key={index} eventKey={attr.name} onSelect={this.handleYChange}>{attr.name}</MenuItem>);
        return (
            <div className='filter-container'>
                <form className={'filter-form'} onSubmit={this.handleSubmit}>
                    <PanelGroup panelWidths={[
                        {size: 120, resize: 'fixed'},
                        {minSize: 180, resize: 'fixed'}
                    ]}>
                        <div className={'row'}>
                            <h4><label style={{margin: '10px 0 0 20px'}}>X Attribute:</label></h4>
                            <h4><label style={{margin: '20px 0 0 20px'}}>Y Attribute:</label></h4>
                        </div>
                        <div className={'row'}>
                            <DropdownButton className={'drop-down-btn'} bsStyle='primary' title={this.state.xAttribute}
                                            id={'xAttribute'}>{xAttributes}</DropdownButton>
                            <DropdownButton className={'drop-down-btn'} bsStyle='primary'
                                            title={this.state.yAttribute}
                                            id={'yAttribute'}>{yAttributes}</DropdownButton>
                        </div>
                    </PanelGroup>
                    <br/>

                    <div className={'row bottom-column'}>
                        <div align="center">
                            <Button bsStyle="success" style={{margin: '0 15px 0 0'}} type="submit">Save</Button>
                            <Button bsStyle="warning" onClick={this.onStartFresh.bind(this)}>Start Fresh</Button>
                            {/*<Multiselect data={this.state.versions} multiple/>*/}
                        </div>

                    </div>
                </form>
                {/*<section className='display-item'>*/}
                {/*<div className="wrapper">*/}
                {/*<ul>*/}
                {/*{this.state.versions.map((item) => {*/}
                {/*return (*/}
                {/*<li key={item.id}>*/}
                {/*<h3>{item.title}</h3>*/}
                {/*<p>brought by: {item.user}*/}
                {/*<button onClick={() => this.removeItem(item.id)}>Remove Item</button>*/}
                {/*</p>*/}
                {/*</li>*/}
                {/*)*/}
                {/*})}*/}
                {/*</ul>*/}
                {/*</div>*/}
                {/*</section>*/}
            </div>
        );
    }

}

export default SaveUtil;