import React from 'react';
import BootstrapModal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import './Modal.css';

class Modal extends React.PureComponent {
  render() {
    return (
      <BootstrapModal
        styles={{ width: 1250 }}
        {...this.props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <BootstrapModal.Header closeButton>
          <BootstrapModal.Title id="contained-modal-title-vcenter">
            {this.props.header}
          </BootstrapModal.Title>
        </BootstrapModal.Header>
        <BootstrapModal.Body>{this.props.children}</BootstrapModal.Body>
        <BootstrapModal.Footer>
          <Button
            disabled={!this.props.isSelected}
            onClick={this.props.onSuccess}
            variant="success"
          >
            Chấp nhận
          </Button>
          <Button onClick={this.props.onHide}>Close</Button>
        </BootstrapModal.Footer>
      </BootstrapModal>
    );
  }
}

export default Modal;
