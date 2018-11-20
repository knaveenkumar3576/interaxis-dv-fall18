import React from 'react';
import firebase from '../hoc/firebase';
import {Button, DropdownButton, MenuItem} from 'react-bootstrap';
import '../css/SaveUtil.css';
import Select from 'react-select';
import Trigger from '../containers/Trigger';

class SaveUtil extends React.Component {
    constructor(props) {
        super(props);
        let columns = this.parseColumns(props.columns);
        this.state = {
            dataset: props.dataset,
            xAttributes: columns,
            yAttributes: columns,
            xAttribute: props.default[0],
            yAttribute: props.default[1],
            xMin: props.xMin,
            yMin: props.yMin,
            xMax: props.xMax,
            yMax: props.yMax,
            currentVersion: props.currentVersion,
            versions: props.versions,
            multiValue: [],
            filterOptions: []
        };
        this.handleXChange = this.handleXChange.bind(this);
        this.handleYChange = this.handleYChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleMultiChange = this.handleMultiChange.bind(this);
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

    handleMultiChange(option) {
        this.setState({
            multiValue: option
        });
        if (option.length > 1) {
            this.props.onCompareChange(option.map(attr => {
                return attr.label;
            }));
        }
    }

    onSaveCallback(name) {
        const itemsRef = firebase.database().ref('items');
        const item = {
            dataset: this.state.dataset,
            xMin: this.state.xMin,
            xMax: this.state.xMax,
            yMin: this.state.yMin,
            yMax: this.state.yMax,
            version: name,
            xAttribute: this.state.xAttribute,
            yAttribute: this.state.yAttribute
        };

        itemsRef.push(item);
    }

    handleSubmit(e) {
        e.preventDefault();
        const itemsRef = firebase.database().ref('items');
        const item = {
            xMin: this.state.xMin,
            xMax: this.state.xMax,
            yMin: this.state.yMax,
            yMax: this.state.yMax,
            version: this.state.currentVersion,
            xAttribute: this.state.xAttribute,
            yAttribute: this.state.yAttribute
        };

        itemsRef.push(item);
    }

    componentWillReceiveProps(props) {
        if (props.currentVersion !== this.state.currentVersion) {
            this.setState({
                versions: props.versions,
                currentVersion: props.currentVersion,
                xAttribute: props.xAttribute,
                yAttribute: props.yAttribute
            });
        }
        let columns = this.parseColumns(props.columns);
        if (columns.join('') !== this.state.xAttributes.join('')) {
            let x = props.xAttribute === 'customX' ? props.xAttribute : props.default[0];
            let y = props.yAttribute === 'customY' ? props.yAttribute : props.default[1];
            this.setState({
                dataset: props.dataset,
                xAttributes: columns,
                yAttributes: columns,
                xAttribute: x,
                yAttribute: y
            });
        }
        if (props.xAttribute !== this.state.xAttribute || props.yAttribute !== this.state.yAttribute) {
            this.setState({
                xAttribute: props.xAttribute,
                yAttribute: props.yAttribute
            });
        }
        if (props.xMin.join('') !== this.state.xMin.join('') || props.xMax.join('') !== this.state.xMax.join('') ||
            props.yMin.join('') !== this.state.yMin.join('') || props.yMax.join('') !== this.state.yMax.join('')) {
            this.setState({
                xMin: props.xMin,
                yMin: props.yMin,
                xMax: props.xMax,
                yMax: props.yMax
            });
        }
    }

    removeItem(itemId) {
        const itemRef = firebase.database().ref(`/items/${itemId}`);
        itemRef.remove().then(function () {
            console.log('Items Removed');
        })
    }

    onStartFresh(e) {
        this.props.onRefresh();
    }

    render() {
        let smClose = (name) => this.setState({smShow: false}, () => {
            if (name !== undefined) {
                this.onSaveCallback(name);
            }
        });
        let xAttributes = this.state.xAttributes.map((attr, index) => <MenuItem
            key={index} eventKey={attr.name} onSelect={this.handleXChange}>{attr.name}</MenuItem>);
        let yAttributes = this.state.yAttributes.map((attr, index) => <MenuItem
            key={index} eventKey={attr.name} onSelect={this.handleYChange}>{attr.name}</MenuItem>);
        let availableNames = this.state.versions.map((attr) => {
            return attr.name
        });
        let filterOptions = this.state.versions.map((attr, index) => {
            return {value: index, label: attr.name}
        });
        return (
            <div className='filter-container'>
                <form className={'filter-form'} onSubmit={this.handleSubmit}>
                    <div align="center" style={{margin: '10px 0 0 0'}}>
                        <DropdownButton className={'drop-down-btn'} bsStyle='primary' bsSize={'xsmall'}
                                        title={this.state.xAttribute}
                                        id={'xAttribute'}>{xAttributes}</DropdownButton>
                        <DropdownButton className={'drop-down-btn'} bsStyle='primary' bsSize={'xsmall'}
                                        title={this.state.yAttribute}
                                        id={'yAttribute'}>{yAttributes}</DropdownButton>
                        {filterOptions.length > 0 ?
                            <Select className={'compare'} placeholder="Select at least 2 versions to compare"
                                    value={this.state.multiValue} options={filterOptions}
                                    onChange={this.handleMultiChange} isMulti/> : null}

                    </div>

                    <br/>

                    <div className={'row bottom-column'}>
                        <div style={{margin: '0 0 0 20%'}}>
                            <Button bsStyle="success" style={{margin: '0 15px 0 0'}}
                                    onClick={() => this.setState({smShow: true})}>
                                Save
                            </Button>
                            <Trigger show={this.state.smShow} onHide={smClose} names={availableNames}/>
                            <Button bsStyle="warning" onClick={this.onStartFresh.bind(this)}>Start Fresh</Button>
                        </div>

                    </div>
                </form>
            </div>
        );
    }

}

export default SaveUtil;