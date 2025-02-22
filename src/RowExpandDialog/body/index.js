import React from 'react';
import PropTypes from 'prop-types';
import { ModalBody } from 'reactstrap';
import classnames from 'classnames';
import { CellType } from 'dtable-utils';
import { keyCodes } from '../../constants';
import { getFormulaArrayValue, isArrayFormatColumn, downloadFile, isFunction } from '../../utils/utils';
import ColumnContent from '../column-content';
import RowExpandEditor from '../../RowExpandEditor';
import RowExpandFormatter from '../../RowExpandFormatter';

import './index.css';

class Body extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0,
    };
    this.fieldEditorOpen = false;
    this.focusDom = React.createRef();
    this.editors = [];
    this.contentRef = null;
  }

  componentDidMount() {
    window.addEventListener('keydown', this.onHotKey);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.tabIndex !== this.state.tabIndex) {
      this.scrollToFocus();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onHotKey);
  }

  setEditorRef = columnIndex => editor => {
    this.editors[columnIndex] = editor;
  };

  onPressUpKey = () => {
    const currentTop = this.getScrollTop();
    if (currentTop === 0) return;
    this.setScrollTop(currentTop - 20);
  };

  onPressDownKey = () => {
    this.setScrollTop(this.getScrollTop() + 20);
  };

  scrollToFocus = () => {
    if (!this.focusDom || !this.focusDom.current) {
      return;
    }
    const content_scroll_top = this.getScrollTop();
    const focus_offset_top = this.focusDom.current.offsetTop;
    const focus_offset_height = this.focusDom.current.clientHeight;
    if (focus_offset_top < content_scroll_top) {
      this.setScrollTop(focus_offset_top - focus_offset_height);
      return;
    }
    if (focus_offset_top > content_scroll_top + this.contentRef.clientHeight) {
      this.setScrollTop(focus_offset_top - this.contentRef.clientHeight / 2);
      return;
    }
  };

  setScrollTop = (scrollTop) => {
    if (this.contentRef) {
      this.contentRef.scrollTop = scrollTop;
    }
  };

  getScrollTop = () => {
    return this.contentRef ? this.contentRef.scrollTop : 0;
  };

  onEditorOpen = () => {
    this.fieldEditorOpen = true;
  };

  onEditorClose = () => {
    this.fieldEditorOpen = false;
  };

  onHotKey = (event) => {
    const { columns, onKeyDown } = this.props;
    const readonly = Array.isArray(columns) && columns.length > 0 ? !columns.some(c => c.editable) : true;
    const keyCode = event.keyCode;
    // When opening field editor, all shortcuts in row expand dialog do not work
    if (this.fieldEditorOpen === true) {
      return;
    }

    if (keyCode === keyCodes.Esc) {
      this.props.onRowExpandCancel();
      return;
    }

    onKeyDown && onKeyDown(event);

    if (keyCode === keyCodes.UpArrow) {
      this.onPressUpKey();
      return;
    }

    if (keyCode === keyCodes.DownArrow) {
      this.onPressDownKey();
      return;
    }

    if (keyCode === keyCodes.Tab && !readonly) {
      this.onPressTab(event);
      return;
    }
  };

  onPressTab = (event) => {
    event.stopPropagation();
    event.preventDefault();
    const { columns } = this.props;
    let tabIndex = this.state.tabIndex;
    // Press tab, highlight next column;
    if (event.shiftKey) {
      tabIndex = tabIndex - 1;
      while (columns[tabIndex] && !columns[tabIndex].editable) {
        tabIndex--;
      }
    } else {
      // Press shift + tab, highlight preview column
      tabIndex = tabIndex + 1;
      while (columns[tabIndex] && !columns[tabIndex].editable) {
        tabIndex++;
      }
    }
    this.updateTabIndex(tabIndex);
  };

  updateTabIndex = (tabIndex) => {
    if (tabIndex >= this.props.columns.length) {
      tabIndex = 0;
    }
    if (tabIndex !== this.state.tabIndex) {
      this.setState({ tabIndex });
    }
  };

  downloadImage = (imageItemUrl) => {
    this.props.getDownLoadFiles([{ url: imageItemUrl }]).then(res => {
      const [downloadUrl] = res.data.urls;
      downloadFile(downloadUrl);
    }).catch(error => {
      // todo
    });
  };

  getCellValue = ({ row, column }) => {
    if (!row || !column) return null;
    const { valueKey } = this.props;
    return row[column[valueKey]];
  };

  renderColumnValue = (row, column, columnIndex, isEditorFocus) => {
    const { component, onChange, ...props } = this.props;
    const { getDownLoadFiles } = props;
    const { editable } = column;
    const { editor, formatter } = component || {};
    if (editable) {
      return (
        <RowExpandEditor
          { ...props }
          column={column}
          row={row}
          component={editor}
          isEditorFocus={isEditorFocus}
          columnIndex={columnIndex}
          isInModal={true}
          updateTabIndex={this.updateTabIndex}
          onCommit={(value) => onChange(column, value)}
          onEditorOpen={this.onEditorOpen}
          onEditorClose={this.onEditorClose}
        />
      );
    }
    return (
      <RowExpandFormatter
        { ...props }
        column={column}
        row={row}
        component={formatter}
        downloadImage={getDownLoadFiles ? this.downloadImage : null}
      />
    );
  };

  renderColumnContent = (row, column, columnIndex) => {
    const isEditorFocus = columnIndex === this.state.tabIndex && column.editable;
    return (
      <div ref={isEditorFocus ? this.focusDom : null}>
        <ColumnContent column={column}>
          {this.renderColumnValue(row, column, columnIndex, isEditorFocus)}
        </ColumnContent>
      </div>
    );
  };

  renderChildren = () => {
    const { columns, row, children } = this.props;
    const props = { columns, row };
    const CustomChildren = children;
    if (React.isValidElement(CustomChildren)) return React.cloneElement(CustomChildren, props);
    if (isFunction(CustomChildren)) return (<CustomChildren { ...props } />);
    return children;
  };

  render() {
    const { columns, row, placeholder } = this.props;
    return (
      <ModalBody className="dtable-ui-row-expand-body">
        <div className="dtable-ui-row-expand-body-content" ref={ref => this.contentRef = ref}>
          {columns.length === 0 && placeholder && (<>{placeholder}</>)}
          {columns.map((column, index) => {
            const { type, data } = column;
            let isHasMore = false;
            if (type === CellType.LINK_FORMULA) {
              let { array_type } = data || {};
              const value = this.getCellValue({ row, column });
              const cellValue = getFormulaArrayValue(value, !isArrayFormatColumn(array_type));
              if (cellValue.length >= 10) {
                isHasMore = true;
              }
            }
            return (
              <div className={classnames('dtable-ui-row-expand-item', { 'is-has-more': isHasMore })} key={column.key}>
                {this.renderColumnContent(row, column, index)}
              </div>
            );
          })}
        </div>
        {this.renderChildren()}
      </ModalBody>
    );
  }
}

Body.propTypes = {
  columns: PropTypes.array,
  row: PropTypes.object,
  placeholder: PropTypes.any,
  onChange: PropTypes.func,
};

export default Body;
