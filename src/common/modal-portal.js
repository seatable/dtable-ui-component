import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const modalRoot = document.getElementById('modal-wrapper');

export default class ModalPortal extends React.Component {

  static propTypes = {
    children: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }

  componentDidMount() {
    modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(
      this.props.children,
      this.el,
    );
  }
}
