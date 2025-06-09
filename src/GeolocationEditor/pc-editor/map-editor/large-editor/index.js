import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'reactstrap';
import { isNumber } from 'dtable-utils';
import toaster from '../../../../toaster';
import Loading from '../../../../Loading';
import { KeyCodes } from '../../../../constants';
import { isValidPosition } from '../../../../utils/cell';
import {
  DOMESTIC_MAP_TYPE, MAP_TYPES, getInitCenter, loadMapSource,
  getMapInfo, locateCurrentPosition, getMineMapUrl
} from '../../../map-editor-utils';
import { getLocale } from '../../../../lang';

import './index.css';

const propTypes = {
  column: PropTypes.object,
  value: PropTypes.object,
  row: PropTypes.object,
  setValue: PropTypes.func,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  toggleFullScreen: PropTypes.func,
};

class LargeMapEditorDialog extends React.Component {

  constructor(props) {
    super(props);
    const { readOnly, config } = props;
    const value = props.value || { lng: '', lat: '' };
    this.readOnly = readOnly;
    const { mapType, mapKey } = getMapInfo(config);
    this.mapType = mapType;
    this.mapKey = mapKey;
    this.map = null;
    this.state = {
      isLoading: true,
      value,
    };
  }

  componentDidMount() {
    if (this.mapType === MAP_TYPES.B_MAP) {
      if (!window.BMap) {
        window.renderBaiduMap = () => this.renderBaiduMap();
        loadMapSource(this.mapType, this.mapKey);
      } else {
        this.renderBaiduMap();
      }
      return;
    } else if (this.mapType === MAP_TYPES.G_MAP) {
      if (!window.google) {
        window.renderGoogleMap = () => this.renderGoogleMap();
        loadMapSource(this.mapType, this.mapKey);
      } else {
        this.renderGoogleMap();
      }
      return;
    } else if (this.mapType === MAP_TYPES.M_MAP) {
      if (!window.minemap) {
        loadMapSource(this.mapType, this.mapKey, this.loadMineMapCallBack);
      } else {
        this.renderMineMap();
      }
      return;
    }
  }

  componentWillUnmount() {
    let center = {};
    if (this.map && DOMESTIC_MAP_TYPE.includes(this.mapType)) {
      center.zoom = this.map.getZoom();
      let coordinate = this.map.getCenter();
      center.lng = coordinate.lng;
      center.lat = coordinate.lat;
      this.mineMapMarker = null;
    } else if (this.map && this.mapType === MAP_TYPES.G_MAP) {
      let zoom = this.map.getZoom();
      let coordinate = this.map.getCenter();
      center.zoom = zoom;
      center.lat = coordinate.lat();
      center.lng = coordinate.lng();
      this.googleMarker = null;
    }
    localStorage.setItem('geolocation-map-center', JSON.stringify(center));
    this.map = null;
  }

  loadMineMapCallBack = () => {
    if (!this.timer) {
      this.timer = setTimeout(() => {
        const { domainUrl, dataDomainUrl, serverDomainUrl, spriteUrl, serviceUrl } = getMineMapUrl();
        window.minemap.domainUrl = domainUrl;
        window.minemap.dataDomainUrl = dataDomainUrl;
        window.minemap.serverDomainUrl = serverDomainUrl;
        window.minemap.spriteUrl = spriteUrl;
        window.minemap.serviceUrl = serviceUrl;
        window.minemap.key = this.mapKey;
        window.minemap.solution = 11001;
        this.renderMineMap();
        clearTimeout(this.timer);
        this.timer = null;
      }, 1000);
    }
  };

  renderMineMap = () => {
    this.setState({ isLoading: false }, () => {
      if (!window.minemap.key) return;
      this.map = new window.minemap.Map({
        container: 'geolocation-map-container-large',
        style: 'https://service.minedata.cn/map/solu/style/11001',
        pitch: 0,
        maxZoom: 17,
        minZoom: 3,
        projection: 'MERCATOR'
      });
      let { lng, lat, zoom } = getInitCenter();
      const { value } = this.state;
      if (isValidPosition(value.lng, value.lat)) {
        lng = value.lng;
        lat = value.lat;
        this.addMarkerByPosition(lng, lat);
      }
      this.map.setCenter([lng, lat]);
      this.map.setZoom(zoom);
      if (this.readOnly) return;
      this.map.on('click', (event) => {
        const point = event.lngLat;
        this.setValue(point);
        this.addMarkerByPosition(point.lng, point.lat);
      });
    });
  };

  renderBaiduMap = () => {
    this.setState({ isLoading: false }, () => {
      if (!window.BMap.Map) return;
      this.map = new window.BMap.Map('geolocation-map-container-large');
      let { lng, lat, zoom } = getInitCenter();
      const { value } = this.state;
      if (isValidPosition(value.lng, value.lat)) {
        lng = value.lng;
        lat = value.lat;
        this.addMarkerByPosition(lng, lat);
      }
      let point = new window.BMap.Point(lng, lat);
      this.map.centerAndZoom(point, zoom);
      this.map.enableScrollWheelZoom(true);
      if (this.readOnly) return;
      this.map.addEventListener('click', (event) => {
        const point = event.point;
        this.setValue(point);
        this.addMarkerByPosition(point.lng, point.lat);
      });
    });
  };

  renderGoogleMap = () => {
    this.setState({ isLoading: false }, () => {
      let { lng, lat, zoom } = getInitCenter();
      this.map = new window.google.maps.Map(this.ref, {
        zoom,
        center: { lng, lat },
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false
      });
      const { value } = this.state;
      if (value.lng && value.lat) {
        lng = value.lng;
        lat = value.lat;
        this.addMarkerByPosition(lng, lat);
      }
      this.map.setCenter({ lng, lat });
      this.map.addListener('click', (event) => {
        const lng = event.latLng.lng();
        const lat = event.latLng.lat();
        const point = { lng, lat };
        this.setValue(point);
        this.addMarkerByPosition(lng, lat);
      });
    });
  };

  geolocationCallback = (error, point) => {
    if (!error) {
      this.setValue({ ...point });
      this.addMarkerByPosition(point.lng, point.lat);
      if (this.mapType === MAP_TYPES.G_MAP) {
        this.map.setCenter({ lng: point.lng, lat: point.lat });
      }
    } else {
      toaster.danger(getLocale('Positioning_failed'));
    }
  };

  getNumericValue = (value) => {
    const { lng, lat } = value || {};
    const numLng = typeof lng === 'string' ? parseFloat(lng.trim()) : lng;
    const numLat = typeof lat === 'string' ? parseFloat(lat.trim()) : lat;
    return { lng: numLng, lat: numLat };
  };

  setPropsValue = ({ lng, lat }) => {
    if (!isNumber(lng) || !isNumber(lat)) {
      this.props.setValue(null);
      return;
    }
    this.props.setValue({ lng, lat });
  };

  setValue = (point) => {
    const value = point ? {
      lng: point.lng,
      lat: point.lat
    } : null;
    this.setState({ value }, () => {
      const numericValue = this.getNumericValue(this.state.value);
      this.setPropsValue(numericValue);
    });
  };

  addMarkerByPosition = (lng, lat) => {
    if (this.mapType === MAP_TYPES.B_MAP) {
      let point = new window.BMap.Point(lng, lat);
      const marker = new window.BMap.Marker(point, { offset: new window.BMap.Size(-2, -5) });
      this.map && this.map.clearOverlays();
      this.map && this.map.addOverlay(marker);
    } else if (this.mapType === MAP_TYPES.G_MAP) {
      if (!this.googleMarker) {
        this.googleMarker = new window.google.maps.Marker({
          position: { lng, lat },
          map: this.map,
        });
        return;
      }
      this.googleMarker.setPosition({ lng, lat });
    } else if (this.mapType === MAP_TYPES.M_MAP) {
      if (!this.mineMapMarker) {
        this.mineMapMarker = new window.minemap.Marker({
          draggable: false,
          anchor: 'top-left',
          color: 'red',
          rotation: 0,
          pitchAlignment: 'map',
          rotationAlignment: 'map',
          scale: 0.8
        }).setLngLat({ lng, lat }).addTo(this.map);
      } else {
        this.mineMapMarker.setLngLat({ lng, lat });
      }
    }
  };

  rerenderMapMarker = ({ lng, lat }) => {
    if (!isNumber(lng) || !isNumber(lat)) return;
    if (this.map) {
      if (this.mapType === MAP_TYPES.G_MAP || this.mapType === MAP_TYPES.M_MAP) {
        this.map.setCenter({ lng, lat });
      } else {
        this.map.setCenter(new window.BMap.Point(lng, lat));
      }
    }
    this.addMarkerByPosition(lng, lat);
  };

  onChangeLatitude = (event) => {
    this.setState({
      value: {
        ...this.state.value,
        lat: event.target.value,
      }
    }, () => {
      const numericValue = this.getNumericValue(this.state.value);
      this.setPropsValue(numericValue);
      this.rerenderMapMarker(numericValue);
    });
  };

  onChangeLongitude = (event) => {
    this.setState({
      value: {
        ...this.state.value,
        lng: event.target.value,
      }
    }, () => {
      const numericValue = this.getNumericValue(this.state.value);
      this.setPropsValue(numericValue);
      this.rerenderMapMarker(numericValue);
    });
  };

  onKeyDown = (event) => {
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    if (event.keyCode === KeyCodes.Enter) {
      this.onSubmit();
    }
  };

  onSubmit = () => {
    const { value } = this.state;
    this.props.setValue(value);
    this.props.onSubmit();
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

  toggle = (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    const { value } = this.state;
    this.props.setValue(value);
    this.props.toggleFullScreen(event);
  };

  // Because GeolocationItem component add a click event to document, so we need to stop propagation
  handlerClick = (e) => {
    e.nativeEvent.stopImmediatePropagation();
    e.stopPropagation();
  };

  render() {
    const { isLoading, value } = this.state;
    const lat = value ? value.lat : '';
    const lng = value ? value.lng : '';

    return (
      <Modal
        size="lg"
        isOpen={true}
        toggle={this.toggle}
        className="dtable-ui-large-map-editor-dialog"
      >
        <div className="dtable-ui-geolocation-map-editor-header" onClick={this.handlerClick}>
          <div className="dtable-ui-geolocation-map-editor-logo">
            <span className="dtable-font dtable-icon-location"></span>
            <span className="ml-2 dtable-ui-geolocation-map-editor-title">{getLocale('Address')}</span>
          </div>
          <span className="dtable-ui-geolocation-map-editor-screen dtable-font dtable-icon-full-screen" onClick={this.toggle}></span>
        </div>
        <div className="dtable-ui-geolocation-map-editor-large" onClick={this.handlerClick}>
          {!this.readOnly && (
            <div className="dtable-ui-geolocation-map-lng-lat-editor-header">
              <div className="dtable-ui-geolocation-map-lng-lat-input-container dtable-ui-geolocation-map-lat-input-container">
                <div className="dtable-ui-geolocation-map-lng-lat-input-label">
                  <span>{getLocale('Latitude_abbr')}</span>
                </div>
                <input
                  type="text"
                  value={lat}
                  onChange={this.onChangeLatitude}
                  onKeyDown={this.onKeyDown}
                  className="form-control"
                  placeholder={getLocale('Enter_latitude')}
                  autoFocus
                />
              </div>
              <div className="dtable-ui-geolocation-map-lng-lat-input-container dtable-ui-geolocation-map-lng-input-container">
                <div className="dtable-ui-geolocation-map-lng-lat-input-label">
                  <span>{getLocale('Longitude_abbr')}</span>
                </div>
                <input
                  type="text"
                  value={lng}
                  onChange={this.onChangeLongitude}
                  onKeyDown={this.onKeyDown}
                  className="form-control"
                  placeholder={getLocale('Enter_longitude')}
                />
              </div>
            </div>
          )}
          <div className={this.readOnly ? 'geolocation-map-read-only-container' : 'geolocation-map-container-large'}>
            {(this.mapType && isLoading) && <Loading />}
            {(!this.mapType) && (
              <div className="dtable-ui-geolocation-map-editor-error-message d-flex justify-content-center mt-9">
                <span className="alert-danger">{getLocale('The_map_plugin_is_not_properly_configured_contact_the_administrator')}</span>
              </div>
            )}
            {(!isLoading && this.mapType) && <div className='w-100 h-100' ref={ref => this.ref = ref} id="geolocation-map-container-large"></div>}
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
        </div>
      </Modal>
    );
  }
}

LargeMapEditorDialog.propTypes = propTypes;

export default LargeMapEditorDialog;
