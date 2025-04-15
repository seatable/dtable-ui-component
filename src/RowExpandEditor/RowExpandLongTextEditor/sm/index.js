import React from 'react';
import PropTypes from 'prop-types';
import { processor } from '@seafile/seafile-editor';
import { getLocale } from '../../../lang';
import RowExpandAddBtn from '../../RowExpandAddBtn';
import Editor from './editor';

import './index.css';

class Small extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      innerHtml: null,
      isShowEditor: false,
    };
  }

  componentDidMount() {
    this.convertMarkdown(this.props.value);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { column, row, valueKey } = nextProps;
    const { column: currentColumn, row: currentRow } = this.props;
    const value = row[column[valueKey]];
    const currentValue = currentRow[currentColumn[valueKey]];
    if (value !== currentValue && !this.editorRef?.current?.enableEdit) {
      this.convertMarkdown(value);
    }
  }

  convertMarkdown = (value) => {
    const newValue = value && typeof value === 'object' ? value.text : value;
    processor.process(newValue).then((result) => {
      const innerHtml = String(result).replace(/<a /ig, '<a target="_blank" ');
      this.setState({ innerHtml });
    });
  };

  onCommit = (value) => {
    this.convertMarkdown(value.text);
    this.props.onCommit(value);
  };

  openEditor = () => {
    this.setState({ isShowEditor: true });
  };

  closeEditor = () => {
    this.setState({ isShowEditor: false });
  };

  render() {
    const { column } = this.props;
    const { innerHtml, isShowEditor } = this.state;
    return (
      <>
        {innerHtml ? (
          <div
            className="mobile-dtable-ui-long-text-formatter article py-2"
            onClick={this.openEditor.bind(this)}
            dangerouslySetInnerHTML={{ __html: this.state.innerHtml }}
          >
          </div>
        ) : (
          <RowExpandAddBtn className="py-4" onClick={this.openEditor} text={getLocale('Edit_long_text')} />
        )}
        {isShowEditor && (
          <Editor onChange={this.onCommit} value={innerHtml} onToggle={this.closeEditor} title={column.name} />
        )}
      </>
    );
  }
}

Small.propTypes = {
  onCommit: PropTypes.func.isRequired,
  column: PropTypes.object.isRequired,
  row: PropTypes.object.isRequired,
  readOnly: PropTypes.bool,
};

export default Small;
