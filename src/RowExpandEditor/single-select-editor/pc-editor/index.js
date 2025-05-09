import React from 'react';
import PropTypes from 'prop-types';
import { getColumnOptions } from 'dtable-utils';
import classnames from 'classnames';
import { KeyCodes, DELETED_OPTION_BACKGROUND_COLOR, DELETED_OPTION_TIPS } from '../../../constants';
import SingleSelectEditor from '../../../SingleSelectEditor';
import { getLocale } from '../../../lang';
import ObjectUtils from '../../../utils/object-utils';

import './index.css';

class RowExpandPCSingleSelectEditor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      isShowEditor: false,
    };
    this.key = props.valueKey === 'name' ? 'name' : 'id';
    this.options = this.getOptions(props);
    this.selectRef = null;
    this.outerRef = null;
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.hideDropDownMenu);
    document.addEventListener('keydown', this.onKeyDown);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { value, column } = nextProps;
    if (value !== this.props.value || !ObjectUtils.isSameObject(column, this.props.column)) {
      this.options = this.getOptions(nextProps);
      this.setState({ value, isShowEditor: false });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isShowEditor !== prevState.isShowEditor) {
      if (this.state.isShowEditor === true && this.props.onEditorOpen) {
        this.props.onEditorOpen();
      }
      if (this.state.isShowEditor === false && this.props.onEditorClose) {
        this.props.onEditorClose();
      }
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.hideDropDownMenu);
    document.removeEventListener('keydown', this.onKeyDown);
  }

  getOptions = (props) => {
    const { column, row, columns } = props;
    const options = getColumnOptions(column);
    const { data } = column;
    const { cascade_column_key, cascade_settings } = data || {};
    if (cascade_column_key && Array.isArray(columns)) {
      const cascadeColumn = columns.find(c => c.key === cascade_column_key);
      if (cascadeColumn) {
        const cascadeColumnValue = row[cascade_column_key];
        if (!cascadeColumnValue) return [];
        const cascadeSetting = cascade_settings[cascadeColumnValue];
        if (!cascadeSetting || !Array.isArray(cascadeSetting) || cascadeSetting.length === 0) return [];
        return options.filter(option => cascadeSetting.includes(option.id));
      }
    }
    return options;
  };

  onKeyDown = (e) => {
    if (e.keyCode === KeyCodes.Enter && this.props.isEditorFocus && !this.state.isShowEditor) {
      this.setState({ isShowEditor: true });
    }
  };

  toggleSingleSelect = (value) => {
    this.setState({ isShowEditor: value }, () => {
      if (value) return;
      // eslint-disable-next-line no-unused-expressions
      this.selectRef?.focus();
    });
  };

  closeEditor = () => {
    this.toggleSingleSelect(false);
  };

  hideDropDownMenu = (event) => {
    if (!event.target) return;
    if (!this.ref.contains(event.target) && this.state.isShowEditor) {
      const singleSelectEditor = document.getElementsByClassName('dtable-ui-select-editor-container')[0];
      if (singleSelectEditor && singleSelectEditor.contains(event.target)) return;
      this.toggleSingleSelect(false);
    }
  };

  onToggleSelect = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.updateTabIndex(this.props.columnIndex);
    if (this.props.readOnly) return;
    this.toggleSingleSelect(true);
  };

  onFocus = () => {
    this.props.updateTabIndex(this.props.columnIndex);
  };

  onChange = (option) => {
    let newValue = option[this.key];
    if (this.state.value === newValue) newValue = null;
    this.setState({ value: newValue });
    this.props.onCommit(newValue);
    this.toggleSingleSelect(false);
  };

  renderOption = () => {
    const { isEditorFocus, classNamePrefix, placeholder } = this.props;
    const { value } = this.state;
    const option = this.options.find(o => o[this.key] === value);
    const optionStyle = option ?
      { backgroundColor: option.color, color: option.textColor || null } :
      { backgroundColor: DELETED_OPTION_BACKGROUND_COLOR };
    const optionName = option ? option.name : getLocale(DELETED_OPTION_TIPS);

    return (
      <div
        tabIndex={0}
        onFocus={this.onFocus}
        onClick={this.onToggleSelect}
        ref={ref => this.selectRef = ref}
        className={classnames('dtable-ui dtable-ui-row-expand-select-editor custom-select', { 'focus': isEditorFocus, [`${classNamePrefix}-select-editor`]: classNamePrefix })}
      >
        <div className={classnames('dtable-ui-row-expand-select-editor-inner', { [`${classNamePrefix}-select-editor-inner`]: classNamePrefix })}>
          <div className={classnames('', { [`${classNamePrefix}-select-editor-inner-container`]: classNamePrefix })}>
            {value && (
              <div className="dtable-ui-select-option" style={optionStyle} title={optionName}>
                {optionName}
              </div>
            )}
            {!value && placeholder && (<>{placeholder}</>)}
          </div>
          <i aria-hidden="true" className="dtable-font dtable-icon-down3"></i>
        </div>
      </div>
    );
  };

  render() {
    const { isSupportNewOption, onAddNewOption, column, classNamePrefix } = this.props;
    const { isShowEditor, value } = this.state;
    return (
      <div className="position-relative w-100" ref={ref => this.ref = ref}>
        {this.renderOption()}
        <span ref={ref => this.targetRef = ref}></span>
        {isShowEditor && (
          <SingleSelectEditor
            isInModal={true}
            options={this.options}
            column={column}
            value={value}
            valueKey={this.key}
            target={this.targetRef}
            classNamePrefix={classNamePrefix}
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

RowExpandPCSingleSelectEditor.propTypes = {
  column: PropTypes.object,
  value: PropTypes.array,
  valueKey: PropTypes.string,
  isSupportNewOption: PropTypes.bool,
  onAddNewOption: PropTypes.func,
  isEditorFocus: PropTypes.bool,
  classNamePrefix: PropTypes.string,
  placeholder: PropTypes.any,
  columnIndex: PropTypes.number,
  updateTabIndex: PropTypes.func,
  onEditorOpen: PropTypes.func,
  onEditorClose: PropTypes.func,
  onCommit: PropTypes.func,
};

export default RowExpandPCSingleSelectEditor;
