import React from 'react';
import firebase from '../hoc/firebase';
import {Navbar, Nav, NavItem, NavDropdown, MenuItem} from 'react-bootstrap'

class Header extends React.Component {
    constructor(props) {
        super(props);
        let dataset = [];
        for (let key in props.dataset) {
            if (props.dataset.hasOwnProperty(key)) {
                dataset.push({name: key});
            }
        }

        this.state = {
            data: dataset[0].name,
            dataset: dataset,
            version: '',
            versions: []
        };

        this.handleDataSetChange = this.handleDataSetChange.bind(this);
        this.handleVersionChange = this.handleVersionChange.bind(this);
    }

    componentDidMount() {
        const itemsRef = firebase.database().ref('items');
        let that = this;
        itemsRef.on('value', (snapshot) => {
            let items = snapshot.val();
            if (items != null) {
                let newState = [];
                let recentVersion = '';
                for (let item in items) {
                    if (items.hasOwnProperty(item)) {
                        newState.push({name: items[item]});
                        recentVersion = item;
                    }
                }
                that.setState({versions: newState, version: recentVersion});
                that.props.onVersionChanged([], recentVersion);
            } else {
                // that.setState({version: '1.0'});
                // that.props.onVersionChanged([], '1.0');
                that.setState({versions: [{name: '1.0'}, {name: '1.1'}, {name: '2.0'}, {name: '2.1'}], version: '2.1'});
                that.props.onVersionChanged([{name: '1.0'}, {name: '1.1'}, {name: '2.0'}, {name: '2.1'}], '2.1');
            }
        });
    }

    handleDataSetChange(e) {
        this.setState({
            data: e
        });
        this.props.onDataSetChanged(e);
    }

    handleVersionChange(e) {
        this.setState({
            version: e
        });
        this.props.onVersionChanged(this.state.versions, e);
    }

    render() {
        let data = this.state.dataset.map((attr, index) => <MenuItem
            key={index} eventKey={attr.name} onSelect={this.handleDataSetChange}>{attr.name}</MenuItem>);
        let version = this.state.versions.map((attr, index) => <MenuItem
            key={index} eventKey={attr.name} onSelect={this.handleVersionChange}>{attr.name}</MenuItem>);
        return (
            <Navbar>
                <Navbar.Header>
                    <Navbar.Brand>
                        <a>Inter-Axis Scatter Plot</a>
                    </Navbar.Brand>
                </Navbar.Header>
                <Nav pullRight={true}>
                    <NavDropdown title={this.state.data} id="basic-nav-dropdown-dataset">{data}</NavDropdown>
                    {this.state.versions.length > 0 ? <NavDropdown title={this.state.version}
                                                                   id="basic-nav-dropdown-version">{version}</NavDropdown> : null}
                </Nav>
            </Navbar>
        );
    }
}

export default Header;