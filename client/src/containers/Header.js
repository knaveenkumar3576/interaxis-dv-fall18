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
            versions: [],
            savedInfo: []
            // reload: props.reload
        };

        this.handleDataSetChange = this.handleDataSetChange.bind(this);
        this.handleVersionChange = this.handleVersionChange.bind(this);
        this.loadVersionInfo = this.loadVersionInfo.bind(this);
    }

    componentDidMount() {
        this.loadVersionInfo();
    }

    loadVersionInfo() {
        const itemsRef = firebase.database().ref('items');
        let that = this;
        itemsRef.on('value', (snapshot) => {
            let items = snapshot.val();
            if (items != null) {
                let versions = [], info = [];
                let recentVersion = '';
                for (let item in items) {
                    if (items.hasOwnProperty(item)) {
                        info.push(items[item]);
                        versions.push({name: items[item]['version']});
                        recentVersion = items[item]['version'];
                    }
                }
                that.setState({data: info[0].dataset, versions: versions, version: recentVersion, savedInfo: info});
                that.props.onVersionChanged(versions, recentVersion, info.filter((attr) => {
                    return attr.version === recentVersion
                })[0]);
            } else {
                that.setState({version: '1.0'});
                that.props.onVersionChanged([], '1.0', []);
            }
        });
    }

    // componentWillReceiveProps(props) {
    //     if (props.reload !== this.state.reload) {
    //         this.setState({
    //             reload: props.reload
    //         }, () => {
    //             this.loadVersionInfo();
    //         });
    //     }
    // }

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
        this.props.onVersionChanged(this.state.versions, e, this.state.savedInfo.filter((attr) => {
            return attr.version === e
        })[0]);
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
                        <a>Inter-Axis Scatter Plot </a>
                        <a>({this.state.version})</a>
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