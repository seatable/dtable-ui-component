import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import { getLocale } from '../../lang';
import * as CellTypes from '../../constants/cell-types';
import { getNumberDisplayString, getDateDisplayString } from '../../utils/value-format-utils';
import EditEditorButton from '../common/edit-editor-button';
import LinkEditorOption from '../common/link-editor-option';
import PCLinkEditorPopover from '../cell-editor-popover/pc-link-editor-popover';
import MBLinkEditorPopover from '../cell-editor-popover/mb-link-editor-popover';

const propTypes = {
  isReadOnly: PropTypes.bool,
  row: PropTypes.object.isRequired,
  column: PropTypes.object.isRequired,
  currentTableId: PropTypes.string.isRequired,
  linkMetaData: PropTypes.shape({
    getLinkedCellValue: PropTypes.func.isRequired,
    getLinkedTable: PropTypes.func.isRequired,
    getLinkedRows: PropTypes.func.isRequired,
    addLink: PropTypes.func.isRequired,
    removeLink: PropTypes.func.isRequired,
  }).isRequired,
};

class LinkEditor extends React.Component {

  static defaultProps = {
    isReadOnly: false,
  }

  constructor(props) {
    super(props);

    this.linkId = '';
    this.tableId = '';
    this.otherTableId = '';

    this.state = {
      newValue: this.getLinkedCellValue(),
      isPopoverShow: false,
      popoverPosition: {},
    };
  }

  componentDidMount() {
    document.addEventListener('click', this.onDocumentToggle);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onDocumentToggle);
  }

  onDocumentToggle = (e) => {
    if (this.editorContainer !== e.target && !this.editorContainer.contains(e.target)) {
      this.onClosePopover();
    }
  }

  getLinkedCellValue = () => {
    let { row, column, linkMetaData } = this.props;
    let { link_id, table_id, other_table_id } = column.data || {};
    this.linkId = link_id;
    this.tableId = table_id;
    this.otherTableId = other_table_id;

    return linkMetaData.getLinkedCellValue(this.linkId, this.tableId, this.otherTableId, row._id);
  }

  formatLinkedValuesToOptions = () => {
    let { column, linkMetaData } = this.props;
    let { newValue: rowIds } = this.state;
    if (rowIds && Array.isArray(rowIds) && rowIds.length > 0) {
      let linkedRows = linkMetaData.getLinkedRows(this.otherTableId, rowIds);
      let linkedTable = linkMetaData.getLinkedTable(this.otherTableId);
      return linkedRows.map(linkedRow => {
        let { display_column_key: displayColumnKey } = column.data;
        // format value to display
        let displayValue = this.getDisplayValue(linkedTable, linkedRow, displayColumnKey);
        return { id: linkedRow._id, name: displayValue};
      });
    }
    return [];
  }

  getDisplayValue = (linkedTable, linkedRow, displayColumnKey) => {
    let value = linkedRow[displayColumnKey];
    let linkedColumn = linkedTable.columns.find(column => column.key === displayColumnKey);
    let { type, data } = linkedColumn;
    switch(type) {
      case CellTypes.NUMBER: {
        return getNumberDisplayString(value, data);
      }
      case CellTypes.DATE: {
        let { format } = data;
        return getDateDisplayString(value, format);
      }
      default:
        return value;
    }
  }

  getAvailableLinkedOptions = () => {
    let { column, linkMetaData } = this.props;
    let { display_column_key: displayColumnKey } = column.data;
    let linkedTable = linkMetaData.getLinkedTable(this.otherTableId);
    
    let availableRows = linkedTable.rows.filter(row => {
      return !!row[displayColumnKey];
    });

    let availableOptions = availableRows.map(row => {
      let displayValue = this.getDisplayValue(linkedTable, row, displayColumnKey);
      return {
        id: row._id,
        name: displayValue
      };
    });
    return availableOptions;
  }

  onCommit = (newValue) => {
    // nothing todo
  }

  onAddOptionToggle = (event) => {
    event.nativeEvent.stopImmediatePropagation();
    event.stopPropagation();
    if (this.props.isReadOnly) {
      return;
    }
    let isPopoverShow = !this.state.isPopoverShow;
    if (isPopoverShow) {
      let popoverPosition = this.caculatePopoverPosition();
      this.setState({isPopoverShow, popoverPosition});
    } else {
      this.setState({isPopoverShow});
    }
  }

  onOptionItemToggle = (option) => {
    let { row, linkMetaData } = this.props;
    let newValue = this.state.newValue.slice();
    let optionIndex = newValue.findIndex(option_id => option_id === option.id);
    if (optionIndex !== -1) {
      newValue.splice(optionIndex, 1);
      linkMetaData.removeLink(this.linkId, this.tableId, this.otherTableId, row._id, option.id);
    } else {
      newValue.push(option.id);
      linkMetaData.addLink(this.linkId, this.tableId, this.otherTableId, row._id, option.id);
    }

    this.setState({newValue});
  }

  onDeleteOption = (option) => {
    let { row, linkMetaData } = this.props;
    let newValue = this.state.newValue.slice();
    let optionIndex = newValue.findIndex(option_id => option_id === option.id);
    newValue.splice(optionIndex, 1);
    this.setState({newValue}, () => {
      linkMetaData.removeLink(this.linkId, this.tableId, this.otherTableId, row._id, option.id);
    });
  }

  caculatePopoverPosition = () => {
    const POPOVER_MAX_HEIGHT = 200;
    let innerHeight = window.innerHeight;
    let { top, height } = this.editor.getClientRects()[0];
    let isBelow = (innerHeight - (top + height)) > POPOVER_MAX_HEIGHT;
    let position = { top : (height + 1), left: 0};
    if (!isBelow) {
      let bottom = height + 1;
      position = { bottom: bottom, left: 0 };
    }
    return position;
  }

  onClosePopover = () => {
    this.setState({isPopoverShow: false});
  }

  setEditorContainerRef = (editorContainer) => {
    this.editorContainer = editorContainer;
  }

  setEditorRef = (editor) => {
    this.editor = editor;
  }

  render() {
    let { isReadOnly } = this.props;
    let { isPopoverShow, popoverPosition } = this.state;
    let options = this.getAvailableLinkedOptions();
    let selectedOptions = this.formatLinkedValuesToOptions();
    let isShowRemoveIcon = !isReadOnly;

    return (
      <div ref={this.setEditorContainerRef} className="cell-editor dtable-ui-link-editor">
        <div ref={this.setEditorRef} className="dtable-ui-link-editor-container" onClick={this.onAddOptionToggle}>
        {selectedOptions.length === 0 && <EditEditorButton text={getLocale('Add_an_option')} />}
          {selectedOptions.length !== 0 && (
            selectedOptions.map(option => {
              return <LinkEditorOption key={option.id} option={option} isShowRemoveIcon={isShowRemoveIcon} onDeleteLinkOption={this.onDeleteOption}/>
            })
          )}
        </div>
        {isPopoverShow && (
          <Fragment>
            <MediaQuery query="(min-width: 768px)">
              <PCLinkEditorPopover 
                popoverPosition={popoverPosition}
                options={options}
                selectedOptions={selectedOptions}
                onOptionItemToggle={this.onOptionItemToggle}
              />
            </MediaQuery>
            <MediaQuery query="(max-width: 767.8px)">
              <MBLinkEditorPopover 
                isReadOnly={this.props.isReadOnly}
                value={this.state.newValue}
                column={this.props.column}
                options={options}
                onOptionItemToggle={this.onOptionItemToggle}
                onClosePopover={this.onClosePopover}
              />
            </MediaQuery>
          </Fragment>
          )}
      </div>
    );
  }
}

LinkEditor.propTypes = propTypes;

export default LinkEditor;
