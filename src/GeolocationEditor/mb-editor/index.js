import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { GEOLOCATION_FORMAT, DEFAULT_GEOLOCATION_FORMAT } from 'dtable-utils';
import CountryEditor from './country-editor';
import ProvinceEditor from './province-editor';
import ProvinceCityEditor from './province-city-editor';
import LocationEditor from './location-editor';
import MapEditor from './map-editor';
import MapSelectionEditor from './map-selection-editor';

import './index.css';

const transLocationData = (data) => {
  if (Object.prototype.toString.call(data) === '[object Object]') {
    const name = data.name;
    data.label = name;
    data.value = name;
    data.name = null;
    if (data.children) {
      data.children.map(child => {
        return transLocationData(child);
      });
    }
  }
  return data.children;
};

const transCountryData = (data) => {
  let _data = [];
  for (let key in data) {
    let obj = {};
    let children = [];
    obj.label = key;
    obj.value = key;
    obj.name = null;
    data[key].forEach((item) => {
      let obj = {};
      obj.label = item;
      obj.value = item;
      obj.name = null;
      children.push(obj);
    });
    obj.children = children;
    _data.push(obj);
  }
  return _data;
};

const MBGeolocationEditor = ({
  column,
  config,
  getLocationData,
  getCountryData,
  ...props
}) => {
  const format = useMemo(() => {
    let data = column.data || {};
    return data.geo_format ? data.geo_format : DEFAULT_GEOLOCATION_FORMAT;
  }, [column]);

  const getData = useCallback(() => {
    return getLocationData().then(data => transLocationData(data));
  }, [getLocationData]);

  const _getCountryData = useCallback(() => {
    const columnData = column.data || {};
    const lang = columnData.lang === 'cn' ? 'cn' : 'en';
    return getCountryData(lang).then(data => transCountryData(data));
  }, [column, getCountryData]);

  switch (format) {
    case GEOLOCATION_FORMAT.LNG_LAT: {
      return (<MapEditor { ...props } config={config} column={column} />);
    }
    case GEOLOCATION_FORMAT.MAP_SELECTION: {
      return (<MapSelectionEditor {...props} config={config} column={column} />);
    }
    case GEOLOCATION_FORMAT.COUNTRY_REGION: {
      return (<CountryEditor { ...props } getData={_getCountryData} column={column} />);
    }
    case GEOLOCATION_FORMAT.PROVINCE: {
      return (<ProvinceEditor { ...props } getData={getData} column={column} />);
    }
    case GEOLOCATION_FORMAT.PROVINCE_CITY: {
      return (<ProvinceCityEditor { ...props } getData={getData} column={column} />);
    }
    case GEOLOCATION_FORMAT.PROVINCE_CITY_DISTRICT: {
      return (<LocationEditor { ...props } getData={getData} column={column} />);
    }
    default: {
      return (<LocationEditor { ...props } isShowDetails={true} getData={getData} column={column} />);
    }
  }
};

MBGeolocationEditor.propTypes = {
  column: PropTypes.object,
  config: PropTypes.object,
  getLocationData: PropTypes.func,
  getCountryData: PropTypes.func,
};

export default MBGeolocationEditor;
