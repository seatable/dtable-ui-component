import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import CheckboxEditor from '../../../CheckboxEditor';

import './index.css';

class RowExpandMBCheckboxEditor extends React.Component {

  constructor(props) {
    super(props);
    this.editor = null;
  }

  onCommit = (newValue) => {
    this.props.onCommit && this.props.onCommit(newValue);
  };

  render() {
    const { column, value, className } = this.props;
    return (
      <div className={classnames('dtable-ui-mobile-row-expand-checkbox-editor-container', className)}>
        <CheckboxEditor
          className="dtable-ui-row-expand-checkbox-editor mt-0"
          column={column}
          value={value}
          onCommit={this.onCommit}
        />
      </div>
    );
  }
}

RowExpandMBCheckboxEditor.propTypes = {
  className: PropTypes.string,
  column: PropTypes.object.isRequired,
  row: PropTypes.object,
  onCommit: PropTypes.func.isRequired,
};

export default RowExpandMBCheckboxEditor;
