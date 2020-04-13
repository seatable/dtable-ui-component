import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import { getLocale } from '../../lang';
import EditEdtiorButton from '../cell-editor-widgets/edit-editor-button';
import SelectEditorOption from '../cell-editor-widgets/select-editor-option';
import PCSelectEditorPopover from '../cell-editor-widgets/pc-select-editor-popover';
import MBSingleSelectPopover from '../cell-editor-widgets/mb-select-editor-popover'

import '../../assets/css/cell-editor.css';

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
    this.setState({isPopoverShow: false});
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
    let { newValue } = this.state;

    if (newValue === option.id) {
      return;
    }

    this.setState({newValue: option.id}, () => {
      this.onCommit(option.id);
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
  }

  onClosePopover = () => {
    this.setState({isPopoverShow: false});
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
      <div className="cell-editor single-select-editor">
        <div ref={this.setEditorRef} className="select-editor-container" onClick={this.onAddOptionToggle}>
          {option ? <SelectEditorOption option={option} /> : <EditEdtiorButton text={getLocale('Add_an_option')} />}
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
                  isSupportNewOption={this.props.isSupportNewOption}
                  onAddNewOption={this.onAddNewOption}
                  onClosePopover={this.onClosePopover}
                />
              </MediaQuery>
            </Fragment>
          )}
        </div>
      </div>
    );
  }
}

SingleSelectEditor.propTypes = propTypes;

export default SingleSelectEditor;
