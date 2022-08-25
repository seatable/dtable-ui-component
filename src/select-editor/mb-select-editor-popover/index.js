import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { getLocale } from '../../lang';
import SelectEditorOption from '../select-editor-option';
import MBEditorHeader from '../../MBEditorHeader';

import './index.css';

const propTypes = {
  isReadOnly: PropTypes.bool,
  isShowRemoveIcon: PropTypes.bool,
  value: PropTypes.array.isRequired,
  column: PropTypes.object.isRequired,
  options: PropTypes.array.isRequired,
  onOptionItemToggle: PropTypes.func,
  onClosePopover: PropTypes.func,
  isSupportNewOption: PropTypes.bool,
  onAddNewOption: PropTypes.func,
};

class MBSelectEditorPopover extends React.Component {


  static defaultProps = {
    isReadOnly: false,
    isShowRemoveIcon: false,
    isSupportNewOption: false,
    value: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      searchVal: '',
    };
  }

  componentDidMount() {
    history.pushState(null, null, '#'); // eslint-disable-line
    window.addEventListener('popstate', this.handleHistaryBack, false);
  }

  componentWillUnmount() {
    window.removeEventListener('popstate', this.handleHistaryBack, false);
  }

  handleHistaryBack = (e) => {
    e.preventDefault();
    this.props.onClosePopover();
  }

  onContainerClick = (event) => {
    if (this.editorPopover && this.editorPopover.contains(event.target)) {
      event.stopPropagation();
      event.nativeEvent.stopImmediatePropagation();
      return false;
    }
  }

  onChangeSearch = (event) => {
    let { searchVal } = this.state;
    if (searchVal === event.target.value) {
      return;
    }
    searchVal = event.target.value;
    this.setState({ searchVal });
  }

  getSelectedOptions = () => {
    let { value, options } = this.props;
    if (!Array.isArray(value)) {
      return [];
    }
    return options.filter(option => {
      return value.indexOf(option.id) > -1;
    });
  }

  getFilteredOptions = () => {
    let { options } = this.props;
    let { searchVal } = this.state;
    return searchVal ? options.filter((item) => item.name.indexOf(searchVal) > -1) : options;
  }

  onSelectOption = (option) => {
    this.props.onOptionItemToggle(option);
  }

  onAddNewOption = (event) => {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    let newOption = this.state.searchVal.trim();
    if (newOption) {
      this.props.onAddNewOption(newOption);
      this.props.onClosePopover();
    }
  }

  onRemoveOption = (option) => {
    this.props.onOptionItemToggle(option);
  }

  renderSelectOptions = (options) => {
    let { value } = this.props;
    return options.map((option, index) => {
      let isSelect = value.some(item => item === option.id);
      let style = {
        backgroundColor: option.color,
        color: option.textColor || null,
      };

      return (
        <div className="mb-select-option-item" key={index} onMouseDown={this.onSelectOption.bind(this, option)}>
          <span className="mb-select-item">
            <span className="item-name" style={style}>{option.name}</span>
          </span>
          <span className="mb-item-checked">
            {isSelect && <i className="dtable-font dtable-icon-check-mark"></i>}
          </span>
        </div>
      );
    });
  }

  setEditorPopover = (editorPopover) => {
    this.editorPopover = editorPopover;
  }

  render() {
    const { isReadOnly, column, isSupportNewOption, isShowRemoveIcon } = this.props;
    const { searchVal } = this.state;
    const selectedOptions = this.getSelectedOptions();
    const filteredOptions = this.getFilteredOptions();
    let isShowRemoveBtn = !isReadOnly && isShowRemoveIcon;
    let isShowCreateBtn = !isReadOnly && isSupportNewOption && !!searchVal;
    if (isShowCreateBtn) {
      isShowCreateBtn = filteredOptions.length === 0;
    }

    return (
      <div ref={this.setEditorPopover} className="dtable-ui-mb-editor-popover mb-select-editor-popover" style={{zIndex: 99}} onClick={this.onContainerClick}>
        <MBEditorHeader
          title={column.name}
          leftContent={(<i className="dtable-font dtable-icon-return"></i>)}
          onLeftClick={this.props.onClosePopover}
        />
        <div className="dtable-ui-mb-editor-body dtable-ui-mb-select-editor-body">
          <div className="mb-selected-item">
            <div className="title">{getLocale('Current_option')}</div>
            <div className="content">
              {selectedOptions.length === 0 && (
                <span className="empty-placeholder">{getLocale('No_option')}</span>
              )}
              {selectedOptions.length > 0 && (
                selectedOptions.map(selectedOption => {
                  return (
                    <SelectEditorOption
                      key={selectedOption.id}
                      option={selectedOption}
                      isShowRemoveIcon={isShowRemoveBtn}
                      onDeleteSelectOption={this.onRemoveOption}
                    />
                  );
                })
              )}
            </div>
          </div>
          <div className="mb-search-select-items">
            <input
              className="form-control"
              type="text"
              placeholder={getLocale('Find_an_option')}
              value={searchVal}
              onChange={this.onChangeSearch}
              onClick={this.onInputClick}
            />
          </div>
          <div className="mb-select-options-container">
            <div className="title">
              <span>{getLocale('Choose_an_option')}</span>
            </div>
            <div className="content">
              <Fragment>
                {filteredOptions.length === 0 && (
                  <div className="search-result-none">{getLocale('No_options_available')}</div>
                )}
                {filteredOptions.length > 0 && this.renderSelectOptions(filteredOptions)}
              </Fragment>
            </div>
          </div>
          {isShowCreateBtn && (
            <div className="mb-create-select-item" onClick={this.onAddNewOption}>
              <i className="dtable-font dtable-icon-add-table"></i>
              <span className="add-new-option">{`${getLocale('Add_an_option')} ${searchVal}`}</span>
            </div>
          )}
        </div>
      </div>
    );
  }
}

MBSelectEditorPopover.propTypes = propTypes;

export default MBSelectEditorPopover;
