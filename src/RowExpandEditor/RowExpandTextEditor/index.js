import React from 'react';
import PropTypes from 'prop-types';
import { FormFeedback } from 'reactstrap';
import SimpleTextEditor from '../../TextEditor';
import { isEnableCheckFormat } from '../../utils/column-utils';
import { checkValueConformityFormat } from '../../utils/cell';
import { keyCodes } from '../../constants';
import { getLocale } from '../../lang';

import './index.css';

class RowExpandSimpleText extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      inconformityFormat: false,
    };

    // for format check
    this.checked = false;
    this.validValue = true;
    this.checkingField = null;
  }

  componentDidMount() {
    const { isEditorFocus } = this.props;
    if (isEditorFocus) {
      this.focusInput();
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { isEditorFocus } = nextProps;
    if (isEditorFocus && !this.props.isEditorFocus) {
      this.focusInput();
    } else if (!isEditorFocus && this.props.isEditorFocus) {
      this.blurInput();
    }
  }

  setEditorRef = (ref) => {
    // 'checkingField' is required if want to check current field
    if (this.props.isRequired && isEnableCheckFormat(this.props.column)) {
      this.checkingField = ref;
    }
  };

  focusInput = () => {
    // use setTimeout to make sure real DOM is rendered, avoiding flush updates when React is already rendering
    setTimeout(() => {
      this.editor && this.editor.focusInput();
    }, 1);
  };

  blurInput = () => {
    setTimeout(() => {
      this.editor && this.editor.blurInput();
    }, 1);
  };

  onCommit = () => {
    const { isRequired, column } = this.props;
    const value = this.editor.getValue();
    if (isRequired && isEnableCheckFormat(column)) {
      this.checked = true;
      this.checkField();
    }
    this.props.onCommit(value);
  };

  checkField = () => {
    const { column } = this.props;
    const text = this.editor.getValue();
    this.validValue = checkValueConformityFormat(column.data, text);
    this.setState({
      inconformityFormat: !this.validValue,
    });
    return this.validValue;
  };

  onKeyDown = (event) => {
    if (event.keyCode === keyCodes.Esc) {
      event.preventDefault();
      this.blurInput();
    }
  };

  isChecked = () => {
    return this.checked;
  };

  isValidValue = () => {
    return this.validValue;
  };

  onInputClick = () => {
    if (this.props.updateTabIndex) {
      this.props.updateTabIndex(this.props.columnIndex);
    }
  };

  render() {
    const { readOnly, column, value } = this.props;
    const { inconformityFormat } = this.state;

    return (
      <div className="dtable-ui-row-expand-simple-text-editor-container" ref={this.setEditorRef}>
        <SimpleTextEditor
          ref={ref => this.editor = ref}
          className={inconformityFormat ? 'is-invalid' : ''}
          readOnly={readOnly}
          column={column}
          value={value}
          onKeyDown={this.onKeyDown}
          onInputClick={this.onInputClick}
          onCommit={this.onCommit}
        />
        {inconformityFormat && (
          <FormFeedback>{getLocale.get('Input_does_not_meet_specifications')}</FormFeedback>
        )}
      </div>
    );
  }
}

RowExpandSimpleText.propTypes = {
  readOnly: PropTypes.bool,
  columnIndex: PropTypes.number,
  isEditorFocus: PropTypes.bool,
  isRequired: PropTypes.bool,
  column: PropTypes.object,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  updateTabIndex: PropTypes.func,
  onCommit: PropTypes.func.isRequired,
};

export default RowExpandSimpleText;
