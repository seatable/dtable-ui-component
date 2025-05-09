import React from 'react';
import PropTypes from 'prop-types';
import { getLocale } from '../../lang';

import './index.css';

const propTypes = {
  popoverPosition: PropTypes.object.isRequired,
  options: PropTypes.array.isRequired,
  selectedOptions: PropTypes.array.isRequired,
  onOptionItemToggle: PropTypes.func.isRequired,
};

class PCLinkEditorPopover extends React.Component {

  static defaultProps = {
    popoverPosition: {},
    options: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
    };
  }

  onValueChanged = (event) => {
    let value = event.target.value;
    this.setState({ searchValue: value });
  };

  onInputClick = (event) => {
    event.nativeEvent.stopImmediatePropagation();
    event.stopPropagation();
  };

  onOptionItemToggle = (item) => {
    this.props.onOptionItemToggle(item);
  };

  getFilterOptions = () => {
    let { options } = this.props;
    let filter = this.state.searchValue.toLowerCase();
    if (!filter) {
      return options;
    }
    return options.filter(option => {
      return (option.name.toString().toLowerCase()).indexOf(filter) > -1;
    });
  };

  render() {
    let options = this.getFilterOptions();
    let { popoverPosition, selectedOptions } = this.props;
    let { searchValue } = this.state;
    let popoverStyle = Object.assign({}, { ...popoverPosition }, { position: 'absolute' });
    return (
      <div className="dtable-ui-editor-container dtable-ui-link-editor-popover" style={popoverStyle}>
        <div className="link-options-search">
          <input className="form-control" value={searchValue} onChange={this.onValueChanged} onClick={this.onInputClick} placeholder={getLocale('Search_option')}></input>
        </div>
        <div className="link-options-container">
          {options.length > 0 && options.map((option, index) => {
            let isSelect = selectedOptions.some(selectedOption => {
              return selectedOption.id === option.id;
            });
            return (
              <div key={index} className="link-option-item" onClick={this.onOptionItemToggle.bind(this, option)}>
                <div className="option-info">
                  <div className="option-name" title={option.name}>{option.name}</div>
                </div>
                <div className="option-checked">
                  {isSelect && <i className="dtable-font dtable-icon-check-mark"></i>}
                </div>
              </div>
            );
          })}
          {options.length === 0 && (<div className="link-option-null">{getLocale('No_options_available')}</div>)}
        </div>
      </div>
    );
  }
}

PCLinkEditorPopover.propTypes = propTypes;

export default PCLinkEditorPopover;
