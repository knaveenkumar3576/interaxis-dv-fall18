import React from 'react';
import {Button, Modal, FormGroup, ControlLabel, FormControl} from 'react-bootstrap';

class Trigger extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            availableNames: props.names,
            value: ''
        };

        this.handleHide = this.handleHide.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleHide() {
        this.props.onHide(this.state.value);
    }

    getValidationState() {
        if (this.state.value === '')
            return null;
        if (this.state.availableNames.includes(this.state.value))
            return 'error';

        return 'success'
    }

    handleChange(e) {
        this.setState({value: e.target.value});
    }

    render() {
        return (
            <Modal {...this.props} bsSize="small" aria-labelledby="contained-modal-title-sm">
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-sm">Save Dialog</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <FormGroup controlId="formBasicText" validationState={this.getValidationState()}>
                            <ControlLabel>Enter new name to save</ControlLabel>
                            <FormControl type="text" value={this.state.value} placeholder="Enter text"
                                         onChange={this.handleChange} onKeyPress={event => {
                                if (event.key === "Enter") {
                                    event.preventDefault();
                                }
                            }}/>
                            <FormControl.Feedback/>
                        </FormGroup>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.handleHide}>Save</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default Trigger;