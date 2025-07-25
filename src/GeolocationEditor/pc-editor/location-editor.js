import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Alert } from 'reactstrap';
import DTableCustomFooter from '../../DTableCustomFooter';
import GeolocationSelectorList from './selector-list';
import SelectorHeaderItem from './selector-header-item';
import { KeyCodes } from '../../constants';
import Loading from '../../Loading';
import parseGeolocation from './parse-geolocation';
import { getLocale } from '../../lang';

const propTypes = {
  isShowDetails: PropTypes.bool,
  value: PropTypes.object,
  setValue: PropTypes.func,
  getData: PropTypes.func,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func
};

class LocationEditor extends Component {

  constructor(props) {
    super(props);
    this.value = props.value;
    this.locations = {};
    this.state = {
      isShowSelector: false,
      location: `${this.value.province || ''}${this.value.city || ''}${this.value.district || ''}`,
      selectedProvince: null,
      selectedCity: null,
      selectedCounty: null,
      selectedItem: 'province',
      isLoadingData: true,
      errMessage: ''
    };
    this.isComposing = false;
    this.timer = null;
  }

  getLocationText = (province, city, district) => {
    return (province ? province.name : '') + (city ? city.name : '') + (district ? district.name : '');
  };

  UNSAFE_componentWillMount() {
    this.props.getData().then(data => {
      this.locations = data;
      const { selectedProvince, selectedCity, selectedCounty, selectedItem } = this.initLocationSelecting(this.value);
      this.setState({
        isLoadingData: false,
        selectedProvince,
        selectedCity,
        selectedCounty,
        selectedItem
      });
    });
  }

  initLocationSelecting = (value) => {
    let selectedProvince = this.locations.children.find((province) => {
      return value.province && value.province.length > 0 && province.name.includes(value.province);
    });

    if (!selectedProvince) {
      return { selectedProvince: null, selectedCity: null, selectedCounty: null, selectedItem: 'province' };
    }

    let selectedCity = selectedProvince.children.find((city) => {
      return value.city && value.city.length > 0 && city.name.includes(value.city);
    });

    if (!selectedCity) {
      return { selectedProvince, selectedCity: null, selectedCounty: null, selectedItem: 'city' };
    }

    let selectedCounty = selectedCity.children.find((county) => {
      return value.district && value.district.length > 0 && county.name.includes(value.district);
    });

    if (!selectedCounty) {
      return { selectedProvince, selectedCity, selectedCounty: null, selectedItem: 'county' };
    }

    return { selectedProvince, selectedCity, selectedCounty, selectedItem: 'county' };
  };

  onKeyDown = (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    if (e.keyCode === KeyCodes.Escape) {
      this.props.onCancel();
    }
  };

  onToggleSelector = () => {
    this.setState({
      isShowSelector: !this.state.isShowSelector,
      errMessage: ''
    });
  };

  selectProvince = (province) => {
    this.setState({
      selectedProvince: province,
      selectedItem: province ? 'city' : 'province',
      selectedCity: null,
      selectedCounty: null,
      location: this.getLocationText(province),
    });
    this.value = Object.assign({}, this.value, { province: province ? province.name : '', city: '', district: '' });
    this.props.setValue(this.value);
  };

  selectCity = (city) => {
    this.setState({
      selectedCity: city,
      selectedItem: city ? 'county' : 'city',
      selectedCounty: null,
      location: this.getLocationText(this.state.selectedProvince, city)
    });
    this.value = Object.assign({}, this.value, { city: city ? city.name : '', district: '' });
    this.props.setValue(this.value);
  };

  selectCounty = (county) => {
    this.setState({
      selectedCounty: county,
      isShowSelector: false,
      location: this.getLocationText(this.state.selectedProvince, this.state.selectedCity, county)
    });
    this.value = Object.assign({}, this.value, { district: county ? county.name : '' });
    this.props.setValue(this.value);
  };

  selectSelectorType = (type) => {
    const { selectedProvince, selectedCity } = this.state;
    if (!selectedProvince) return;
    if (type === 'county' && !selectedCity) return;
    this.setState({
      selectedItem: type
    });
  };

  onChange = () => {
    this.value = Object.assign({}, this.value, { detail: this.detailInfo.value });
    this.props.setValue(this.value);
  };

  onClick = (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };

  onParseChange = () => {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.timer = setTimeout(() => {
      clearTimeout(this.timer);
      this.timer = null;
      const value = this.parseRef.value;
      if (this.isComposing) return;
      const { province, city, district, detail } = parseGeolocation(this.locations, value);
      if (this.detailInfo) {
        this.detailInfo.value = detail || '';
        this.value = Object.assign({}, this.value, { detail: this.detailInfo.value });
      }

      this.props.setValue(this.value);
      this.selectProvince(province);
      if (!province) return;
      this.selectCity(city);
      if (!city) return;
      this.selectCounty(district);
    }, 100);
  };

  onCompositionStart = () => {
    this.isComposing = true;
  };

  onCompositionEnd = () => {
    this.isComposing = false;
  };

  onSubmit = () => {
    const { province, city, district } = this.value;
    if (!province || !city || !district) {
      const errMessage = getLocale('Province/City/District_must_be_filled_in');
      this.setState({ errMessage });
      return;
    }
    this.props.onSubmit();
  };

  render() {
    const { selectedItem, selectedCity, selectedProvince, selectedCounty, isShowSelector, isLoadingData, location } = this.state;
    return (
      <>
        {!isLoadingData ?
          <div onClick={this.onClick} className="dtable-ui-geolocation-editor-content">
            <div className="dtable-ui-geolocation-editor-item dtable-ui-geolocation-editor-selector-container">
              <div className="dtable-ui-geolocation-editor-item-left">
                {getLocale('Address_information') + ':'}
              </div>
              <div className="dtable-ui-geolocation-editor-item-right">
                <div
                  onClick={this.onToggleSelector}
                  className={`dtable-ui-geolocation-editor-selector text-truncate ${isShowSelector ? 'focus' : ''}`}
                >
                  <span className="selected-option-show">
                    {location ? location : getLocale('Select_province_city_district')}
                  </span>
                  <span aria-hidden="true" className="dtable-font dtable-icon-down3 dtable-ui-geolocation-editor-parameter-icon"></span>
                </div>
              </div>
              {isShowSelector && (
                <div className="geolocation-selector-container">
                  <div className="geolocation-selector-header">
                    <SelectorHeaderItem
                      type="province"
                      clickHandler={this.selectSelectorType}
                      selectedType={selectedItem}
                      selectedItem={selectedProvince}
                    />
                    <SelectorHeaderItem
                      type="city"
                      clickHandler={this.selectSelectorType}
                      selectedType={selectedItem}
                      selectedItem={selectedCity}
                    />
                    <SelectorHeaderItem
                      type="county"
                      clickHandler={this.selectSelectorType}
                      selectedType={selectedItem}
                      selectedItem={selectedCounty}
                    />
                  </div>
                  <div className="geolocation-selector-body">
                    {selectedItem === 'province' && (
                      <GeolocationSelectorList
                        type="province"
                        parent={this.locations}
                        selectedItem={selectedProvince}
                        clickHandler={this.selectProvince}
                      />
                    )}
                    {selectedItem === 'city' && (
                      <GeolocationSelectorList
                        type="city"
                        parent={selectedProvince}
                        selectedItem={selectedCity}
                        clickHandler={this.selectCity}
                      />
                    )}
                    {selectedItem === 'county' && (
                      <GeolocationSelectorList
                        type="county"
                        parent={selectedCity}
                        selectedItem={selectedCounty}
                        clickHandler={this.selectCounty}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
            {this.props.isShowDetails &&
            <div className="dtable-ui-geolocation-editor-item dtable-ui-geolocation-editor-detail">
              <div className="dtable-ui-geolocation-editor-item-left">
                {getLocale('Detailed_address') + ':'}
              </div>
              <div className="dtable-ui-geolocation-editor-item-right">
                <textarea
                  ref={ref => (this.detailInfo = ref)}
                  placeholder={getLocale('Detailed_address_placeholder')}
                  className="dtable-ui-geolocation-editor-detail-info"
                  type="text"
                  onChange={this.onChange}
                  defaultValue={this.value.detail}
                  onKeyDown={this.onKeyDown}
                  autoFocus
                />
              </div>
            </div>
            }
            <div className="dtable-ui-geolocation-editor-item dtable-ui-geolocation-editor-parse">
              <div className="dtable-ui-geolocation-editor-item-left">
                {getLocale('Auto_recognition') + ':'}
              </div>
              <div className="dtable-ui-geolocation-editor-item-right">
                <textarea
                  ref={ref => (this.parseRef = ref)}
                  placeholder={getLocale('Try_pasting_addresses_such_as_provinces/cities/districts_roads_neighborhoods_etc_to_quickly_identify_the_address_information')}
                  className="dtable-ui-geolocation-editor-detail-info dtable-ui-geolocation-editor-recognition"
                  type="text"
                  onChange={this.onParseChange}
                  onKeyDown={this.onKeyDown}
                  onCompositionEnd={this.onCompositionEnd}
                  onCompositionStart={this.onCompositionStart}
                />
              </div>
            </div>
          </div>
          :
          <>
            <Loading />
            <div className="align-items-center">
              {getLocale('Loading_geolocation_data')}
            </div>
          </>
        }
        {this.state.errMessage && <Alert color="danger" className="mt-2">{this.state.errMessage}</Alert>}
        <DTableCustomFooter>
          <Button onClick={this.props.onCancel} color='secondary'>
            {getLocale('Cancel')}
          </Button>
          <Button onClick={this.onSubmit} color='primary'>
            {getLocale('Submit')}
          </Button>
        </DTableCustomFooter>
      </>
    );
  }
}

LocationEditor.propTypes = propTypes;

export default LocationEditor;
