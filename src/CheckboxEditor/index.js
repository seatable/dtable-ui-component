import React from 'react';
import PropTypes from 'prop-types';

import './index.css';

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
  };

  constructor(props) {
    super(props);
    this.state = {
      value: props.value ? props.value : false
    };
  }

  onCommit = () => {
    let updated = {};
    let { column } = this.props;
    updated[column.name] = this.state.value;
    this.props.onCommit(updated);
  };

  onChange = (event) => {
    if (this.props.isReadOnly) {
      return;
    }
    this.setState({ value: !this.state.value }, () => {
      this.onCommit();
    });
  };

  render() {
    const { value } = this.state;
    const { isReadOnly } = this.props;
    let style = {
      cursor: isReadOnly ? 'default' : 'pointer'
    };

    return (
      <div className="dtable-ui-checkbox-editor" style={style}>
        <input type="checkbox"
          className="raw-checkbox"
          checked={value}
          onChange={this.onChange}
        />
        <div className="shown-checkbox">
          {value && <span className="dtable-font dtable-icon-check-mark"></span>}
        </div>
      </div>
    );
  }
}

CheckboxEditor.propTypes = propTypes;

export default CheckboxEditor;
