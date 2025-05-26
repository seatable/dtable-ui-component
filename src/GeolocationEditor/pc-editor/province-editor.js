import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DtableSearchInput from '../../DTableSearchInput';
import { KeyCodes } from '../../constants';
import Loading from '../../Loading';
import { getLocale } from '../../lang';

const propTypes = {
  value: PropTypes.object,
  setValue: PropTypes.func,
  column: PropTypes.object,
  onSubmit: PropTypes.func,
  getData: PropTypes.func,
  onPressTab: PropTypes.func
};

class ProvinceEditor extends Component {

  constructor(props) {
    super(props);
    this.value = props.value || {};
    this.locations = {};
    this.state = {
      isLoadingData: true,
      searchingProvince: '',
      value: this.value.province,
      highlightIndex: -1,
    };
    this.filteredProvince = [];
    this.timer = null;
    this.maxItemNum = 5;
    this.itemHeight = 30;
  }

  componentDidMount() {
    this.props.getData().then(data => {
      this.locations = data;
      this.filteredProvince = this.locations.children;
      this.setState({
        isLoadingData: false,
      });
    });
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
    }
  };

  onEnter = (e) => {
    e.stopPropagation();
    let selectedProvince;
    if (this.filteredProvince.length === 1) {
      selectedProvince = this.filteredProvince[0];
    } else if (this.state.highlightIndex > -1) {
      selectedProvince = this.filteredProvince[this.state.highlightIndex];
    }
    if (selectedProvince) {
      this.props.setValue({ province: selectedProvince.name });
      this.props.onSubmit();
    }
  };

  onUpArrow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let { highlightIndex } = this.state;
    if (highlightIndex > 0) {
      this.setState({ highlightIndex: highlightIndex - 1 }, () => {
        if (highlightIndex < this.filteredProvince.length - this.maxItemNum) {
          this.selectContainer.scrollTop -= this.itemHeight;
        }
      });
    }
  };

  onDownArrow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let { highlightIndex } = this.state;
    if (highlightIndex < this.filteredProvince.length - 1) {
      this.setState({ highlightIndex: highlightIndex + 1 }, () => {
        if (highlightIndex >= this.maxItemNum) {
          this.selectContainer.scrollTop += this.itemHeight;
        }
      });
    }
  };

  onClick = (province) => {
    this.props.setValue({ province });
    this.setState({ value: province });
    this.props.onSubmit();
  };

  onChange = searchVal => {
    const value = searchVal.trim();
    if (value === this.state.searchingProvince) return;
    if (value.length === 0) {
      this.provinceReg = null;
    }
    if (value.length > 0) {
      this.provinceReg = new RegExp(value, 'i');
    }
    this.filteredProvince = this.locations.children.filter((item) => {
      if (!this.provinceReg) {
        return true;
      }
      return this.provinceReg.test(item.name) || this.provinceReg.test(item.alphabetic);
    });
    this.setState({
      searchingProvince: value,
      highlightIndex: this.filteredProvince.length > 0 ? 0 : -1
    });
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

  createProvinceList = () => {
    const { value, highlightIndex } = this.state;
    let provinceList = this.filteredProvince.map((item, index) => {
      return (
        <div
          className={`geolocation-region-editor-province ${highlightIndex === index ? 'geolocation-region-editor-province-highlight' : ''}`}
          key={item.alphabetic + index}
          title={item.name}
          aria-label={item.name}
          onClick={() => this.onClick(item.name)}
          onMouseEnter={() => this.onMenuMouseEnter(index)}
          onMouseLeave={() => this.onMenuMouseLeave(index)}
        >
          <span className="province-name">{item.name}</span>
          <span className={`icon ${value === item.name ? 'province-selected-icon dtable-font dtable-icon-check-mark' : ''}`}></span>
        </div>
      );
    });
    if (provinceList.length === 0) {
      provinceList.push(<div key={'province-null'} className="country-list-empty">{getLocale('No_options')}</div>);
    }
    return provinceList;
  };

  render() {
    const { isLoadingData } = this.state;
    return (
      <div className="dtable-ui-geolocation-province-editor">
        <div className='geolocation-province-list-header'>
          <DtableSearchInput
            placeholder={getLocale('Search_province')}
            onKeyDown={this.onKeyDown}
            onChange={this.onChange}
            autoFocus={true}
          />
        </div>
        <div className='geolocation-province-list-container' ref={ref => this.selectContainer = ref}>
          {isLoadingData ?
            <Loading /> :
            this.createProvinceList()
          }
        </div>
      </div>
    );
  }
}

ProvinceEditor.propTypes = propTypes;
export default ProvinceEditor;
