import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Just do one thing, pass `WrappedComponent` back to `getInstance` (if any)
const withRef = (WrappedComponent) => {
  return class withRef extends Component {

    static propTypes = {
      getInstance: PropTypes.func,
      ref: PropTypes.func,
    };
    static displayName = `withRef(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
    render() {
      // You directly modify this.props.ref in the react development mode will report an error, you are not allowed to modify
      const props = {
        ...this.props,
      };
      // Assign getInstance to ref here
      // Pass to `WrappedComponent` so that getInstance can get the `WrappedComponent` instance
      if (typeof this.props.getInstance === 'function') {
        props.ref = this.props.getInstance;
      }
      return (
        <WrappedComponent {...props} />
      );
    }
  };
};

export default withRef;
