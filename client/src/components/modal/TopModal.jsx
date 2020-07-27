import React from 'react';
import './TopModal.css';

class SmallModal extends React.PureComponent {
  render() {
    return this.props.show ? (
      <div className="diy-top-modal diy-sm-modal">
        <div className="diy-fade"></div>

        <div className="diy-modal-content" style={this.props.style}>
          <div className="diy-modal-header">
            <h4>{this.props.header}</h4>
            <button onClick={this.props.onHide}>X</button>
          </div>

          <div className="diy-modal-body">{this.props.children}</div>
        </div>
      </div>
    ) : null;
  }
}

export default SmallModal;
