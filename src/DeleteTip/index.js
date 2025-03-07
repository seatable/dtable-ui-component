import React from 'react';
import PropTypes from 'prop-types';
import ClickOutside from '../ClickOutside';
import ModalPortal from '../ModalPortal';
import { getLocale } from '../lang';

import './index.css';

class DeleteTip extends React.Component {

  handleOutsideClick = (e) => {
    if (this.tipContainer && !this.tipContainer.contains(e.target)) {
      this.props.toggle();
    }
  };

  render() {
    const { toggle, handleDelete, position, deleteTip } = this.props;
    return (
      <ModalPortal>
        <ClickOutside onClickOutside={this.handleOutsideClick}>
          <div
            ref={(node) => this.tipContainer = node}
            className="dtable-tip tip-container"
            style={{ top: position.top, left: position.left }}
          >
            <b className="mb-4">{deleteTip}</b>
            <div className="d-flex justify-content-end">
              <button className="btn btn-secondary mr-2" onClick={toggle}>{getLocale('Cancel')}</button>
              <button className="btn btn-primary" onClick={handleDelete}>{getLocale('Delete')}</button>
            </div>
          </div>
        </ClickOutside>
      </ModalPortal>
    );
  }
}

DeleteTip.propTypes = {
  position: PropTypes.object.isRequired,
  handleDelete: PropTypes.func.isRequired,
  toggle: PropTypes.func.isRequired,
  deleteTip: PropTypes.string.isRequired,
};

export default DeleteTip;
