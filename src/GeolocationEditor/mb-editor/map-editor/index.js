import React from 'react';
import PropTypes from 'prop-types';
import { isNumber, getGeolocationFormattedPoint } from 'dtable-utils';
import InputItem from '../../../InputItem';
import toaster from '../../../toaster';
import MobileFullScreenPage from '../../../MobileFullScreenPage';
import { DOMESTIC_MAP_TYPE, MAP_TYPES, getInitCenter, loadMapSource, getMapInfo, locateCurrentPosition, getMineMapUrl } from '../../map-editor-utils';
import { isValidPosition } from '../../../utils/cell';
import { getLocale } from '../../../lang';
import Loading from '../../../Loading';
import ObjectUtils from '../../../utils/object-utils';

import './index.css';

const { Header, Body } = MobileFullScreenPage;

class MapEditor extends React.Component {

  constructor(props) {
    super(props);
    const value = props.value || { lng: '', lat: '' };
    const { mapType, mapKey } = getMapInfo(props.config);
    this.mapType = mapType;
    this.mapKey = mapKey;
    this.map = null;
    const { lng, lat } = value;
    this.state = {
      mode: isValidPosition(lng, lat) ? 'preview' : 'edit',
      isLoading: true,
      value: value,
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
    }
    if (this.mapType === MAP_TYPES.G_MAP) {
      if (!window.google) {
        window.renderGoogleMap = () => this.renderGoogleMap();
        loadMapSource(this.mapType, this.mapKey);
      } else {
        this.renderGoogleMap();
      }
      return;
    }
    if (this.mapType === MAP_TYPES.M_MAP) {
      if (!window.minemap) {
        loadMapSource(this.mapType, this.mapKey, this.loadMineMapCallBack);
      } else {
        this.renderMineMap();
      }
      return;
    }
    this.setState({ isLoading: false });
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
      setTimeout(() => {
        this.map = new window.minemap.Map({
          container: 'dtable-ui-mobile-geolocation-map-container',
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
        this.map.on('mousedown', (event) => {
          const point = getGeolocationFormattedPoint(event.lngLat);
          this.setValue(point);
          this.addMarkerByPosition(point.lng, point.lat);
        });
      }, 1);
    });
  };

  renderBaiduMap = () => {
    this.setState({ isLoading: false }, () => {
      if (!window.BMap.Map) return;
      setTimeout(() => {
        this.map = new window.BMap.Map('dtable-ui-mobile-geolocation-map-container');
        let { lng, lat, zoom } = getInitCenter();
        const { value } = this.state;
        if (isValidPosition(value.lng, value.lat)) {
          lng = value.lng;
          lat = value.lat;
          this.addMarkerByPosition(lng, lat);
        }
        const point = new window.BMap.Point(lng, lat);
        this.map.centerAndZoom(point, zoom);
        this.map.enableScrollWheelZoom(true);
        this.map.addEventListener('click', (event) => {
          if (this.state.mode === 'preview') return;
          const point = getGeolocationFormattedPoint(event.point);
          this.setValue(point);
          this.addMarkerByPosition(point.lng, point.lat);
        });
      }, 1);
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

  renderGoogleMap = () => {
    this.setState({ isLoading: false }, () => {
      setTimeout(() => {
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
        this.map.addListener('mousedown', (event) => {
          const lng = event.latLng.lng();
          const lat = event.latLng.lat();
          const point = getGeolocationFormattedPoint({ lng, lat });
          this.setValue(point);
          this.addMarkerByPosition(lng, lat);
        });
      }, 1);
    });
  };

  setValue = (point) => {
    this.setState({
      value: {
        lng: point.lng,
        lat: point.lat
      }
    });
  };

  addMarkerByPosition = (lng, lat) => {
    if (this.mapType === MAP_TYPES.B_MAP) {
      let point = new window.BMap.Point(lng, lat);
      const marker = new window.BMap.Marker(point, { offset: new window.BMap.Size(-2, -5) });
      this.map && this.map.clearOverlays();
      this.map && this.map.addOverlay(marker);
      return;
    }
    if (this.mapType === MAP_TYPES.G_MAP) {
      if (!this.googleMarker) {
        this.googleMarker = new window.google.maps.Marker({
          position: { lng, lat },
          map: this.map,
        });
        return;
      }
      this.googleMarker.setPosition({ lng, lat });
      this.googleMarker.setMap(this.map);
      return;
    }
    if (this.mapType === MAP_TYPES.M_MAP) {
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
      return;
    }
  };

  clearSearchNumerical = () => {
    this.setState({ inputValue: '', value: {} });
  };

  onSubmit = () => {
    const { value } = this.state;
    if (!ObjectUtils.isSameObject(value, this.props.value)) {
      this.props.onCommit(value);
    }

    const { lng, lat } = getGeolocationFormattedPoint(value);
    const newValue = !isNumber(lng) || !isNumber(lat) ? null : value;
    this.props.onCommit(newValue);
    this.onClose();
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

  onLeftClick = () => {
    if (this.state.mode === 'preview') {
      this.onClose();
      return;
    }
    this.setState({ mode: 'preview' });
  };

  onRightClick = () => {
    if (this.state.mode === 'preview') {
      this.setState({ mode: 'edit' });
      return;
    }
    this.onSubmit();
  };

  onClose = () => {
    this.props.onToggle();
  };

  handleLatitudeChange = (value) => {
    this.setState({
      value: {
        ...this.state.value,
        lat: value,
      }
    }, () => {
      const numericValue = getGeolocationFormattedPoint(this.state.value);
      this.rerenderMapMarker(numericValue);
    });
  };

  handleLongitudeChange = (value) => {
    this.setState({
      value: {
        ...this.state.value,
        lng: value,
      }
    }, () => {
      const numericValue = getGeolocationFormattedPoint(this.state.value);
      this.rerenderMapMarker(numericValue);
    });
  };

  rerenderMapMarker = ({ lng, lat }) => {
    if (!isNumber(lng) || !isNumber(lat)) {
      return;
    }
    if (this.map) {
      if (this.mapType === MAP_TYPES.G_MAP || this.mapType === MAP_TYPES.M_MAP) {
        this.map.setCenter({ lng, lat });
      } else {
        this.map.setCenter(new window.BMap.Point(lng, lat));
      }
    }
    this.addMarkerByPosition(lng, lat);
  };

  renderMap = () => {
    const { isLoading, mode, value } = this.state;
    if (isLoading) return (<div className="w-100 h-100 d-flex align-items-center justify-content-center"><Loading /></div>);
    if (!this.mapType) {
      return (
        <div className="dtable-ui-geolocation-map-editor-error-message d-flex justify-content-center  align-items-center w-100 h-100">
          <span className="alert-danger">{getLocale('The_map_plugin_is_not_properly_configured_contact_the_administrator')}</span>
        </div>
      );
    }
    const isEdit = mode === 'edit';
    const { lat, lng } = value;
    return (
      <>
        <div className="dtable-ui-mobile-geolocation-map-editor-input-container">
          <div className="view-subtitle">
            <span>{getLocale('Latitude_abbr')}</span>
          </div>
          <InputItem
            type="text"
            className="dtable-ui-mobile-geolocation-map-editor-input"
            style={{ marginTop: 0 }}
            value={lat}
            editable={isEdit}
            onChange={this.handleLatitudeChange}
            placeholder={getLocale('Enter_latitude')}
          />
          <div className="view-subtitle">
            <span>{getLocale('Longitude_abbr')}</span>
          </div>
          <InputItem
            type="text"
            className="dtable-ui-mobile-geolocation-map-editor-input"
            style={{ marginTop: 0 }}
            value={lng}
            editable={isEdit}
            onChange={this.handleLongitudeChange}
            placeholder={getLocale('Enter_longitude')}
          />
        </div>
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
        </div>
      </>
    );
  };

  render() {
    const { column } = this.props;
    const { mode } = this.state;
    const isEdit = mode === 'edit';

    return (
      <MobileFullScreenPage className="dtable-ui-mobile-geolocation-map-editor" onClose={this.onClose}>
        <Header onLeftClick={this.onLeftClick} onRightClick={this.onRightClick}>
          <>{isEdit ? getLocale('Cancel') : getLocale('Close')}</>
          <>{column.name}</>
          <span style={{ color: '#f09f3f' }}>{isEdit ? getLocale('Submit') : getLocale('Edit')}</span>
        </Header>
        <Body>
          {this.renderMap()}
        </Body>
      </MobileFullScreenPage>
    );
  }
}

MapEditor.propTypes = {
  column: PropTypes.object,
  value: PropTypes.object,
  onToggle: PropTypes.func,
  onCommit: PropTypes.func,
};

export default MapEditor;
