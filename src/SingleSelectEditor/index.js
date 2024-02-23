import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import { getLocale } from '../lang';
import EditEditorButton from '../EditEditorButton';
import { SelectEditorOption, PCSelectEditorPopover, MBSelectEditorPopover } from '../select-editor';

import './index.css';

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
  };

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
    document.addEventListener('mousedown', this.onMouseDown);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.onMouseDown);
  }

  onMouseDown = (e) => {
    if (this.editorContainer !== e.target && !this.editorContainer.contains(e.target)) {
      this.onClosePopover();
    }
  };

  formatOption = () => {
    let { newValue } = this.state;
    let option = this.options.find(option => option.name === newValue);
    return option;
  };

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
  };

  onCommit = (newValue) => {
    let updated = {};
    let { column } = this.props;
    updated[column.name] = newValue;
    this.props.onCommit(updated);
  };

  onOptionItemToggle = (option) => {

    let newValue = this.state.newValue === option.name ? '' : option.name;

    this.setState({newValue}, () => {
      this.onCommit(newValue);
      this.onClosePopover();
    });
  };

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
  };

  onAddNewOption = (optionName) => {
    this.props.onAddNewOption(optionName);
    this.onClosePopover();
  };

  onClosePopover = () => {
    this.setState({isPopoverShow: false});
  };

  setEditorContainerRef = (editorContainer) => {
    this.editorContainer = editorContainer;
  };

  setEditorRef = (editor) => {
    this.editor = editor;
  };

  render() {
    let { isPopoverShow, popoverPosition } = this.state;
    let option = this.formatOption();
    let options = this.options;
    let selectedOptions = option ? [option] : [];
    return (
      <div ref={this.setEditorContainerRef} className="dtable-ui-single-select-editor">
        <div
          ref={this.setEditorRef}
          className={option ? '' : 'd-inline-block'}
          onClick={this.onAddOptionToggle}
        >
          {option ? (
            <div className="dtable-ui-single-select-option-container">
              <SelectEditorOption option={option} />
            </div>
          ) : <EditEditorButton text={getLocale('Add_an_option')} />}
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
