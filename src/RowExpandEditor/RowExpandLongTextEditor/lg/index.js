import React, { createRef, Suspense } from 'react';
import PropTypes from 'prop-types';
import { I18nextProvider } from 'react-i18next';
import { LongTextInlineEditor } from '@seafile/seafile-editor';
import toaster from '../../../toaster';
import Loading from '../../../Loading';
import { LONG_TEXT_EXCEED_LIMIT_MESSAGE } from '../../../constants';
import { isLongTextValueExceedLimit } from '../../../utils/cell';
import { getLocale, LANGUAGE } from '../../../lang';

import './index.css';

class Large extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      value: '',
    };
    this.editorRef = createRef();
  }

  componentDidMount() {
    this.convertMarkdown(this.props.value);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { column, row, isEditorFocus: nextIsEditorFocus, valueKey } = nextProps;
    const { column: currentColumn, row: currentRow, isEditorFocus } = this.props;
    const value = row[column[valueKey]];
    const currentValue = currentRow[currentColumn[valueKey]];
    if (value !== currentValue && !this.editorRef?.current?.enableEdit) {
      this.setState({ isLoading: true }, () => {
        this.convertMarkdown(value);
      });
    }

    if (isEditorFocus && !nextIsEditorFocus) {
      this.closeEditor();
    }

    if (!isEditorFocus && nextIsEditorFocus) {
      this.openEditor();
    }
  }

  convertMarkdown = (value) => {
    const newValue = value && typeof value === 'object' ? value.text : value;
    this.setState({ value: newValue, isLoading: false });
  };

  onSaveEditorValue = (value) => {
    if (isLongTextValueExceedLimit(value)) {
      toaster.closeAll();
      toaster.danger(getLocale(LONG_TEXT_EXCEED_LIMIT_MESSAGE), { duration: null });
      return;
    }
    this.onCommit(value);
    this.isLongTextValueChanged = false;
  };

  onCommit = (value) => {
    this.props.onCommit(value);
  };

  openEditor = () => {
    this.editorRef.current.openEditor();
  };

  closeEditor = () => {
    this.editorRef.current.closeEditor();
  };

  onClick = () => {
    const { columnIndex } = this.props;
    this.props.updateTabIndex && this.props.updateTabIndex(columnIndex);
  };

  render() {
    const { column, longTextEditorAPI, longTextEditorI18n } = this.props;
    const { isLoading, value } = this.state;
    if (isLoading) return null;

    return (
      <Suspense fallback={<div className="d-center-middle"><Loading /></div>}>
        <I18nextProvider i18n={longTextEditorI18n}>
          <LongTextInlineEditor
            ref={this.editorRef}
            lang={LANGUAGE}
            headerName={column.name}
            value={value || ''}
            autoSave={true}
            saveDelay={20 * 1000}
            isCheckBrowser={true}
            onClick={this.onClick}
            editorApi={longTextEditorAPI}
            onSaveEditorValue={this.onSaveEditorValue}
          />
        </I18nextProvider>
      </Suspense>
    );
  }
}

Large.propTypes = {
  onCommit: PropTypes.func,
  column: PropTypes.object,
  row: PropTypes.object,
  isEditorFocus: PropTypes.bool,
  columnIndex: PropTypes.number,
  updateTabIndex: PropTypes.func,
};

export default Large;
