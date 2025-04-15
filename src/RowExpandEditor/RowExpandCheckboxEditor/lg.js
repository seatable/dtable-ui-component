import React from 'react';
import PropTypes from 'prop-types';
import CheckboxEditor from '../../CheckboxEditor/lg';
import { ROW_EXPAND_FOCUS_STYLE } from '../../constants';

class Large extends React.Component {

  onChangeCheckboxValue = () => {
    const { columnIndex } = this.props;
    if (!this.editor) return;
    if (this.props.updateTabIndex) {
      this.props.updateTabIndex(columnIndex);
    }
    const newValue = this.editor.getValue();
    this.props.onCommit(newValue);
  };

  render() {
    const { isEditorFocus, column, value } = this.props;
    return (
      <CheckboxEditor
        ref={ref => this.editor = ref}
        className="dtable-ui-row-expand-checkbox-editor mt-2"
        column={column}
        value={value}
        style={isEditorFocus ? ROW_EXPAND_FOCUS_STYLE : {}}
        onCommit={this.onChangeCheckboxValue}
      />
    );
  }
}

Large.propTypes = {
  columnIndex: PropTypes.number,
  isEditorFocus: PropTypes.bool,
  column: PropTypes.object.isRequired,
  row: PropTypes.object,
  updateTabIndex: PropTypes.func,
  onCommit: PropTypes.func.isRequired,
};

export default Large;
