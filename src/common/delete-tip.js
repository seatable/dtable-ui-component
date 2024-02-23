import React  from 'react';
import PropTypes from 'prop-types';
import ModalPortal from './modal-portal';
import { getLocale } from '../lang';

import './delete-tip.css';

export default class DeleteTip extends React.Component {

  static propTypes = {
    position: PropTypes.object.isRequired,
    onDelete: PropTypes.func.isRequired,
    toggle: PropTypes.func.isRequired,
    deleteTip: PropTypes.string.isRequired,
  };

  componentDidMount() {
    document.addEventListener('mousedown', this.onMouseDown);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.onMouseDown);
  }

  onMouseDown = (e) => {
    if (this.tipContainer && !this.tipContainer.contains(e.target)) {
      this.props.toggle();
    }
  };

  render() {
    const { toggle, onDelete, position, deleteTip } = this.props;
    return (
      <ModalPortal>
        <div
          ref={(node) => this.tipContainer = node}
          className="dtable-tip tip-container"
          style={{ top: position.top, left: position.left }}
          onClick={(e) => e.stopPropagation()}
        >
          <b className="mb-4">{deleteTip}</b>
          {/* TODO add 'do not show this tip', if checked, save into localStorage */}
          <div className="d-flex justify-content-end">
            <button className="btn btn-secondary mr-2" onClick={toggle}>{getLocale('Cancel')}</button>
            <button className="btn btn-primary" onClick={onDelete}>{getLocale('Delete')}</button>
          </div>
        </div>
      </ModalPortal>
    );
  }
}
