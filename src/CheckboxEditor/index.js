import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  isReadOnly: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  column: PropTypes.object,
  onCommit: PropTypes.func,
};

class CheckboxEditor extends React.Component {

  static defaultProps = {
    isReadOnly: false,
    value: false
  }

  constructor(props) {
    super(props);
    this.state = {
      value: props.value ? props.value : false,
    };
  }

  getValue = () => {
    let updated = {};
    let { column } = this.props;
    updated[column.name] = this.state.value;
    return updated;
  }

  onCommit = () => {
    let updated = this.getValue();
    this.props.onCommit(updated);
  }

  onChange = (event) => {
    if (this.props.isReadOnly) {
      return;
    }
    let value = event.target.checked;
    if (value === this.state.value) {
      return;
    }
    this.setState({ value }, () => {
      this.onCommit();
    });
  }

  onKeyDown = (event) => {
    event.stopPropagation();
  }

  onBlur = () => {
    // this.onCommit();
  }

  setInputRef = (input) => {
    this.input = input;
  }

  getStyle = () => {
    return {
      marginLeft: 0,
      transform: 'scale(1.1)'
    };
  }

  render() {
    let style = this.getStyle();
    
    return (
      <div className="cell-editor checkbox-editor">
        <div className="checkbox-editor-container">
          <input 
            ref={this.setInputRef}
            type="checkbox"
            className="checkbox"
            checked={this.state.value}
            onBlur={this.onBlur}
            onPaste={this.onPaste}
            onKeyDown={this.onKeyDown}
            onChange={this.onChange}
            style={style}
            readOnly={this.props.isReadOnly}
          />
        </div>
      </div>
    );
  }
}

CheckboxEditor.propTypes = propTypes;

export default CheckboxEditor;
