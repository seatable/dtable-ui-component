import React, { forwardRef, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import PCGeolocationEditor from './pc-editor';
import MBGeolocationEditor from './mb-editor';

const GeolocationEditor = forwardRef(({ isMobile, config: propsConfig, ...props }, ref) => {

  const config = useMemo(() => ({ ...window?.dtable, ...propsConfig, }), [propsConfig]);

  const getLocationData = useCallback(() => {
    if (window?.app?.location) return new Promise((resolve, reject) => {
      resolve(window.app.location);
    });
    const { server = '', mediaUrl = '' } = config || {};
    return fetch(`${server}${mediaUrl}geo-data/cn-location.json`.replaceAll('//', '/')).then((res) => { // get locations from server
      return res.json();
    }).catch(() => {
      // get locations from local
      return fetch('./geo-data/cn-location.json').then(res => {
        return res.json();
      });
    });
  }, [config]);

  const getCountryData = useCallback((lang) => {
    if (lang === 'cn' && window.app.countryListCn) return new Promise((resolve, reject) => {
      resolve(window.app.countryListCn);
    });
    if (lang !== 'cn' && window.app.countryListEn) return new Promise((resolve, reject) => {
      resolve(window.app.countryListEn);
    });

    const { mediaUrl = '', server = '' } = config;
    const geoFileName = lang === 'cn' ? 'cn-region-location' : 'en-region-location';
    return fetch(`${server}${mediaUrl}geo-data/${geoFileName}.json`.replaceAll('//', '/'))
      .then(res => {
        return res.json();
      }).catch(() => {
        // get locations from local
        return fetch(`./geo-data/${geoFileName}.json`).then(res => {
          return res.json();
        });
      }).then(res => {
        const data = res || {};
        if (lang === 'cn') {
          window.app.countryListCn = data;
        } else {
          window.app.countryListEn = data;
        }
        return data;
      });
  }, [config]);

  if (isMobile === false) return (<PCGeolocationEditor { ...props } config={config} getLocationData={getLocationData} getCountryData={getCountryData} ref={ref} />);
  if (isMobile === true) return (<MBGeolocationEditor { ...props } config={config} getLocationData={getLocationData} getCountryData={getCountryData} ref={ref} />);

  return (
    <>
      <MediaQuery query="(min-width: 768px)">
        <PCGeolocationEditor { ...props } config={config} getLocationData={getLocationData} getCountryData={getCountryData} ref={ref} />
      </MediaQuery>
      <MediaQuery query="(max-width: 768px)">
        <MBGeolocationEditor { ...props } config={config} getLocationData={getLocationData} getCountryData={getCountryData} ref={ref} />
      </MediaQuery>
    </>
  );
});

GeolocationEditor.propTypes = {
  isMobile: PropTypes.bool,
  config: PropTypes.object,
};

export default GeolocationEditor;
