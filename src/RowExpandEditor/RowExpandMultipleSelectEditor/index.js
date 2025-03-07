import React from 'react';
import { getColumnOptions } from 'dtable-utils';
import classnames from 'classnames';
import { KeyCodes, DELETED_OPTION_BACKGROUND_COLOR, DELETED_OPTION_TIPS } from '../../constants';
import MultipleSelectEditor from '../../MultipleSelectEditor';
import { getLocale } from '../../lang';

import './index.css';

class RowExpandMultipleSelectEditor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: props.value || [],
      showSelectPopover: false,
    };
    this.key = props.valueKey === 'name' ? 'name' : 'id';
    this.options = this.getOptions(props);
    this.selectRef = null;
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.hideDropDownMenu);
    document.addEventListener('keydown', this.onKeyDown);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { value } = nextProps;
    if (value !== this.props.value) {
      this.options = this.getOptions(nextProps);
      this.setState({ value });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.showSelectPopover !== prevState.showSelectPopover) {
      if (this.state.showSelectPopover === true && this.props.onEditorOpen) {
        this.props.onEditorOpen();
      }
      if (this.state.showSelectPopover === false && this.props.onEditorClose) {
        this.props.onEditorClose();
      }
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.hideDropDownMenu);
    document.removeEventListener('keydown', this.onKeyDown);
  }

  getOptions = (props) => {
    const { column } = props;
    return getColumnOptions(column);
  };

  onKeyDown = (e) => {
    if (e.keyCode === KeyCodes.Enter && this.props.isEditorFocus && !this.state.showSelectPopover) {
      this.setState({ showSelectPopover: true });
    }
  };

  toggleSingleSelect = (value) => {
    this.setState({ showSelectPopover: value }, () => {
      if (value) return;
      // eslint-disable-next-line no-unused-expressions
      this.selectRef?.focus();
    });
  };

  hideDropDownMenu = (event) => {
    if (!event.target || event.target.tagName.toUpperCase() === 'INPUT') return;
    if (!this.ref.contains(event.target) && this.state.showSelectPopover) {
      const singleSelectEditor = document.getElementsByClassName('dtable-ui-select-editor-container')[0];
      if (singleSelectEditor && singleSelectEditor.contains(event.target)) return;
      this.toggleSingleSelect(false);
    }
  };

  onToggleSelect = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.updateTabIndex(this.props.columnIndex);
    this.toggleSingleSelect(true);
  };

  closeEditor = () => {
    this.toggleSingleSelect(false);
  };

  onFocus = () => {
    this.props.updateTabIndex(this.props.columnIndex);
  };

  onChange = (option) => {
    const optionKey = option[this.key];
    let newValue = this.state.value.slice(0);
    const optionKeyIndex = newValue.findIndex(o => o === optionKey);
    if (optionKeyIndex === -1) {
      newValue.push(optionKey);
    } else {
      newValue.splice(optionKeyIndex, 1);
    }
    this.setState({ value: newValue });
    this.props.onCommit(newValue);
  };

  removeOption = (option, event) => {
    event.stopPropagation();
    this.onChange(option);
  };

  getMultipleSelectList = () => {
    const { value } = this.state;
    if (!Array.isArray(value)) return [];
    const selectedOptions = this.options.filter((option) => value.includes(option[this.key]));
    const selectedOptionIds = selectedOptions.map(option => option[this.key]);
    const invalidOptionIds = value.filter(optionId => !selectedOptionIds.includes(optionId));
    return selectedOptions.map((option, optionIdx) => {
      let textColor = option.textColor || null;
      return (
        <div className="dtable-ui-select-option dtable-ui-multiple-select-option" style={{ backgroundColor: option.color, color: textColor }} title={option.name} key={optionIdx}>
          <span className="dtable-ui-select-option-name">{option.name}</span>
          <div className="dtable-ui-select-option-remove">
            <span className="remove-icon" onClick={this.removeOption.bind(this, option)} aria-label={getLocale('Delete')}>
              <i className="dtable-font dtable-icon-fork-number" style={{ color: textColor === '#FFFFFF' ? textColor : null }} aria-hidden="true"></i>
            </span>
          </div>
        </div>
      );
    }).concat(invalidOptionIds.map((optionId, index) => {
      return (
        <div
          className="dtable-ui-select-option dtable-ui-multiple-select-option"
          style={{ backgroundColor: DELETED_OPTION_BACKGROUND_COLOR }}
          title={getLocale(DELETED_OPTION_TIPS)}
          key={`deleted-multiple-select-${index}`}
        >
          <span className="dtable-ui-select-option-name">{getLocale(DELETED_OPTION_TIPS)}</span>
          <div className="dtable-ui-select-option-remove">
            <span className="remove-icon" onClick={this.removeOption.bind(this, { id: optionId })} aria-label={getLocale('Delete')}>
              <i className="dtable-font dtable-icon-fork-number" aria-hidden="true"></i>
            </span>
          </div>
        </div>
      );
    }));
  };

  renderOptions = () => {
    const { isEditorFocus } = this.props;
    const options = this.getMultipleSelectList();

    return (
      <div
        tabIndex={0}
        onFocus={this.onFocus}
        onClick={this.onToggleSelect}
        ref={ref => this.multipleSelectOptionsRef = ref}
        className={classnames('dtable-ui dtable-ui-row-expand-select-editor custom-select', { 'focus': isEditorFocus })}
      >
        <div className="dtable-ui-row-expand-select-editor-inner">
          <div>
            {options.length > 0 &&
              <div className="dtable-ui-row-expand-select-options">
                {options}
              </div>
            }
          </div>
          <i aria-hidden="true" className="dtable-font dtable-icon-down3"></i>
        </div>
      </div>
    );
  };

  render() {
    const { column, isSupportNewOption, onAddNewOption } = this.props;
    const { showSelectPopover, value } = this.state;
    return (
      <div className="position-relative w-100" ref={ref => this.ref = ref}>
        {this.renderOptions()}
        <span ref={ref => this.targetRef = ref}></span>
        {showSelectPopover && (
          <MultipleSelectEditor
            isInModal={true}
            options={this.options}
            column={column}
            value={value}
            valueKey={this.key}
            target={this.targetRef}
            onCommit={this.onChange}
            isSupportNewOption={isSupportNewOption}
            onAddNewOption={onAddNewOption}
            onClose={this.closeEditor}
          />
        )}
      </div>
    );
  }

}

export default RowExpandMultipleSelectEditor;
