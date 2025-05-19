import * as React from 'react';
import * as ReactDOM from 'react-dom';

const createPortal = ReactDOM.createPortal;
export default class Portal extends React.Component {
  constructor(props) {
    super(props);
    this.container = this.props.getContainer();
  }

  render() {
    if (this.props.children) {
      return createPortal(this.props.children, this.container);
    }
    return null;
  }
}
