import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';
import { KeyCodes } from '../../constants';
import Loading from '../../Loading';
import { getLocale } from '../../lang';

const propTypes = {
  config: PropTypes.object,
  value: PropTypes.object,
  column: PropTypes.object,
  setValue: PropTypes.func,
  onSubmit: PropTypes.func,
  onPressTab: PropTypes.func
};

class CountryEditor extends Component {

  constructor(props) {
    super(props);
    this.countryReg = null;
    const { column, value } = props;
    const columnData = column.data || {};
    this.lang = columnData.lang === 'cn' ? 'cn' : 'en';
    this.state = {
      searchingCountry: '',
      value: value.country_region,
      isLoadingData: true,
      highlightIndexes: [0, -1],
    };
    this.filteredCountry = [];
    this.timer = null;
    this.maxItemNum = 6;
    this.itemHeight = 30;
  }

  componentDidMount() {
    document.addEventListener('keydown', this.onHotKey, true);
    this.props.getData(this.lang).then(data => {
      this.geolocationRegions = data;
      this.filteredCountry = this.geolocationRegions;
      this.setState({ isLoadingData: false });
    });
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

  onDownArrow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let { highlightIndexes } = this.state;
    const continents = Object.keys(this.filteredCountry);
    if (continents.length === 0) return;
    const continent = continents[highlightIndexes[0]];
    if (highlightIndexes[1] < this.filteredCountry[continent].length - 1) {
      highlightIndexes[1] = highlightIndexes[1] + 1;
    } else if (highlightIndexes[1] === this.filteredCountry[continent].length - 1 && highlightIndexes[0] < continents.length - 1) {
      highlightIndexes[0] = highlightIndexes[0] + 1;
      highlightIndexes[1] = 0;
    }

    this.setState({
      highlightIndexes: [...highlightIndexes]
    }, () => {
      let itemCount = this.getItemCount(highlightIndexes[0], highlightIndexes[1]);
      if (itemCount >= this.maxItemNum) {
        this.selectContainer.scrollTop += this.itemHeight * (highlightIndexes[1] === 0 ? 2 : 1);
      }
    });
  };

  onUpArrow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let { highlightIndexes } = this.state;
    const continents = Object.keys(this.filteredCountry);
    if (continents.length === 0) return;
    if (highlightIndexes[1] === 0 && highlightIndexes[0] !== 0) {
      highlightIndexes[0] = highlightIndexes[0] - 1;
      highlightIndexes[1] = this.filteredCountry[continents[highlightIndexes[0]]].length - 1;
    } else if (highlightIndexes[1] === 0 && highlightIndexes[0] === 0) {
      highlightIndexes = [0, 0];
    } else {
      highlightIndexes[1] = highlightIndexes[1] - 1;
    }

    this.setState({
      highlightIndexes: [...highlightIndexes]
    }, () => {
      let itemCount = this.getItemCount(highlightIndexes[0], highlightIndexes[1]);
      if (itemCount < this.getItemCount(continents.length - 1, this.filteredCountry[continents[continents.length - 1]].length - 1) - this.maxItemNum) {
        this.selectContainer.scrollTop -= this.itemHeight * (highlightIndexes[1] === 0 ? 2 : 1);
      }
    });
  };

  getItemCount = (continentIndex, countryIndex) => {
    const continents = Object.keys(this.filteredCountry);
    let count = continentIndex + 1;
    for (let index = 0; index < continentIndex; index++) {
      count += this.filteredCountry[continents[index]].length;
    }
    count = count + countryIndex;
    return count;
  };

  onEnter = (e) => {
    e.stopPropagation();
    const cuntries = Object.values(this.filteredCountry).flat();
    if (cuntries && cuntries.length === 1) {
      this.props.setValue({ country_region: cuntries[0] });
      this.props.onSubmit();
    } else {
      const { highlightIndexes } = this.state;
      const continents = Object.keys(this.filteredCountry);
      if (continents.length > 0) {
        const continent = continents[highlightIndexes[0]];
        const country = this.filteredCountry[continent][highlightIndexes[1]];
        if (!country) return;
        this.props.setValue({ country_region: country });
        this.props.onSubmit();
      }
    }
  };

  onMenuMouseEnter = (continentIndex, countryIndex) => {
    this.setState({ highlightIndexes: [continentIndex, countryIndex] });
  };

  onMenuMouseLeave = (continentIndex, countryIndex) => {
    this.timer = setTimeout(() => {
      const { highlightIndexes } = this.state;
      if (highlightIndexes[0] === continentIndex && highlightIndexes[1] === countryIndex) {
        this.setState({ highlightIndexes: [0, -1] });
      }
    }, 300);
  };

  createContinentList = () => {
    let isSearchResultEmpty = true;
    const continents = Object.keys(this.filteredCountry);
    const continentsList = continents.map((continent, index) => {
      const countryList = this.createCountryList(continent, index);
      if (countryList.length > 0) {
        isSearchResultEmpty = false;
        return (
          <Fragment key={continent}>
            <div className="geolocation-region-editor-continent">{continent}</div>
            {countryList}
          </Fragment>
        );
      }
      return null;
    });
    if (isSearchResultEmpty) {
      return <div className="country-list-empty">{getLocale('No_options')}</div>;
    }
    return continentsList;
  };

  createCountryList = (continent, continentIndex) => {
    const { value, highlightIndexes } = this.state;
    let countryList = this.filteredCountry[continent].map((country, index) => {
      const isHighlight = highlightIndexes[0] === continentIndex && highlightIndexes[1] === index;
      return (
        <div
          className={`geolocation-region-editor-country ${isHighlight ? 'geolocation-region-editor-province-highlight' : ''}`}
          key={country}
          onMouseEnter={() => this.onMenuMouseEnter(continentIndex, index)}
          onMouseLeave={() => this.onMenuMouseLeave(continentIndex, index)}
          title={country}
          aria-label={country}
          onClick={() => this.onClick(country)}
        >
          <span className={`icon ${value === country ? 'dtable-font dtable-icon-check-mark' : ''}`}></span>
          <span className="country-name">{country}</span>
        </div>
      );
    });
    return countryList;
  };

  onClick = (country) => {
    this.props.setValue({ country_region: country });
    this.props.onSubmit();
  };

  onChange = e => {
    const value = e.target.value.trim();
    if (value.length === 0) {
      this.countryReg = null;
    }
    if (value.length > 0) {
      let regStr = '(.*)' + value.split('').join('(.*)') + '(.*)';
      this.countryReg = new RegExp(regStr, 'i');
    }
    this.filteredCountry = this.filterCountry();
    this.setState({
      searchingCountry: e.target.value,
      highlightIndexes: Object.keys(this.filteredCountry).length > 0 ? [0, 0] : [0, -1]
    });
  };

  filterCountry = () => {
    const continents = Object.keys(this.geolocationRegions);
    const map = {};
    for (let i = 0; i < continents.length; i++) {
      const countries = this.geolocationRegions[continents[i]];
      const continent = continents[i];
      map[continent] = [];
      countries.forEach((item) => {
        if (this.countryReg && this.countryReg.test(item)) {
          map[continent].push(item);
        } else if (!this.countryReg) {
          map[continent].push(item);
        }
      });
      if (map[continent].length === 0) {
        delete map[continent];
      }
    }
    return map;
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

  render() {
    const { isLoadingData } = this.state;
    return (
      <div className='dtable-ui-geolocation-country-editor'>
        <div className='geolocation-region-list-header'>
          <Input
            value={this.state.searchingCountry}
            onChange={this.onChange}
            autoFocus={true}
            onKeyDown={this.onKeyDown}
            placeholder={getLocale('Search_country')}
          />
        </div>
        <div className='geolocation-region-list-container' ref={ref => this.selectContainer = ref}>
          {isLoadingData ?
            <Loading /> :
            this.createContinentList()
          }
        </div>
      </div>
    );
  }
}

CountryEditor.propTypes = propTypes;

export default CountryEditor;
