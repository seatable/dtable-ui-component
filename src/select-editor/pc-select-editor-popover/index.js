import React from 'react';
import PropTypes from 'prop-types';
import { getLocale } from '../../lang';

import './index.css';

const propTypes = {
  popoverPosition: PropTypes.object.isRequired,
  options: PropTypes.array.isRequired,
  selectedOptions: PropTypes.array.isRequired,
  onOptionItemToggle: PropTypes.func.isRequired,
  isSupportNewOption: PropTypes.bool,
  onAddNewOption: PropTypes.func,
};

class PCSelectEditorPopover extends React.Component {

  static defaultProps = {
    popoverPosition: {},
    options: [],
    isShowAddBtn: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
    };
  }

  onValueChanged = (event) => {
    let value = event.target.value;
    this.setState({searchValue: value});
  }

  onInputClick = (event) => {
    event.nativeEvent.stopImmediatePropagation();
    event.stopPropagation();
  }

  onAddNewOption = () => {
    let name = this.state.searchValue.trim();
    this.props.onAddNewOption(name);
  }

  onOptionItemToggle = (item) => {
    this.props.onOptionItemToggle(item);
  }

  getFilterOptions = () => {
    let { options } = this.props;
    let filter = this.state.searchValue.toLowerCase();
    if (!filter) {
      return options;
    }
    return options.filter(option => {
      return (option.name.toString().toLowerCase()).indexOf(filter) > -1;
    });
  }

  getOptionStyle = (option) => {
    const textColor = option.textColor || null;
    return {
      display: 'inline-block',
      padding: '0px 10px',
      height: '20px',
      lineHeight: '20px',
      borderRadius: '10px',
      fontSize: '13px',
      backgroundColor: option.color,
      color: textColor,
    };
  }

  render() {
    let options = this.getFilterOptions();
    let { popoverPosition, selectedOptions, isSupportNewOption } = this.props;
    let { searchValue } = this.state;
    let popoverStyle = Object.assign({}, {...popoverPosition}, {position: 'absolute'});
    return (
      <div className="dtable-ui-editor-popover dtable-ui-select-editor-popover" style={popoverStyle}>
        <div className="select-options-search">
          <input className="form-control" onChange={this.onValueChanged} onClick={this.onInputClick} placeholder={getLocale('Find_an_option')}></input>
        </div>
        <div className="select-options-container">
          {options.length > 0 && options.map((option, index) => {
            let optionStyle = this.getOptionStyle(option);
            let isSelect = selectedOptions.some(selectedOption => {
              return selectedOption.id === option.id;
            });
            return (
              <div key={index} className="select-option-item" onClick={this.onOptionItemToggle.bind(this, option)}>
                <div className="option-info">
                  <div className="option-name" style={optionStyle} title={option.name}>{option.name}</div>
                </div>
                <div className="option-checked">
                  {isSelect && <i className="dtable-font dtable-icon-check-mark"></i>}
                </div>
              </div>
            );
          })}
          {options.length === 0 && (<div className="search-option-null">{getLocale('No_options_available')}</div>)}
        </div>
        {(isSupportNewOption && !!searchValue) && (
          <div className="select-options-add" onClick={this.onAddNewOption}>
            <i className="dtable-font dtable-icon-add-table"></i>
            <span>{getLocale('Add_an_option')}{' '}{searchValue}</span>
          </div>
        )}
      </div>
    );
  }
}

PCSelectEditorPopover.propTypes = propTypes;

export default PCSelectEditorPopover;
