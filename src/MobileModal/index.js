import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd-mobile';

class MobileModal extends React.PureComponent {

  componentDidMount() {
    window.history.pushState(null, null, '#');
    window.addEventListener('popstate', this.handleHistoryBack, false);
  }

  componentWillUnmount() {
    window.removeEventListener('popstate', this.handleHistoryBack, false);
  }

  handleHistoryBack = (e) => {
    e.preventDefault();
    this.props.onClose();
  };

  render() {
    const { children, ...props } = this.props;
    return (
      <Modal { ...props } popup >
        {children}
      </Modal>
    );
  }
}

MobileModal.defaultProps = {
  visible: true,
  animationType: 'slide-up',
  transitionName: 'transitionName',
  maskTransitionName: 'maskTransitionName'
};

MobileModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default MobileModal;
