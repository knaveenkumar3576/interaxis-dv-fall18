import React from 'react';
import Select from 'react-select';

class Compare extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            versions: props.versions,
            multiValue: [],
            filterOptions: []
        };
        this.handleMultiChange = this.handleMultiChange.bind(this);
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

    render() {
        let filterOptions = this.state.versions.map((attr, index) => {
            return {value: index, label: attr.name}
        });
        return (
            <div align="center" style={{width: '50%', margin: 'auto'}}>
                {filterOptions.length > 0 ?
                    <Select className={'compare'} placeholder="Select at least 2 versions to compare"
                            value={this.state.multiValue} options={filterOptions}
                            onChange={this.handleMultiChange} isMulti/> : null}
            </div>
        );
    }
}

export default Compare;