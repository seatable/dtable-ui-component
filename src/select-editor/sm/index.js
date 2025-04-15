import React from 'react';
import PropTypes from 'prop-types';
import { getLocale } from '../../lang';
import SelectItem from '../../SelectItem';
import MobileSelectorEditor from '../../MobileSelectorEditor';
import DTableCommonAddTool from '../../DTableCommonAddTool';

import './index.css';

const { Search, Option, Options, Empty } = MobileSelectorEditor;

class Small extends React.Component {


  static defaultProps = {
    isShowRemoveIcon: false,
    isSupportNewOption: false,
    value: [],
    valueKey: 'id',
  };

  constructor(props) {
    super(props);
    this.state = {
      searchVal: '',
    };
  }

  onChangeSearch = (newValue) => {
    const { searchVal } = this.state;
    if (searchVal === newValue) return;
    this.setState({ searchVal: newValue });
  };

  getDisplayOptions = () => {
    const { options } = this.props;
    const { searchVal } = this.state;
    return searchVal ? options.filter((item) => item.name.indexOf(searchVal) > -1) : options;
  };

  onChange = (option) => {
    this.props.onCommit(option);
  };

  onAddNewOption = (event) => {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    const name = this.state.searchValue.trim();
    if (name) {
      this.props.onAddNewOption(name);
      this.props.onClose && this.props.onClose();
    }
  };

  renderOptions = (options) => {
    const { value = [], valueKey } = this.props;
    return options.map(option => {
      const isSelected = value.includes(option[valueKey]);

      return (
        <Option key={option[valueKey]} isSelected={isSelected} onChange={this.onChange.bind(this, option)}>
          <SelectItem option={option} />
        </Option>
      );
    });
  };

  render() {
    const { column, isSupportNewOption, options, onAddNewOption } = this.props;
    const { searchVal } = this.state;
    const displayOptions = this.getDisplayOptions();
    const isShowCreateBtn = isSupportNewOption && onAddNewOption && !!searchVal && !options.find((item) => item.name !== searchVal);

    return (
      <MobileSelectorEditor onClose={this.props.onClose} title={column.name} className="mobile-dtable-ui-select-editor" >
        {options.length > 10 && (
          <Search value={searchVal} placeholder={getLocale('Search_option')} onChange={this.onChangeSearch} />
        )}
        <Options>
          {displayOptions.length === 0 && (<Empty>{getLocale('No_options_available')}</Empty>)}
          {displayOptions.length > 0 && this.renderOptions(displayOptions)}
          {isShowCreateBtn && (<DTableCommonAddTool footerName={getLocale('Add_option')} callBack={this.onAddNewOption} />)}
        </Options>
      </MobileSelectorEditor>
    );
  }
}

Small.propTypes = {
  value: PropTypes.array.isRequired,
  column: PropTypes.object.isRequired,
  options: PropTypes.array.isRequired,
  onCommit: PropTypes.func,
  onClose: PropTypes.func,
  isSupportNewOption: PropTypes.bool,
  onAddNewOption: PropTypes.func,
};

export default Small;
