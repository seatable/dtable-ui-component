import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { isEmptyObject } from 'dtable-utils';
import toaster from '../../../toaster';
import Loading from '../../../Loading';
import { KeyCodes } from '../../../constants';
import { isValidPosition } from '../../../utils/cell';
import { getMapInfo, MAP_TYPES, loadMapSource, getInitCenter, locateCurrentPosition } from '../../map-editor-utils';
import LargeMapSelectionEditorDialog from './large-editor';
import { getLocale } from '../../../lang';

const propTypes = {
  column: PropTypes.object,
  value: PropTypes.object,
  setValue: PropTypes.func,
  onSubmit: PropTypes.func,
  toggleLargeMap: PropTypes.func,
  onCancel: PropTypes.func,
};

class MapSelectionEditor extends Component {

  constructor(props) {
    super(props);
    const value = this.getInitValue();
    this.readOnly = props.readOnly;
    const inputValue = value.title || value.address || '';
    const { mapType, mapKey } = getMapInfo(props.config);
    this.state = {
      isLoading: true,
      value,
      inputValue,
      searchResults: [],
      isShowLargeEditor: false,
    };
    this.mapType = mapType;
    this.mapKey = mapKey;
    this.map = null;
  }

  componentDidMount() {
    if (this.mapType === MAP_TYPES.B_MAP) {
      if (!window.BMap) {
        window.renderBaiduMap = () => this.renderBaiduMap();
        loadMapSource(this.mapType, this.mapKey);
      } else {
        this.renderBaiduMap();
      }
      window.onSubmitSelection = this.onSubmitSelection;
      return;
    }
  }

  componentWillUnmount() {
    if (this.mapType === MAP_TYPES.B_MAP) {
      let center = {};
      center.zoom = this.map.getZoom();
      let coordinate = this.map.getCenter();
      center.lng = coordinate.lng;
      center.lat = coordinate.lat;
      localStorage.setItem('geolocation-map-selection-center', JSON.stringify(center));
      this.props.toggleLargeMap && this.props.toggleLargeMap(false);
      this.map = null;
      window.onSubmitSelection = null;
    }
  }

  renderBaiduMap = () => {
    this.setState({ isLoading: false }, () => {
      if (!window.BMap.Map) return;
      this.map = new window.BMap.Map('geolocation-map-selection-container', { enableMapClick: false });
      let { lng, lat, zoom } = getInitCenter(true);
      const { value } = this.state;
      const { lngLat } = value;
      if (isValidPosition(lngLat.lng, lngLat.lat)) {
        lng = lngLat.lng;
        lat = lngLat.lat;
        this.addMarkerByPosition(value);
      }
      let point = new window.BMap.Point(lng, lat);
      this.map.centerAndZoom(point, zoom);
      this.map.enableScrollWheelZoom(true);
      if (this.readOnly) return;
      this.map.addEventListener('mousedown', (event) => {
        if (this.state.searchResults.length > 0) {
          this.setState({ searchResults: [] });
          return;
        }
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
          this.addMarkerByPosition(value);
        });
      });
    });
  };

  addMarkerByPosition = (value) => {
    const { lngLat } = value;
    let point = new window.BMap.Point(lngLat.lng, lngLat.lat);
    const marker = new window.BMap.Marker(point, { offset: new window.BMap.Size(-2, -5) });
    if (this.map) {
      this.map.clearOverlays();
      const content = this.getLabelContent(value);
      const translateY = value.title ? '30%' : '45%';
      const label = new window.BMap.Label(content, { offset: new window.BMap.Size(9, -5) });
      label.setStyle({
        display: 'block',
        border: 'none',
        backgroundColor: '#ffffff',
        boxShadow: '1px 2px 1px rgba(0,0,0,.15)',
        padding: '3px 10px',
        transform: `translate(-50%, ${translateY})`,
        borderRadius: '3px',
        fontWeight: '500',
        left: '7px'
      });
      marker.setLabel(label);
      this.map.addOverlay(marker);
      this.map.centerAndZoom(point, 10);
      this.addLabelEventListener(marker, value);
    }
  };

  addLabelEventListener = (marker, value) => {
    if (this.map) {
      setTimeout(() => {
        const label = document.getElementById('dtable-ui-selection-label-content');
        label.addEventListener('mousedown', (e) => {
          e.stopPropagation();
        });
        const closeElement = document.getElementById('selection-label-close');
        closeElement.addEventListener('mousedown', (e) => {
          e.stopPropagation();
          marker.getLabel().remove();
          this.map.clearOverlays();
        });
        const submitElement = document.getElementById('selection-label-submit');
        submitElement.addEventListener('mousedown', (e) => {
          e.stopPropagation();
          // submit value
          this.props.setValue(value);
          this.props.onSubmit();
        });
      }, 10);
    }
  };

  getLabelContent = (value) => {
    const { address, title, tag } = value;
    const tagContent = Array.isArray(tag) && tag.length > 0 ? tag[0] : '';
    if (title) {
      return (
        `
          <div class='dtable-ui-selection-label-content' id='dtable-ui-selection-label-content'>
            <i class='dtable-font dtable-icon-down3'></i>
            <span class='label-title text-truncate' title=${title}>${title}</span>
            ${tagContent && `<span class='label-tag'>${tagContent}</span>`}
            <span class='dtable-font dtable-icon-x' id='selection-label-close'></span>
            <span class='label-address-tip'>${getLocale('Address')}</span>
            <span class='label-address text-truncate' title=${address}>${address}</span>
            <div class='label-submit btn btn-primary' id='selection-label-submit'>${getLocale('Fill_in')}</div>
          </div>
        `
      );
    }
    return (
      `
        <div class='dtable-ui-selection-label-content simple' id='dtable-ui-selection-label-content'>
          <i class='dtable-font dtable-icon-down3'></i>
          <span class='dtable-font dtable-icon-x' id='selection-label-close'></span>
          <span class='label-address text-truncate simple' title=${address}>${address}</span>
          <div class='label-submit btn btn-primary' id='selection-label-submit'>${getLocale('Fill_in')}</div>
        </div>
      `
    );
  };

  getInitValue = () => {
    const { value } = this.props;
    if (!value || isEmptyObject(value)) {
      return { address: '', title: '', tag: '', lngLat: {} };
    }
    return value;
  };

  onSearch = () => {
    const { inputValue } = this.state;
    let options = {
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
        this.setState({ searchResults });
      }
    };
    let local = new window.BMap.LocalSearch(this.map, options);
    local.search(inputValue);
  };

  onChange = (e) => {
    const inputValue = e.target.value;
    this.setState({ inputValue });
  };

  onKeyDown = (event) => {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    if (event.keyCode === KeyCodes.Enter) {
      this.onSearch();
    } else if (event.keyCode === KeyCodes.Backspace) {
      this.setState({ searchResults: [] });
    }
  };

  onClickSelection = (result) => {
    this.setState({ searchResults: [] }, () => {
      this.addMarkerByPosition(result);
    });
  };

  toggleFullScreen = (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    const { value } = this.state;
    this.props.setValue(value);
    this.setState({ isShowLargeEditor: !this.state.isShowLargeEditor });
  };

  clearSearchNumerical = () => {
    this.setState({ inputValue: '', searchResults: [] });
  };

  geolocationCallback = (error, point) => {
    if (!error) {
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
        this.addMarkerByPosition(value);
      });
    } else {
      toaster.danger(getLocale('Positioning_failed'));
    }
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

  renderSearchResults = () => {
    const { searchResults } = this.state;
    if (searchResults.length === 0) return null;
    return (
      <div className='search-results-container'>
        {searchResults.map((result, index) => {
          return (
            <div className='search-result-item' key={index} onClick={this.onClickSelection.bind(this, result)}>
              <span className='search-result-item-title'>{result.title || ''}</span>
              <span className='search-result-item-address'>{result.address || ''}</span>
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    const { isLoading, inputValue, isShowLargeEditor } = this.state;

    if (isShowLargeEditor) {
      return (<LargeMapSelectionEditorDialog { ...this.props } toggleFullScreen={this.toggleFullScreen} />);
    }

    if (this.mapType === MAP_TYPES.G_MAP || this.mapType === MAP_TYPES.M_MAP) {
      return (
        <Fragment>
          <div className='dtable-ui-geolocation-map-editor-header'>
            <div className='dtable-ui-geolocation-map-editor-logo'>
              <span className='dtable-font dtable-icon-location'></span>
              <span className='ml-2 dtable-ui-geolocation-map-editor-title'>{getLocale('Address')}</span>
            </div>
          </div>
          <div className='dtable-ui-geolocation-map-editor no-support-tip'>
            {getLocale('This_map_type_currently_does_not_support_map_point_selection')}
          </div>
        </Fragment>
      );
    }

    return (
      <Fragment>
        <div className='dtable-ui-geolocation-map-editor-header'>
          <div className='dtable-ui-geolocation-map-editor-logo'>
            <span className='dtable-font dtable-icon-location'></span>
            <span className='ml-2 dtable-ui-geolocation-map-editor-title'>{getLocale('Address')}</span>
          </div>
          <span className='dtable-ui-geolocation-map-editor-screen dtable-font dtable-icon-full-screen' onClick={this.toggleFullScreen}></span>
        </div>
        <div className='dtable-ui-geolocation-map-editor selection-editor'>
          {!this.readOnly &&
            <div className="map-editor-header">
              <div className="search-tables-container d-flex">
                <input
                  type="text"
                  value={inputValue}
                  onKeyDown={this.onKeyDown}
                  onChange={this.onChange}
                  className='form-control search-tables-input selection-input'
                  placeholder={getLocale('Please_enter_the_address')}
                  autoFocus
                />
                {inputValue && <span className="clear-search-numerical dtable-font dtable-icon-x-" onClick={this.clearSearchNumerical}></span>}
                <span className="dtable-ui-geolocation-search-selection-editor" onClick={this.onSearch}>
                  <i className="dtable-font dtable-icon-search"></i>
                </span>
              </div>
            </div>
          }
          <div className={this.readOnly ? 'geolocation-map-selection-read-only-container' : 'geolocation-map-selection-container'}>
            {(this.mapType && isLoading) && <Loading />}
            {(!this.mapType) && (
              <div className="dtable-ui-geolocation-map-editor-error-message d-flex justify-content-center mt-9">
                <span className="alert-danger">{getLocale('The_map_plugin_is_not_properly_configured_contact_the_administrator')}</span>
              </div>
            )}
            {(!isLoading && this.mapType) && <div className="w-100 h-100" ref={ref => this.ref = ref} id="geolocation-map-selection-container"></div>}
          </div>
          <div className="geolocation-map-controller">
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
          {this.renderSearchResults()}
        </div>
      </Fragment>
    );
  }
}

MapSelectionEditor.propTypes = propTypes;

export default MapSelectionEditor;
