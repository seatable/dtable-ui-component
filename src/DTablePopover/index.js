import React from 'react';
import { Popover } from 'reactstrap';
import PropTypes from 'prop-types';
import { getEventClassName } from '../utils/utils';

class DTablePopover extends React.Component {

  dtablePopoverRef = null;

  componentDidMount() {
    document.addEventListener('mousedown', this.onMousedown);
    document.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('popstate', this.onHistoryState);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.onMousedown);
    document.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('popstate', this.onHistoryState);
  }

  onHistoryState = (e) => {
    e.preventDefault();
    this.props.hideDTablePopover(e);
  }

  onKeyDown = (e) => {
    const { canHideDTablePopover, hideDTablePopoverWithEsc } = this.props;
    if (e.keyCode === 27 && typeof hideDTablePopoverWithEsc === 'function') {
      e.preventDefault();
      hideDTablePopoverWithEsc();
    } else if (e.keyCode === 13) {
      // Resolve the default behavior of the enter key when entering formulas is blocked
      if (canHideDTablePopover) return;
      e.stopImmediatePropagation();
    }
  }

  onMousedown = (e) => {
    const { canHideDTablePopover } = this.props;
    if (!canHideDTablePopover) return;
    if (this.dtablePopoverRef && e && getEventClassName(e).indexOf('popover') === -1 && !this.dtablePopoverRef.contains(e.target)) {
      this.props.hideDTablePopover(e);
    }
  }

  onPopoverInsideClick = (e) => {
    e.stopPropagation();
  }

  render() {
    const { target, innerClassName, popoverClassName, hideArrow, modifiers, placement } = this.props;
    return (
      <Popover
        placement={placement}
        isOpen={true}
        target={target}
        fade={false}
        hideArrow={hideArrow}
        innerClassName={innerClassName}
        className={popoverClassName}
        modifiers={modifiers}
      >
        <div ref={ref => this.dtablePopoverRef = ref} onClick={this.onPopoverInsideClick}>
          {this.props.children}
        </div>
      </Popover>
    );
  }
}

DTablePopover.defaultProps = {
  placement: 'bottom-start',
  hideArrow: true,
  canHideDTablePopover: true
};

DTablePopover.propTypes = {
  target: PropTypes.string.isRequired,
  innerClassName: PropTypes.string,
  popoverClassName: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  hideDTablePopover: PropTypes.func.isRequired,
  hideDTablePopoverWithEsc: PropTypes.func,
  hideArrow: PropTypes.bool,
  canHideDTablePopover: PropTypes.bool,
  placement: PropTypes.string,
  modifiers: PropTypes.object
};

export default DTablePopover;
