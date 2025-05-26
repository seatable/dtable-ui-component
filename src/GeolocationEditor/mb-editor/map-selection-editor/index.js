import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { isEmptyObject } from 'dtable-utils';
import InputItem from '../../../InputItem';
import toaster from '../../../toaster';
import MobileFullScreenPage from '../../../MobileFullScreenPage';
import { MAP_TYPES, INPUT_MODE_MAP, getInitCenter, loadMapSource, getMapInfo, locateCurrentPosition } from '../../map-editor-utils';
import { isValidPosition } from '../../../utils/cell';
import { getLocale } from '../../../lang';
import Loading from '../../../Loading';

import './index.css';

const { Header, Body } = MobileFullScreenPage;

const getInputMode = (column) => {
  const data = column.data;
  if (!data) return INPUT_MODE_MAP.ANY_LOCATION;
  return data.input_mode || INPUT_MODE_MAP.ANY_LOCATION;
};

const getInitValue = (value) => {
  if (!value || isEmptyObject(value) || !value.address) {
    return { address: '', title: '', tag: '', lngLat: {} };
  }
  return value;
};

class MapSelectionEditor extends React.Component {

  constructor(props) {
    super(props);
    const { value, config, column } = props;
    const oldValue = value || {};
    const { mapType, mapKey } = getMapInfo(config);
    this.mapType = mapType;
    this.mapKey = mapKey;
    const mode = getInputMode(column);
    this.canSelectPosition = mode === INPUT_MODE_MAP.ANY_LOCATION;

    const initValue = getInitValue(value);
    this.map = null;
    this.state = {
      isLoading: true,
      value: oldValue,
      inputValue: initValue.title || initValue.address || '',
      isShowSearchView: false,
      isShowLabel: false,
      searchResults: [],
      selectedSelection: {}
    };
  }

  componentDidMount() {
    if (this.mapType !== MAP_TYPES.B_MAP) {
      this.setState({ isLoading: false });
      return;
    }
    if (!window.BMap) {
      window.renderBaiduMap = () => this.renderBaiduMap();
      loadMapSource(this.mapType, this.mapKey);
      return;
    }
    this.renderBaiduMap();
  }

  componentWillUnmount() {
    let center = {};
    if (!this.map) return;
    center.zoom = this.map.getZoom();
    const coordinate = this.map.getCenter();
    center.lng = coordinate.lng;
    center.lat = coordinate.lat;
    this.mineMapMarker = null;
    localStorage.setItem('geolocation-map-center', JSON.stringify(center));
    this.map = null;
  }

  addMarkerByPosition = (value) => {
    const { lngLat } = value;
    let point = new window.BMap.Point(lngLat.lng, lngLat.lat);
    const marker = new window.BMap.Marker(point, { offset: new window.BMap.Size(-2, -5) });
    if (this.map) {
      this.map.clearOverlays();
      this.map.addOverlay(marker);
      this.map.centerAndZoom(point, 10);
    }
  };

  realTimePositioning = (error, point) => {
    if (error) {
      toaster.danger(getLocale('Positioning_failed'));
      return;
    }
    const geoCoder = new window.BMap.Geocoder();
    let value = {};
    geoCoder.getLocation(point, (result) => {
      const { surroundingPois, address, point } = result;
      if (surroundingPois.length === 0) {
        value.address = address;
        value.lngLat = { lng: point.lng, lat: point.lat };
        value.tag = [];
        value.title = '';
      } else {
        const position = surroundingPois[0];
        const { address, title, tags, point } = position;
        value.address = address || '';
        value.title = title || '';
        value.tag = tags || [];
        value.lngLat = { lng: point.lng, lat: point.lat };
      }
      this.setState({ isShowLabel: true, selectedSelection: value, inputValue: value.title || value.address });
      this.addMarkerByPosition(value);
    });
  };

  renderBaiduMap = () => {
    this.setState({ isLoading: false }, () => {
      if (!window.BMap.Map) return;
      setTimeout(() => {
        this.map = new window.BMap.Map('dtable-ui-mobile-geolocation-map-container');
        let { lng, lat, zoom } = getInitCenter();
        const { value } = this.state;
        const { lngLat } = value;
        if (isValidPosition(lngLat.lng, lngLat.lat)) {
          lng = lngLat.lng;
          lat = lngLat.lat;
          this.setState({ isShowLabel: true, selectedSelection: value });
          this.addMarkerByPosition(value);
        }
        let point = new window.BMap.Point(lng, lat);
        this.map.centerAndZoom(point, zoom);
        this.map.enableScrollWheelZoom(true);
        // normal map selection
        this.canSelectPosition && this.map.addEventListener('click', (event) => {
          let value = {};
          const point = event.point;
          const geoCoder = new window.BMap.Geocoder();
          geoCoder.getLocation(point, (result) => {
            const { surroundingPois, address, point } = result;
            if (surroundingPois.length === 0) {
              value.address = address;
              value.lngLat = { lng: point.lng, lat: point.lat };
              value.tag = [];
              value.title = '';
            } else {
              const position = surroundingPois[0];
              const { address, title, tags, point } = position;
              value.address = address || '';
              value.title = title || '';
              value.tag = tags || [];
              value.lngLat = { lng: point.lng, lat: point.lat };
            }
            this.setState({ isShowLabel: true, selectedSelection: value, inputValue: value.title || value.address });
            this.addMarkerByPosition(value);
          });
        });
        // for mobile device real-time positioning, use current position
        !this.canSelectPosition && locateCurrentPosition(this.map, this.mapType, this.realTimePositioning);
      }, 1);
    });
  };

  geolocationCallback = (error, point) => {
    if (error) {
      toaster.danger(getLocale('Positioning_failed'));
      return;
    }
    const geoCoder = new window.BMap.Geocoder();
    geoCoder.getLocation(point, (result) => {
      let value = {};
      const { surroundingPois, address, point } = result;
      if (surroundingPois.length === 0) {
        value.address = address;
        value.lngLat = { lng: point.lng, lat: point.lat };
        value.tag = [];
        value.title = '';
      } else {
        const position = surroundingPois[0];
        const { address, title, tags, point } = position;
        value.address = address || '';
        value.title = title || '';
        value.tag = tags || [];
        value.lngLat = { lng: point.lng, lat: point.lat };
      }
      this.setState({ isShowLabel: true, selectedSelection: value });
      this.addMarkerByPosition(value);
    });
  };

  isEmptySelection = (value) => {
    return !value.title && !value.address && !value.tag && isEmptyObject(value.lngLat);
  };

  clearSearchNumerical = () => {
    this.setState({ inputValue: '', value: {} });
  };

  onChange = (inputValue) => {
    this.setState({ inputValue });
  };

  onZoomIn = () => {
    if (!this.map) return;
    const currentZoom = this.map.getZoom();
    this.map.setZoom(currentZoom + 1);
  };

  onZoomOut = () => {
    if (!this.map) return;
    const currentZoom = this.map.getZoom();
    this.map.setZoom(currentZoom - 1);
  };

  onLocateCurrentPosition = () => {
    locateCurrentPosition(this.map, this.mapType, this.geolocationCallback);
  };

  onClickSelection = (result) => {
    this.setState({
      searchResults: [],
      inputValue: result.title || result.address,
      selectedSelection: result,
      isShowSearchView: false,
      isShowLabel: true
    }, () => {
      this.addMarkerByPosition(result);
    });
  };

  onCommit = () => {
    const { value } = this.state;
    const isEmptyMapSelection = this.isEmptySelection(value);
    this.props.onCommit(isEmptyMapSelection ? '' : value);
  };

  onClose = () => {
    this.props.onToggle();
  };

  onFillIn = () => {
    const { selectedSelection } = this.state;
    this.setState({ value: selectedSelection, isShowLabel: false }, () => {
      toaster.success(getLocale('Successfully_filled_in'));
      this.onCommit();
    });
  };

  onCloseLabel = (e) => {
    e.stopPropagation();
    this.map.clearOverlays();
    this.setState({ isShowLabel: false, selectedSelection: {}, inputValue: '' });
  };

  onSearch = (e) => {
    e.stopPropagation();
    const { inputValue } = this.state;
    if (!inputValue) return;
    const options = {
      onSearchComplete: (results) => {
        const status = local.getStatus();
        if (status !== window.BMAP_STATUS_SUCCESS) {
          toaster.danger(getLocale('Search_failed_please_enter_detailed_address'));
          return;
        }
        let searchResults = [];
        for (let i = 0; i < results.getCurrentNumPois(); i++) {
          const value = results.getPoi(i);
          let position = {};
          position.address = value.address || '';
          position.title = value.title || '';
          position.tag = value.tags || [];
          position.lngLat = { lng: value.point.lng, lat: value.point.lat };
          searchResults.push(position);
        }
        this.setState({ searchResults, isShowSearchView: true, isShowLabel: false });
      }
    };
    let local = new window.BMap.LocalSearch(this.map, options);
    local.search(inputValue);
  };

  renderSearchResult = () => {
    const { searchResults } = this.state;
    if (searchResults.length === 0) return null;
    return (
      <div className="dtable-ui-mobile-map-selection-editor-search-results">
        {searchResults.map((result, index) => {
          return (
            <div className="dtable-ui-mobile-map-selection-editor-search-result" key={index} onClick={this.onClickSelection.bind(this, result)}>
              <span className="dtable-ui-mobile-map-selection-editor-search-result-title">{result.title || ''}</span>
              <span className="dtable-ui-mobile-map-selection-editor-search-result-address">{result.address || ''}</span>
            </div>
          );
        })}
      </div>
    );
  };

  renderLabel = () => {
    const { selectedSelection } = this.state;
    const { address, title, tag } = selectedSelection;
    const tagContent = Array.isArray(tag) && tag.length > 0 ? tag[0] : '';
    if (title) {
      return (
        <div className="dtable-ui-mobile-geolocation-map-editor-label">
          <span className="dtable-ui-mobile-geolocation-map-editor-label-title" title={title}>{title}</span>
          {tagContent && <span className="dtable-ui-mobile-geolocation-map-editor-label-tag">{tagContent}</span>}
          <span className="dtable-font dtable-icon-x" onClick={this.onCloseLabel}></span>
          <span className="dtable-ui-mobile-geolocation-map-editor-label-address-tip">{getLocale('Address')}</span>
          <span className="dtable-ui-mobile-geolocation-map-editor-label-address" title={address}>{address}</span>
          <Button className="dtable-ui-mobile-geolocation-map-editor-label-btn" color="primary" size="sm" onClick={this.onFillIn}>{getLocale('Fill_in')}</Button>
        </div>
      );
    }
    return (
      <div className="dtable-ui-mobile-geolocation-map-editor-label simple">
        <span className="dtable-font dtable-icon-x" onClick={this.onCloseLabel}></span>
        <span className="dtable-ui-mobile-geolocation-map-editor-label-address text-truncate simple" title={address}>{address}</span>
        <Button className="dtable-ui-mobile-geolocation-map-editor-label-btn simple" color="primary" size="sm" onClick={this.onFillIn}>{getLocale('Fill_in')}</Button>
      </div>
    );
  };

  renderMap = () => {
    const { isLoading, inputValue, isShowSearchView, isShowLabel } = this.state;
    if (isLoading) return (<div className="w-100 h-100 d-flex align-items-center justify-content-center"><Loading /></div>);
    if (!this.mapType) {
      return (
        <div className="dtable-ui-geolocation-map-editor-error-message d-flex justify-content-center  align-items-center w-100 h-100">
          <span className="alert-danger">{getLocale('The_map_plugin_is_not_properly_configured_contact_the_administrator')}</span>
        </div>
      );
    }
    if (this.mapType !== MAP_TYPES.B_MAP) {
      return (
        <div className="dtable-ui-geolocation-map-editor-error-message d-flex justify-content-center  align-items-center w-100 h-100">
          <span className="alert-danger">{getLocale('This_map_type_currently_does_not_support_map_point_selection')}</span>
        </div>
      );
    }
    return (
      <>
        {this.canSelectPosition && (
          <div className="dtable-ui-mobile-geolocation-map-editor-input-container">
            <InputItem
              type="text"
              className="dtable-ui-mobile-geolocation-map-editor-input"
              style={{ marginTop: 0 }}
              value={inputValue}
              onChange={this.onChange}
              clear={true}
              placeholder={getLocale('Please_enter_the_address')}
            />
            <div className="dtable-ui-mobile-geolocation-map-editor-search-btn" onClick={this.onSearch}>
              <i className="dtable-font dtable-icon-search"></i>
            </div>
          </div>
        )}
        <div className="dtable-ui-mobile-geolocation-map-editor-map">
          <div className="w-100 h-100" ref={ref => this.ref = ref} id="dtable-ui-mobile-geolocation-map-container"></div>
          <div className="dtable-ui-geolocation-map-controller">
            <div className="dtable-ui-geolocation-locate-control" onClick={this.onLocateCurrentPosition}>
              <i className="dtable-font dtable-icon-current-location"></i>
            </div>
            <div className="dtable-ui-geolocation-zoom-control">
              <div className="dtable-ui-geolocation-zoom-control-btn" onClick={this.onZoomIn}>
                <i aria-hidden="true" className="dtable-font dtable-icon-enlarge"></i>
              </div>
              <div className="dtable-ui-geolocation-zoom-control-btn" onClick={this.onZoomOut}>
                <i aria-hidden="true" className="dtable-font dtable-icon-narrow"></i>
              </div>
            </div>
          </div>
          {isShowSearchView && this.renderSearchResult()}
        </div>
        {isShowLabel && this.renderLabel()}
      </>
    );
  };

  render() {
    const { column } = this.props;

    return (
      <MobileFullScreenPage className="dtable-ui-mobile-geolocation-map-selection-editor" onClose={this.onClose}>
        <Header onLeftClick={this.onClose}>
          <i className="dtable-font dtable-icon-return"></i>
          <>{column.name}</>
        </Header>
        <Body>
          {this.renderMap()}
        </Body>
      </MobileFullScreenPage>
    );
  }
}

MapSelectionEditor.propTypes = {
  column: PropTypes.object,
  value: PropTypes.object,
  onToggle: PropTypes.func,
  onCommit: PropTypes.func,
};

export default MapSelectionEditor;
