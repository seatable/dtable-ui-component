import React from 'react';
import PropTypes from 'prop-types';
import CheckboxEditor from '../../CheckboxEditor';
import { ROW_EXPAND_FOCUS_STYLE } from '../../constants';

class RowExpandPCCheckboxEditor extends React.Component {

  onCommit = (newValue) => {
    const { columnIndex, updateTabIndex, onCommit } = this.props;
    updateTabIndex && updateTabIndex(columnIndex);
    onCommit && onCommit(newValue);
  };

  render() {
    const { isEditorFocus, column, value } = this.props;
    return (
      <CheckboxEditor
        className="dtable-ui-row-expand-checkbox-editor mt-2"
        column={column}
        value={value}
        style={isEditorFocus ? ROW_EXPAND_FOCUS_STYLE : {}}
        onCommit={this.onCommit}
      />
    );
  }
}

RowExpandPCCheckboxEditor.propTypes = {
  columnIndex: PropTypes.number,
  isEditorFocus: PropTypes.bool,
  column: PropTypes.object.isRequired,
  row: PropTypes.object,
  updateTabIndex: PropTypes.func,
  onCommit: PropTypes.func.isRequired,
};

export default RowExpandPCCheckboxEditor;
