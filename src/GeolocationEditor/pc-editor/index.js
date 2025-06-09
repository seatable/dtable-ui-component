import React from 'react';
import PropTypes from 'prop-types';
import { GEOLOCATION_FORMAT, DEFAULT_GEOLOCATION_FORMAT } from 'dtable-utils';
import { KeyCodes } from '../../constants';
import ObjectUtils from '../../utils/object-utils';
import LocationEditor from './location-editor';
import MapEditor from './map-editor';
import MapSelectionEditor from './map-selection-editor';
import CountryEditor from './country-editor';
import ProvinceEditor from './province-editor';
import ProvinceCityEditor from './province-city-editor';

import './index.css';

class PCGeolocationEditor extends React.Component {

  constructor(props) {
    super(props);
    this.value = props.value || {};
    this.initValue = this.value;
    this.state = {
      editorPosition: null,
    };
    this.editor = null;
  }

  componentDidMount() {
    this.setEditorPosition();
    document.addEventListener('keydown', this.onHotKey, true);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onHotKey, true);
  }

  onHotKey = (e) => {
    if (e.keyCode === KeyCodes.Enter && e.target.tagName !== 'TEXTAREA') {
      this.onSubmit();
    } else if (e.keyCode === KeyCodes.Escape) {
      if (this.props.isInModal) {
        e.stopPropagation();
        this.onCancel();
      }
    }
  };

  getValue = () => {
    return this.value;
  };

  setValue = (value) => {
    this.value = value;
  };

  onSubmit = () => {
    if (ObjectUtils.isSameObject(this.initValue, this.value)) {
      this.onCancel();
      return;
    }
    this.props.onCommit(this.value);
  };

  onCancel = () => {
    this.props.onToggle && this.props.onToggle();
  };

  setEditorPosition = () => {
    const { isInModal } = this.props;
    const editorFormat = this.getGeoFormat();
    if (this.ref && (editorFormat === GEOLOCATION_FORMAT.COUNTRY_REGION || editorFormat === GEOLOCATION_FORMAT.PROVINCE)) {
      let height = 240;
      let width = 200;
      let left = this.ref.parentNode.getBoundingClientRect().x;
      let top = this.ref.parentNode.getBoundingClientRect().y;
      if (isInModal) {
        left = 220;
      }
      if (top + height > window.innerHeight) {
        top = window.innerHeight - height - 35;
      }
      this.setState({ editorPosition: { top, left, width, zIndex: 1000, position: 'fixed' } });
      return;
    }

    if (this.ref && editorFormat === GEOLOCATION_FORMAT.PROVINCE_CITY) {
      let height = 215;
      let width = 400;
      let left = this.ref.parentNode.getBoundingClientRect().x;
      let top = this.ref.parentNode.getBoundingClientRect().y;
      if (isInModal) {
        left = 220;
        if (top + height + 35 + 200 > window.innerHeight) {
          top = window.innerHeight - height - 235;
        }
      } else {
        if (top + height + 200 > window.innerHeight) {
          top = window.innerHeight - height - 200 - 5;
        }
        if (left + width > window.innerWidth) {
          left = window.innerWidth - width - 10;
        }
      }
      this.setState({ editorPosition: { top, left, width, zIndex: 1000, position: 'fixed' } });
      return;
    }
    if (this.ref) {
      const isMapTypeEditor = editorFormat === GEOLOCATION_FORMAT.LNG_LAT || editorFormat === GEOLOCATION_FORMAT.MAP_SELECTION;
      let width = isMapTypeEditor ? 500 : 400;
      let height = isMapTypeEditor ? 454 : 310;
      let geoEditorTop = 0;
      let geoEditorLeft = 0;
      if (isInModal) {
        let innerHeight = window.innerHeight;
        const offsetTop = this.ref.parentNode.getBoundingClientRect().y;
        geoEditorTop = offsetTop;
        geoEditorTop = height + geoEditorTop > innerHeight ? innerHeight - height - 30 : geoEditorTop;
        geoEditorLeft = -30;
      } else {
        let { offsetLeft, offsetTop } = this.ref.parentNode;
        geoEditorLeft = offsetLeft - width;
        geoEditorTop = offsetTop;
        if (offsetLeft < width) {
          geoEditorLeft = offsetLeft + this.props.column.width;
        }
        if (geoEditorLeft + width > window.innerWidth) {
          geoEditorLeft = window.innerWidth - width;
        }
        if (offsetTop + height > window.innerHeight) {
          geoEditorTop = window.innerHeight - height;
        }
      }
      this.setState({ editorPosition: { top: geoEditorTop, left: geoEditorLeft, zIndex: 1000, position: 'fixed' } });
    }
  };

  getGeoFormat = () => {
    const { column } = this.props;
    let data = column.data || {};
    return data.geo_format ? data.geo_format : DEFAULT_GEOLOCATION_FORMAT;
  };

  getLargeEditorState = () => {
    return this.editor?.state?.isShowLargeEditor;
  };

  createEditor = () => {
    const geoFormat = this.getGeoFormat();
    const { config, column, getCountryData, getLocationData, toggleLargeMap } = this.props;
    const props = {
      column,
      config,
      value: this.value,
      setValue: this.setValue,
      onSubmit: this.onSubmit,
      onCancel: this.onCancel,
    };

    switch (geoFormat) {
      case GEOLOCATION_FORMAT.LNG_LAT: {
        return (<MapEditor {...props} toggleLargeMap={toggleLargeMap} ref={ref => this.editor = ref} />);
      }
      case GEOLOCATION_FORMAT.MAP_SELECTION: {
        return (<MapSelectionEditor {...props} toggleLargeMap={toggleLargeMap} ref={ref => this.editor = ref} />);
      }
      case GEOLOCATION_FORMAT.COUNTRY_REGION: {
        return (<CountryEditor {...props} getData={getCountryData} ref={ref => this.editor = ref} />);
      }
      case GEOLOCATION_FORMAT.PROVINCE: {
        return (<ProvinceEditor {...props} onPressTab={this.props.onPressTab} getData={getLocationData} ref={ref => this.editor = ref} />);
      }
      case GEOLOCATION_FORMAT.PROVINCE_CITY: {
        return (<ProvinceCityEditor {...props} getData={getLocationData} ref={ref => this.editor = ref} />);
      }
      case GEOLOCATION_FORMAT.PROVINCE_CITY_DISTRICT: {
        return (<LocationEditor {...props} getData={getLocationData} ref={ref => this.editor = ref} />);
      }
      default: {
        return (<LocationEditor {...props} isShowDetails={true} getData={getLocationData} ref={ref => this.editor = ref} />);
      }
    }
  };

  render() {
    const { editorPosition } = this.state;
    return (
      <div ref={ref => this.ref = ref} style={editorPosition} className="dtable-ui-dtable-ui-geolocation-editor">
        {this.createEditor()}
      </div>
    );
  }
}

PCGeolocationEditor.propTypes = {
  isInModal: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  column: PropTypes.object,
  onCommit: PropTypes.func,
  onToggle: PropTypes.func,
  onPressTab: PropTypes.func,
};

export default PCGeolocationEditor;
