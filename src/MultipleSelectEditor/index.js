import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import { getLocale } from '../lang';
import EditEditorButton from '../EditEditorButton';
import { SelectEditorOption, PCSelectEditorPopover, MBSelectEditorPopover } from '../select-editor';

import './index.css';

const propTypes = {
  isReadOnly: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  column: PropTypes.object,
  onCommit: PropTypes.func,
  isSupportNewOption: PropTypes.bool,
  onAddNewOption: PropTypes.func,
};

class MultipleSelectEditor extends React.Component {

  static defaultProps = {
    isReadOnly: false,
    value: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      newValue: Array.isArray(props.value) ? props.value : [],
      isPopoverShow: false,
      popoverPosition: {},
    };

    let { column } = this.props;
    this.options = column.data && (column.data.options || [] );
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

  getFormattedOptions = () => {
    let { newValue } = this.state;
    if (Array.isArray(newValue) && newValue.length > 0) {
      return newValue.map(option_id => {
        return this.options.find(option => option.id === option_id);
      }).filter(option => !!option);
    }
    return [];
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

  onCommit = (newValue) => {
    let updated = {};
    let { column } = this.props;
    updated[column.key] = newValue;
    this.props.onCommit(updated);
  }

  onOptionItemToggle = (option) => {
    let newValue = this.state.newValue.slice();
    let optionIndex = newValue.findIndex(option_id => option_id === option.id);
    if (optionIndex !== -1) {
      newValue.splice(optionIndex, 1);
    } else {
      newValue.push(option.id);
    }

    this.setState({newValue}, () => {
      this.onCommit(newValue);
    });
  }

  onDeleteOption = (option) => {
    let newValue = this.state.newValue.slice();
    let optionIndex = newValue.findIndex(option_id => option_id === option.id);
    newValue.splice(optionIndex, 1);
    this.setState({newValue}, () => {
      this.onCommit(newValue);
    });
  }

  onAddNewOption = (optionName) => {
    this.props.onAddNewOption(optionName);
    this.onClosePopover();
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
    let { isPopoverShow, popoverPosition } = this.state;
    let options = this.options;
    let selectedOptions = this.getFormattedOptions();

    return (
      <div ref={this.setEditorContainerRef} className="cell-editor dtable-ui-multiple-select-editor">
        <div ref={this.setEditorRef} className="dtable-ui-select-editor-container" onClick={this.onAddOptionToggle}>
          {selectedOptions.length === 0 && <EditEditorButton text={getLocale('Add_an_option')} />}
          {selectedOptions.length !== 0 && (
            selectedOptions.map(option => {
              return <SelectEditorOption key={option.id} option={option} isShowRemoveIcon={true} onDeleteSelectOption={this.onDeleteOption}/>;
            })
          )}
        </div>
        {isPopoverShow && (
          <Fragment>
            <MediaQuery query="(min-width: 768px)">
              <PCSelectEditorPopover
                popoverPosition={popoverPosition}
                options={options}
                selectedOptions={selectedOptions}
                onOptionItemToggle={this.onOptionItemToggle}
                isSupportNewOption={this.props.isSupportNewOption}
                onAddNewOption={this.onAddNewOption}
              />
            </MediaQuery>
            <MediaQuery query="(max-width: 767.8px)">
              <MBSelectEditorPopover
                isReadOnly={this.props.isReadOnly}
                value={this.state.newValue}
                column={this.props.column}
                options={options}
                onOptionItemToggle={this.onOptionItemToggle}
                isShowRemoveIcon={true}
                isSupportNewOption={this.props.isSupportNewOption}
                onAddNewOption={this.onAddNewOption}
                onClosePopover={this.onClosePopover}
              />
            </MediaQuery>
          </Fragment>
        )}
      </div>
    );
  }
}

MultipleSelectEditor.propTypes = propTypes;

export default MultipleSelectEditor;
