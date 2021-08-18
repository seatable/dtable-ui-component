import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import { getLocale } from '../../lang';
import EditEditorButton from '../common/edit-editor-button';
import SelectEditorOption from '../common/select-editor-option';
import PCSelectEditorPopover from '../cell-editor-popover/pc-select-editor-popover';
import MBSingleSelectPopover from '../cell-editor-popover/mb-select-editor-popover'

const propTypes = {
  isReadOnly: PropTypes.bool,
  value: PropTypes.string,
  column: PropTypes.object,
  onCommit: PropTypes.func,
  isSupportNewOption: PropTypes.bool,
  onAddNewOption: PropTypes.func,
};

class SingleSelectEditor extends React.Component {

  static defaultProps = {
    isReadOnly: false,
    value: ''
  }

  constructor(props) {
    super(props);
    this.state = {
      newValue: props.value,
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

  formatOption = () => {
    let { newValue } = this.state;
    let option = this.options.find(option => option.id === newValue);
    return option;
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

    let newValue = this.state.newValue === option.id ? '' : option.id;

    this.setState({newValue}, () => {
      this.onCommit(newValue);
      this.onClosePopover();
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

  onAddNewOption = (optionName) => {
    this.props.onAddNewOption(optionName);
    this.onClosePopover();
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
    let option = this.formatOption();
    let options = this.options;
    let selectedOptions = option ? [option] : [];
    return (
      <div ref={this.setEditorContainerRef} className="cell-editor dtable-ui-single-select-editor">
        <div ref={this.setEditorRef} className="dtable-ui-select-editor-container" onClick={this.onAddOptionToggle}>
          {option ? <SelectEditorOption option={option} /> : <EditEditorButton text={getLocale('Add_an_option')} />}
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
              <MBSingleSelectPopover 
                isReadOnly={this.props.isReadOnly}
                value={[this.state.newValue]}
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

SingleSelectEditor.propTypes = propTypes;

export default SingleSelectEditor;
