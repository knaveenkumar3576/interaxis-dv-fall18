import React from 'react';
import firebase from '../hoc/firebase';
import {Button, DropdownButton, MenuItem} from 'react-bootstrap';
import '../css/SaveUtil.css';

var Multiselect = require('react-bootstrap-multiselect');

class SaveUtil extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            xAttributes: props.xAttributes,
            yAttributes: props.yAttributes,
            xAttribute: 'Choose X Attribute',
            yAttribute: 'Choose Y Attribute',
            xLow: [],
            yLow: [],
            xHigh: [],
            yHigh: [],
            versions: []
        };
        this.handleXChange = this.handleXChange.bind(this);
        this.handleYChange = this.handleYChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleXChange(e) {
        this.setState({
            xAttribute: e
        });
    }

    handleYChange(e) {
        this.setState({
            yAttribute: e
        });
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

    removeItem(itemId) {
        const itemRef = firebase.database().ref(`/items/${itemId}`);
        itemRef.remove().then(function () {
            console.log('Items Removed');
        })
    }

    render() {
        let xAttributes = this.state.xAttributes.map((attr, index) => <MenuItem
            key={index} eventKey={attr.name} onSelect={this.handleXChange}>{attr.name}</MenuItem>);
        let yAttributes = this.state.yAttributes.map((attr, index) => <MenuItem
            key={index} eventKey={attr.name} onSelect={this.handleYChange}>{attr.name}</MenuItem>);
        return (
            <div className='filter-container'>
                <form className={'filter-form'} onSubmit={this.handleSubmit}>
                    <div align="center" className={'row form-row'}>
                        <DropdownButton className={'drop-down-btn'} bsStyle='primary' title={this.state.xAttribute}
                                        id={'xAttribute'}>{xAttributes}</DropdownButton>
                    </div>
                    <br/>
                    <div align="center" className={'row form-row'}>
                        <DropdownButton className={'drop-down-btn'} bsStyle='primary' title={this.state.yAttribute}
                                        id={'yAttribute'}>{yAttributes}</DropdownButton>
                    </div>
                    <div className={'row bottom-column'}>
                        <div align="center">
                            <Button bsStyle="success" type="submit">Save</Button>
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