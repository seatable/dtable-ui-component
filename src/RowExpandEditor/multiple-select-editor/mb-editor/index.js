import React from 'react';
import PropTypes from 'prop-types';
import { getColumnOptions } from 'dtable-utils';
import MultipleSelectEditor from '../../../MultipleSelectEditor';
import SelectItem from '../../../SelectItem';
import { getLocale } from '../../../lang';
import RightAngle from '../../right-angle';
import ObjectUtils from '../../../utils/object-utils';
import { DELETED_OPTION_BACKGROUND_COLOR, DELETED_OPTION_TIPS } from '../../../constants';
import RowExpandAddBtn from '../../add-btn';

class RowExpandMBMultipleSelectEditor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: props.value || [],
      isShowEditor: false,
    };
    this.key = props.valueKey === 'name' ? 'name' : 'id';
    this.options = this.getOptions(props);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { value, column } = nextProps;
    if (value !== this.props.value || !ObjectUtils.isSameObject(column, this.props.column)) {
      this.options = this.getOptions(nextProps);
      this.setState({ value, isShowEditor: false });
    }
  }

  getOptions = (props) => {
    const { column } = props;
    return getColumnOptions(column);
  };

  toggleEditor = (value) => {
    this.setState({ showEditor: value });
  };

  openEditor = (event) => {
    event.stopPropagation();
    this.toggleEditor(true);
  };

  closeEditor = () => {
    this.toggleEditor(false);
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
    event && event.nativeEvent.stopImmediatePropagation();
    const optionKey = option[this.key];
    let newValue = this.state.value.slice(0);
    const optionKeyIndex = newValue.findIndex(o => o === optionKey);
    if (optionKeyIndex !== -1) {
      newValue.splice(optionKeyIndex, 1);
    }
    this.setState({ value: newValue });
    this.props.onCommit(newValue);
  };

  renderOptions = () => {
    const { value } = this.state;
    let displayOptions = [];
    if (Array.isArray(value)) {
      const selectedOptions = this.options.filter((option) => value.includes(option[this.key]));
      const selectedOptionIds = selectedOptions.map(option => option[this.key]);
      const invalidOptionIds = value.filter(optionId => !selectedOptionIds.includes(optionId));
      displayOptions = selectedOptions.map((option, optionIdx) => {
        return (<SelectItem option={option} key={optionIdx} isShowRemove onRemove={this.removeOption.bind(this, option)} />);
      }).concat(invalidOptionIds.map((optionId, index) => {
        const option = { name: getLocale(DELETED_OPTION_TIPS), color: DELETED_OPTION_BACKGROUND_COLOR };
        return (<SelectItem option={option} key={`deleted-${index}`} isShowRemove onRemove={this.removeOption.bind(this, { [this.key]: optionId })} />);
      }));
    }
    if (displayOptions.length === 0) return (<RowExpandAddBtn text={getLocale('Select_option(s)')} />);
    return (<div style={{ minHeight: 50, padding: '10px 0', display: 'flex', flexWrap: 'wrap' }}>{displayOptions}</div>);
  };

  render() {
    const { column, isSupportNewOption, onAddNewOption } = this.props;
    const { showEditor, value } = this.state;
    return (
      <>
        <div className="dtable-ui dtable-ui-mobile-row-expand-options-editor position-relative" onClick={this.openEditor}>
          {this.renderOptions()}
          <RightAngle />
        </div>
        {showEditor && (
          <MultipleSelectEditor
            value={value}
            column={column}
            valueKey={this.key}
            options={this.options}
            onCommit={this.onChange}
            onClose={this.closeEditor}
            isSupportNewOption={isSupportNewOption}
            onAddNewOption={onAddNewOption}
          />
        )}
      </>
    );
  }
}

RowExpandMBMultipleSelectEditor.propTypes = {
  column: PropTypes.object,
  value: PropTypes.array,
  valueKey: PropTypes.string,
  isSupportNewOption: PropTypes.bool,
  onAddNewOption: PropTypes.func,
  onCommit: PropTypes.func,
};

export default RowExpandMBMultipleSelectEditor;
