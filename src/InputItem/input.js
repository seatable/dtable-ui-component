import * as React from 'react';
import './style/index.css';

class Input extends React.Component {
  onInputBlur = e => {
    const value = e.target.value;
    if (this.props.onBlur) {
      this.props.onBlur(value);
    }
  };

  onInputFocus = e => {
    // here should have a value definition but none.
    const value = e.target.value;
    if (this.props.onFocus) {
      this.props.onFocus(value);
    }
  };

  focus = () => {
    if (this.inputRef) {
      this.inputRef.focus();
    }
  };

  render() {
    const { onBlur, onFocus, ...restProps } = this.props;
    return (
      <input
        ref={el => (this.inputRef = el)}
        onBlur={this.onInputBlur}
        onFocus={this.onInputFocus}
        {...restProps}
      />
    );
  }
}

export default Input;
