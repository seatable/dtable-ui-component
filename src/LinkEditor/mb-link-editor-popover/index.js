import React from 'react';
import PropTypes from 'prop-types';
import { getLocale } from '../../lang';
import MBEditorHeader from '../../MBEditorHeader';

import './index.css';

const propTypes = {
  isReadOnly: PropTypes.bool.isRequired,
  value: PropTypes.array.isRequired,
  column: PropTypes.object.isRequired,
  options: PropTypes.array.isRequired,
  onOptionItemToggle: PropTypes.func.isRequired,
  onClosePopover: PropTypes.func,
};

class MBLinkEditorPopover extends React.Component {

  static defaultProps = {
    isReadOnly: false,
    value: [],
  };

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
  };

  onContainerClick = (event) => {
    if (this.editorPopover && this.editorPopover.contains(event.target)) {
      event.stopPropagation();
      event.nativeEvent.stopImmediatePropagation();
      return false;
    }
  };

  onChangeSearch = (event) => {
    let { searchVal } = this.state;
    if (searchVal === event.target.value) {
      return;
    }
    searchVal = event.target.value;
    this.setState({ searchVal });
  };

  getSelectedOptions = () => {
    let { value, options } = this.props;
    if (!Array.isArray(value)) {
      return [];
    }
    return options.filter(option => {
      return value.indexOf(option.email) > -1;
    });
  };

  getFilterOptions = () => {
    let { options } = this.props;
    let { searchVal } = this.state;
    return searchVal ? options.filter((item) => item.name.indexOf(searchVal) > -1) : options;
  };

  onSelectOption = (option) => {
    this.props.onOptionItemToggle(option);
  };

  onRemoveOption = (option) => {
    this.props.onOptionItemToggle(option);
  };

  renderFilteredOptions = (options) => {
    let { value } = this.props;
    return options.map((option, index) => {
      let isSelect = value.some(item => item === option.id);

      return (
        <div className="mb-link-option-item" key={index} onMouseDown={this.onSelectOption.bind(this, option)}>
          <span className="mb-option-info">
            <span className="option-name" title={option.name}>{option.name}</span>
          </span>
          {isSelect && <i className="mb-option-checked dtable-font dtable-icon-check-mark"></i>}
        </div>
      );
    });
  };

  setEditorPopover = (editorPopover) => {
    this.editorPopover = editorPopover;
  };

  render() {
    const { column } = this.props;
    const { searchVal } = this.state;
    let filterOptions = this.getFilterOptions();

    return (
      <div ref={this.setEditorPopover} className="dtable-ui-mb-editor-popover mb-link-editor-popover" onClick={this.onContainerClick}>
        <MBEditorHeader
          title={column.name}
          leftContent={(<i className="dtable-font dtable-icon-return"></i>)}
          rightContent={(<span>{getLocale('Done')}</span>)}
          onLeftClick={this.props.onClosePopover}
          onRightClick={this.props.onClosePopover}
        />
        <div className="dtable-ui-mb-editor-body dtable-ui-mb-link-editor-body">
          <div className="mb-search-link-items">
            <input
              className="form-control"
              type="text"
              placeholder={getLocale('Find_an_option')}
              value={searchVal}
              onChange={this.onChangeSearch}
              onClick={this.onInputClick}
            />
          </div>
          <div className="mb-link-container">
            <div className="title">{getLocale('Choose_an_option')}</div>
            <div className="content">
              {filterOptions.length === 0 && (
                <div className="search-result-none">{getLocale('No_options_available')}</div>
              )}
              {filterOptions.length > 0 && this.renderFilteredOptions(filterOptions)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

MBLinkEditorPopover.propTypes = propTypes;

export default MBLinkEditorPopover;
