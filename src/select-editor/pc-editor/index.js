import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Popover } from 'reactstrap';
import { getLocale } from '../../lang';
import DtableSearchInput from '../../DTableSearchInput';
import { KeyCodes } from '../../constants';

import './index.css';

const propTypes = {
  isSupportNewOption: PropTypes.bool,
  className: PropTypes.string,
  options: PropTypes.array.isRequired,
  value: PropTypes.array.isRequired,
  valueKey: PropTypes.string,
  parent: PropTypes.object,
  onCommit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onAddNewOption: PropTypes.func,
};

class PCSelectEditor extends React.Component {

  static defaultProps = {
    options: [],
    value: [],
    valueKey: 'id',
  };

  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      highlightIndex: -1,
      maxItemNum: 0,
      itemHeight: 0
    };
    this.filteredOptions = props.options;
    this.timer = null;
    this.parent = null;
    this.ref = null;
    this.container = null;
    this.selectItem = null;
  }

  componentDidMount() {
    if (this.props.isInModal && this.parent) {
      if (this.parent.getBoundingClientRect().top > 330) {
        this.ref.style.top = '-200px';
      }
    }

    const { bottom } = this.ref.getBoundingClientRect();
    if (bottom > window.innerHeight) {
      this.ref.style.top = (parseInt(this.ref.style.top) - bottom + window.innerHeight) + 'px';
    }

    if (this.container && this.selectItem) {
      this.setState({
        maxItemNum: this.getMaxItemNum(),
        itemHeight: parseInt(getComputedStyle(this.selectItem, null).height)
      });
    }
    document.addEventListener('keydown', this.onHotKey, true);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onHotKey, true);
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  onHotKey = (e) => {
    if (e.keyCode === KeyCodes.Enter) {
      this.onEnter(e);
    } else if (e.keyCode === KeyCodes.UpArrow) {
      this.onUpArrow(e);
    } else if (e.keyCode === KeyCodes.DownArrow) {
      this.onDownArrow(e);
    } else if (e.keyCode === KeyCodes.Tab) {
      if (this.props.onPressTab) {
        this.props.onPressTab(e);
      }
    } else if (e.keyCode === KeyCodes.Escape) {
      if (this.props.isInModal) {
        e.stopPropagation();
        this.props.onClose && this.props.onClose();
      }
    }
  };

  onEnter = (e) => {
    e.preventDefault();
    let option;
    const { isSupportNewOption } = this.props;
    if (this.filteredOptions.length === 1) {
      option = this.filteredOptions[0];
    } else if (this.state.highlightIndex > -1) {
      option = this.filteredOptions[this.state.highlightIndex];
    }
    if (option) {
      this.onChange(option);
    } else {
      const { searchValue } = this.state;
      if (searchValue && isSupportNewOption && this.filteredOptions.length === 0 ) {
        e.stopPropagation();
        this.onAddNewOption();
      }
    }
  };

  onUpArrow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let { highlightIndex, maxItemNum, itemHeight } = this.state;
    if (highlightIndex > 0) {
      this.setState({ highlightIndex: highlightIndex - 1 }, () => {
        if (highlightIndex < this.filteredOptions.length - maxItemNum) {
          this.container.scrollTop -= itemHeight;
        }
      });
    }
  };

  onDownArrow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let { highlightIndex, maxItemNum, itemHeight } = this.state;
    if (highlightIndex < this.filteredOptions.length - 1) {
      this.setState({ highlightIndex: highlightIndex + 1 }, () => {
        if (highlightIndex >= maxItemNum) {
          this.container.scrollTop += itemHeight;
        }
      });
    }
  };

  onValueChanged = (searchValue) => {
    const { searchValue: oldSearchVal } = this.state;
    const { options } = this.props;
    if (oldSearchVal === searchValue) return;
    this.setState({ searchValue });
    const val = searchValue.toLowerCase();
    this.filteredOptions = val ? options.filter((item) => item.name && item.name.toLowerCase().indexOf(val) > -1) : options;
    this.setState({ highlightIndex: this.filteredOptions.length > 0 ? 0 : -1 });
  };

  onAddNewOption = () => {
    const name = this.state.searchValue.trim();
    this.props.onAddNewOption(name);
  };

  onChange = (option) => {
    this.props.onCommit(option);
  };

  onMenuMouseEnter = (index) => {
    this.setState({ highlightIndex: index });
  };

  onMenuMouseLeave = (index) => {
    this.timer = setTimeout(() => {
      if (this.state.highlightIndex === index) {
        this.setState({ highlightIndex: -1 });
      }
    }, 300);
  };

  getOptionStyle = (option) => {
    const { optionWidth } = this.props;
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
      maxWidth: optionWidth || 138,
    };
  };

  onKeyDown = (e) => {
    if (
      e.keyCode === KeyCodes.ChineseInputMethod ||
      e.keyCode === KeyCodes.Enter ||
      e.keyCode === KeyCodes.LeftArrow ||
      e.keyCode === KeyCodes.RightArrow
    ) {
      e.stopPropagation();
    }
  };

  getMaxItemNum = () => {
    let selectContainerStyle = getComputedStyle(this.container, null);
    let selectItemStyle = getComputedStyle(this.selectItem, null);
    let maxSelectItemNum = Math.floor(parseInt(selectContainerStyle.maxHeight) / parseInt(selectItemStyle.height));
    return maxSelectItemNum - 1;
  };

  render() {
    const { isInModal, className, value, column, valueKey, isSupportNewOption, target, classNamePrefix } = this.props;
    const { searchValue, highlightIndex } = this.state;

    // maxWidth = single-selects-container's width - single-selects-container's padding-left and padding-right - single-select-container's padding-left - single-select-check-icon's width - The gap between the single-select-check-icon and single-select-name or scroll's width
    // maxWidth = column.width > 200 ? column.width - 20 - 12 - 20 - 10 : 200 - 20 - 12 - 20 - 10
    // maxWidth = column.width > 200 ? column.width - 62 : 200 - 62
    let maxWidth = isInModal ? 250 : column?.width > 200 ? column.width - 62 : 138;

    const dom = (
      <div className={classnames('dtable-ui-editor-container dtable-ui-select-editor-container', className, { [`${classNamePrefix}-select-editor-container`]: classNamePrefix })} ref={ref => this.ref = ref}>
        <div className="select-options-search">
          <DtableSearchInput
            placeholder={getLocale('Search_option')}
            onKeyDown={this.onKeyDown}
            onChange={this.onValueChanged}
            autoFocus={true}/>
        </div>
        <div className="select-dtable-ui-mobile-selector-options-container" ref={ref => this.container = ref}>
          {this.filteredOptions.length > 0 && this.filteredOptions.map((option, index) => {
            let optionStyle = this.getOptionStyle(option);
            optionStyle = { ...optionStyle, maxWidth };
            let isSelected = value.includes(option[valueKey]);
            return (
              <div key={option.id} className="select-option-item" ref={ref => this.selectItem = ref}>
                <div
                  className={classnames('select-option-item-container', { 'select-option-item-container-highlight': index === highlightIndex })}
                  onMouseDown={this.onChange.bind(this, option)}
                  onMouseEnter={this.onMenuMouseEnter.bind(this, index)}
                  onMouseLeave={this.onMenuMouseLeave.bind(this, index)}
                >
                  <div className="option-info">
                    <div className="option-name" style={optionStyle} title={option.name} >{option.name}</div>
                  </div>
                  <div className="option-checked">
                    {isSelected && <i className="dtable-font dtable-icon-check-mark"></i>}
                  </div>
                </div>
              </div>
            );
          })}
          {this.filteredOptions.length === 0 && (<div className="dtable-ui-editor-no-search-result">{getLocale('No_options_available')}</div>)}
        </div>
        {(isSupportNewOption && !!searchValue) && (
          <div className="select-options-add" onClick={this.onAddNewOption}>
            <i className="dtable-font dtable-icon-add-table"></i>
            <span>{getLocale('Add_an_option')}{' '}{searchValue}</span>
          </div>
        )}
      </div>
    );

    if (isInModal) {
      return (
        <div ref={ref => this.parent = ref}>
          <Popover
            placement="bottom-start"
            isOpen={true}
            target={target}
            hideArrow={true}
            fade={false}
            className={classnames('dtable-ui dtable-ui-row-expand-select-editor-popover', { [`${classNamePrefix}-select-editor-popover`]: classNamePrefix })}
          >
            {dom}
          </Popover>
        </div>
      );
    }

    return dom;
  }
}

PCSelectEditor.propTypes = propTypes;

export default PCSelectEditor;
