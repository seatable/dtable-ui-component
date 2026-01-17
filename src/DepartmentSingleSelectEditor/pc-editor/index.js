import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DTablePopover from '../../DTablePopover';
import DepartmentSingleSelect from './department-single-select';

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

class PCDepartmentSingleSelectEditor extends Component {

  constructor(props) {
    super(props);
    const { column, isInModal, value, height } = props;
    const editorWidth = column.width > 300 ? column.width : 300;
    const data = column.data || {};
    this.state = {
      value: value || '',
      menuStyle: isInModal ? {} : { width: editorWidth, top: height - 2 }
    };
    this.enableSelectRange = data.enable_select_range || false;
    this.isRowExpand = isInModal;
  }

  componentDidMount() {
    if (this.isRowExpand) {
      let menuStyle = {};
      const { top, left } = this.outerRef.getBoundingClientRect();
      if (top > 330) {
        menuStyle.top = -200;
      }
      if (left > window.innerWidth - 300) {
        menuStyle.left = left - window.innerWidth;
      }
      this.setState({ menuStyle });
    }
  }

  onCommit = (value) => {
    const { onCommit } = this.props;
    this.setState({ value }, () => {
      this.isRowExpand ? onCommit(value) : onCommit();
    });
  };

  getValue = () => {
    const updated = {};
    updated[this.props.column.key] = this.state.value;
    return updated;
  };

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

PCDepartmentSingleSelectEditor.propTypes = propTypes;

export default PCDepartmentSingleSelectEditor;
