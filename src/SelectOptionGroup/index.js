import React, { Component } from 'react';
import Option from './option';
import PropTypes from 'prop-types';
import DTableSearchInput from '../DTableSearchInput';
import KeyCodes from './KeyCodes';

const OPTION_HEIGHT = 32;

class SelectOptionGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchVal: '',
      activeIndex: -1,
    };
    this.filterOptions = null;
  }

  componentDidMount() {
    window.addEventListener('keydown', this.onHotKey);
    window.addEventListener('click', this.onClick, true);
    this.resetMenuStyle();
  }

  componentWillUnmount() {
    this.filterOptions = null;
    window.removeEventListener('click', this.onClick, true);
    window.removeEventListener('keydown', this.onHotKey);
  }

  resetMenuStyle = () => {
    const { top, height } = this.optionGroupRef.getBoundingClientRect();
    if (height + top > window.innerHeight) {
      const borderWidth = 2;
      this.optionGroupRef.style.top = -1 * (height + borderWidth) + 'px';
    }
  }

  onHotKey = (event) => {
    const keyCode = event.keyCode;
    if (keyCode === KeyCodes.UpArrow) {
      this.onPressUp();
    } else if (keyCode === KeyCodes.DownArrow) {
      this.onPressDown();
    } else if (keyCode === KeyCodes.Enter) {
      let option = this.filterOptions && this.filterOptions[this.state.activeIndex];
      if (option) {
        this.props.onSelectOption(option.value);
        if (!this.props.supportMultipleSelect) {
          this.props.closeSelect();
        }
      }
    } else if (keyCode === KeyCodes.Tab || keyCode === KeyCodes.Escape) {
      this.props.closeSelect();
    }
  }

  onPressUp = () => {
    if (this.state.activeIndex > 0) {
      this.setState({ activeIndex: this.state.activeIndex - 1 }, () => {
        this.scrollContent();
      });
    }
  }

  onPressDown = () => {
    if (this.filterOptions && this.state.activeIndex < this.filterOptions.length - 1) {
      this.setState({ activeIndex: this.state.activeIndex + 1 }, () => {
        this.scrollContent();
      });
    }
  }

  onClick = (e) => {
    if (this.props.stopClickEvent && this.optionGroupRef.contains(e.target) && !e.target.className.includes('dtable-font')) {
      e.stopPropagation();
    }
  }

  scrollContent = () => {
    const { offsetHeight, scrollTop } = this.optionGroupContentRef;
    if (this.state.activeIndex * OPTION_HEIGHT < scrollTop) {
      this.optionGroupContentRef.scrollTop = scrollTop - OPTION_HEIGHT;
    }
    else if (this.state.activeIndex * OPTION_HEIGHT > offsetHeight + scrollTop) {
      this.optionGroupContentRef.scrollTop = scrollTop + OPTION_HEIGHT;
    }
  }

  changeIndex = (index) => {
    this.setState({ activeIndex: index });
  }

  onChangeSearch = (searchVal) => {
    let value = searchVal || '';
    if (value !== this.state.searchVal) {
      this.setState({searchVal: value, activeIndex: -1,});
    }
  }

  renderOptGroup = (searchVal) => {
    let { noOptionsPlaceholder, onSelectOption } = this.props;
    this.filterOptions = this.props.getFilterOptions(searchVal);
    if (this.filterOptions === 0) {
      return (
        <div className="none-search-result">{noOptionsPlaceholder}</div>
      );
    }
    return this.filterOptions.map((opt, i) => {
      let key = opt.value.column ? opt.value.column.key : i;
      let isActive = this.state.activeIndex === i;
      return (
        <Option
          key={key}
          index={i}
          isActive={isActive}
          value={opt.value}
          onSelectOption={onSelectOption}
          changeIndex={this.changeIndex}
          supportMultipleSelect={this.props.supportMultipleSelect}
        >
          {opt.label}
        </Option>
      );
    });
  }

  render() {
    const { searchable, searchPlaceholder, top, left, minWidth, value, isShowSelected } = this.props;
    let { searchVal } = this.state;
    let style = {top: top || 0, left: left || 0 };
    if (minWidth) {
      style = {top: top || 0, left: left || 0, minWidth};
    }
    return (
      <div
        className={`option-group ${isShowSelected ? 'pt-0' : ''}`}
        ref={(ref) => this.optionGroupRef = ref}
        style={style}
      >
        {isShowSelected &&
          <div className="editor-list-delete mb-2" onClick={(e) => e.stopPropagation()}>{value.label || ''}</div>
        }
        {searchable && (
          <div className="option-group-search">
            <DTableSearchInput
              className="option-search-control"
              placeholder={searchPlaceholder}
              onChange={this.onChangeSearch}
              autoFocus={true}
            />
          </div>
        )}
        <div className="option-group-content" ref={(ref) => this.optionGroupContentRef = ref}>
          {this.renderOptGroup(searchVal)}
        </div>
      </div>
    );
  }
}

SelectOptionGroup.propTypes = {
  top: PropTypes.number,
  left: PropTypes.number,
  minWidth: PropTypes.number,
  options: PropTypes.array,
  onSelectOption: PropTypes.func,
  searchable: PropTypes.bool,
  searchPlaceholder: PropTypes.string,
  noOptionsPlaceholder: PropTypes.string,
  closeSelect: PropTypes.func.isRequired,
  getFilterOptions: PropTypes.func.isRequired,
  supportMultipleSelect: PropTypes.bool,
  value: PropTypes.object,
  isShowSelected: PropTypes.bool,
  stopClickEvent: PropTypes.bool,
};

export default SelectOptionGroup;
