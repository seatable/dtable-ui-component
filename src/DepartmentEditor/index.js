import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DEPARTMENT_SELECT_RANGE_OPTIONS } from './constants';
import DepartmentSingleSelect from './department-single-select';
import { getLocale } from '../lang';

import './index.css';

const propTypes = {
  height: PropTypes.number,
  target: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  additionalComponents: PropTypes.object,
  column: PropTypes.object,
  onCommit: PropTypes.func,
  toggleDepartmentSelect: PropTypes.func,
};

class DepartmentSingleSelectEditor extends Component {

  constructor(props) {
    super(props);
    const { column, value, height } = props;
    const editorWidth = column.width > 300 ? column.width : 300;
    const data = column.data || {};
    this.state = {
      value: value || '',
      menuStyle: { width: editorWidth, top: height - 2 }
    };
    this.enableSelectRange = data.enable_select_range || false;
  }

  onCommit = (value) => {
    this.setState({ value }, () => {
      this.props.onCommit(value);
    });
  }

  createSpecificDepartments = () => {
    return DEPARTMENT_SELECT_RANGE_OPTIONS.slice(0, 2).map((option) => {
      const { type, name } = option;
      return {
        value: type,
        label: (<span className="text-truncate department-name">{getLocale(name)}</span>)
      };
    });
  }
  
  render() {
    const { column } = this.props;
    return (
      <DepartmentSingleSelect
        column={column}
        value={this.state.value}
        enableSelectRange={this.enableSelectRange}
        menuStyle={this.state.menuStyle}
        onCommit={this.onCommit}
      />
    );
  }
}

DepartmentSingleSelectEditor.propTypes = propTypes;

export default DepartmentSingleSelectEditor;
