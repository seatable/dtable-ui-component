import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DTablePopover from '../DTablePopover';
import { DEPARTMENT_SELECT_RANGE_OPTIONS } from './constants';
import DepartmentSingleSelect from './department-single-select';
import { getLocale } from '../lang';

import './index.css';

const propTypes = {
  height: PropTypes.number,
  mode: PropTypes.string,
  target: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  additionalComponents: PropTypes.object,
  column: PropTypes.object,
  userDepartmentIdsMap: PropTypes.object,
  departments: PropTypes.array,
  onCommit: PropTypes.func,
  toggleDepartmentSelect: PropTypes.func,
};

class DepartmentSingleSelectEditor extends Component {

  constructor(props) {
    super(props);
    const { column, mode, value, height } = props;
    const editorWidth = column.width > 300 ? column.width : 300;
    const isRowExpand = mode === 'row_expand';
    const data = column.data || {};
    this.state = {
      value: value || '',
      menuStyle: isRowExpand ? {} : { width: editorWidth, top: height - 2 }
    };
    this.enableSelectRange = data.enable_select_range || false;
    this.isRowExpand = isRowExpand;
  }

  componentDidMount() {
    if (this.isRowExpand) {
      if (this.outerRef.getBoundingClientRect().top > 330) {
        const menuStyle = { top: -200 };
        this.setState({ menuStyle });
      }
    }
  }

  onCommit = (value) => {
    const { onCommit, column } = this.props;
    this.setState({ value }, () => {
      this.isRowExpand ? onCommit(this.getValue(), column) : onCommit();
    });
  }

  getValue = () => {
    const updated = {};
    updated[this.props.column.key] = this.state.value;
    return updated;
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
    const { target, column, userDepartmentIdsMap, departments } = this.props;

    const dom = (
      <DepartmentSingleSelect
        column={column}
        value={this.state.value}
        enableSelectRange={this.enableSelectRange}
        menuStyle={this.state.menuStyle}
        userDepartmentIdsMap={userDepartmentIdsMap}
        departments={departments}
        onCommit={this.onCommit}
      />
    );
    return (
      this.isRowExpand ?
        <div ref={ref => this.outerRef = ref}>
          <DTablePopover
            hideArrow
            popoverClassName="select-editor-popover"
            target={target}
            placement="bottom-start"
            hideDTablePopover={this.props.toggleDepartmentSelect}
            hideDTablePopoverWithEsc={this.props.toggleDepartmentSelect}
          >
            {dom}
          </DTablePopover>
        </div>
        : dom
    );
  }
}

DepartmentSingleSelectEditor.propTypes = propTypes;

export default DepartmentSingleSelectEditor;
