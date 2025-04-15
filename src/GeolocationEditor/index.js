import React, { forwardRef, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import Large from './lg';
import Small from './sm';

const GeolocationEditor = forwardRef(({ size, config: propsConfig, ...props }, ref) => {

  const config = useMemo(() => ({ ...window?.dtable, ...propsConfig, }), [propsConfig]);

  const getLocationData = useCallback(() => {
    if (window?.app?.location) return new Promise((resolve, reject) => {
      resolve(window.app.location);
    });
    const { mediaUrl } = config || {};
    return fetch(`${mediaUrl}geo-data/cn-location.json`).then((res) => { // get locations from server
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

    const { mediaUrl } = config;
    const geoFileName = lang === 'cn' ? 'cn-region-location' : 'en-region-location';
    return fetch(`${mediaUrl}geo-data/${geoFileName}.json`)
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

  if (size === 'lg') return (<Large { ...props } config={config} getLocationData={getLocationData} getCountryData={getCountryData} ref={ref} />);
  if (size === 'sm') return (<Small { ...props } config={config} getLocationData={getLocationData} getCountryData={getCountryData} ref={ref} />);

  return (
    <>
      <MediaQuery query="(min-width: 768px)">
        <Large { ...props } config={config} getLocationData={getLocationData} getCountryData={getCountryData} ref={ref} />
      </MediaQuery>
      <MediaQuery query="(max-width: 768px)">
        <Small { ...props } config={config} getLocationData={getLocationData} getCountryData={getCountryData} ref={ref} />
      </MediaQuery>
    </>
  );
});

GeolocationEditor.propTypes = {
  size: PropTypes.oneOf(['lg', 'sm']),
};

export default GeolocationEditor;
