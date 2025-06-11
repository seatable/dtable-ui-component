import React from 'react';
import PropTypes from 'prop-types';
import { getColumnOptions } from 'dtable-utils';
import SingleSelectEditor from '../../../SingleSelectEditor';
import SelectItem from '../../../SelectItem';
import { getLocale } from '../../../lang';
import RightAngle from '../../right-angle';
import ObjectUtils from '../../../utils/object-utils';
import { DELETED_OPTION_BACKGROUND_COLOR, DELETED_OPTION_TIPS } from '../../../constants';
import RowExpandAddBtn from '../../add-btn';

import './index.css';

class RowExpandMBSingleSelectEditor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
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
    let newValue = option[this.key];
    if (this.state.value === newValue) {
      newValue = null;
    }
    this.setState({ value: newValue });
    this.props.onCommit(newValue);
    this.toggleEditor(false);
  };

  renderOption = () => {
    const { value } = this.state;
    let option = this.options.find(o => o[this.key] === value);
    option = {
      name: getLocale(DELETED_OPTION_TIPS),
      color: DELETED_OPTION_BACKGROUND_COLOR,
      ...option,
    };

    return (
      <>
        {value ? (
          <div style={{ height: 50, padding: '10px 0', }}><SelectItem option={option} /></div>
        ) : (<RowExpandAddBtn text={getLocale('Select_an_option')} />)}
      </>
    );
  };

  render() {
    const { column, isSupportNewOption, onAddNewOption } = this.props;
    const { showEditor, value } = this.state;
    return (
      <>
        <div className="dtable-ui dtable-ui-mobile-row-expand-options-editor position-relative" onClick={this.openEditor}>
          {this.renderOption()}
          <RightAngle />
        </div>
        {showEditor && (
          <SingleSelectEditor
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

RowExpandMBSingleSelectEditor.propTypes = {
  column: PropTypes.object,
  value: PropTypes.array,
  valueKey: PropTypes.string,
  isSupportNewOption: PropTypes.bool,
  onAddNewOption: PropTypes.func,
  onCommit: PropTypes.func,
};

export default RowExpandMBSingleSelectEditor;
