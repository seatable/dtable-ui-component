import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import CheckboxEditor from '../../../CheckboxEditor/sm';

import './index.css';

class Small extends React.Component {

  constructor(props) {
    super(props);
    this.editor = null;
  }

  onChangeCheckboxValue = () => {
    if (!this.editor) return;
    const newValue = this.editor.getValue();
    this.props.onCommit(newValue);
  };

  render() {
    const { column, value, className } = this.props;
    return (
      <div className={classnames('mobile-dtable-ui-row-expand-checkbox-editor-container', className)}>
        <CheckboxEditor
          ref={ref => this.editor = ref}
          className="dtable-ui-row-expand-checkbox-editor mt-0"
          column={column}
          value={value}
          onCommit={this.onChangeCheckboxValue}
        />
      </div>
    );
  }
}

Small.propTypes = {
  className: PropTypes.string,
  column: PropTypes.object.isRequired,
  row: PropTypes.object,
  onCommit: PropTypes.func.isRequired,
};

export default Small;
