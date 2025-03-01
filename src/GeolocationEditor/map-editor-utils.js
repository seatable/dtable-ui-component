export const MAP_TYPES = {
  B_MAP: 'b_map', // baidu
  G_MAP: 'g_map', // google
  M_MAP: 'm_map', // mineMap
};

// domestic map's format: [lng, lat], foreign map's format: [lat, lng]
export const DOMESTIC_MAP_TYPE = [MAP_TYPES.B_MAP, MAP_TYPES.M_MAP];

const MINE_MAP_ONLINE_SERVICE = {
  DOMAIN_URL: 'https://minemap.minedata.cn',
  DATA_DOMAIN_URL: 'https://minemap.minedata.cn',
  SERVER_DOMAIN_URL: 'https://sd-data.minedata.cn',
  SPRITE_URL: 'https://minemap.minedata.cn/minemapapi/v2.1.1/sprite/sprite',
  SERVICE_URL: 'https://service.minedata.cn/service'
};

export const getMineMapUrl = (config = {}) => {
  const { dtableMineMapCustomConfig = {} } = { ...window.dtable, ...config };
  const { domain_url = '', data_domain_url = '', server_domain_url = '',
    sprite_url = '', service_url = '' } = dtableMineMapCustomConfig;
  return {
    domainUrl: domain_url || MINE_MAP_ONLINE_SERVICE.DOMAIN_URL,
    dataDomainUrl: data_domain_url || MINE_MAP_ONLINE_SERVICE.DATA_DOMAIN_URL,
    serverDomainUrl: server_domain_url || MINE_MAP_ONLINE_SERVICE.SERVER_DOMAIN_URL,
    spriteUrl: sprite_url || MINE_MAP_ONLINE_SERVICE.SPRITE_URL,
    serviceUrl: service_url || MINE_MAP_ONLINE_SERVICE.SERVICE_URL
  };
};

export const getInitCenter = (isSelectionEditor = false) => {
  // set beijing as default map center
  let lng = 116.404;
  let lat = 39.915;
  let zoom = 5;
  let center = isSelectionEditor ? localStorage.getItem('geolocation-map-selection-center') : localStorage.getItem('geolocation-map-center');
  if (center) {
    center = JSON.parse(center);
    lng = center.lng || lng;
    lat = center.lat || lat;
    zoom = center.zoom || zoom;
  }
  return { lng, lat, zoom };
};

export const getMapInfo = (config = {}) => {
  const { dtableBaiduMapKey: baiduMapKey, dtableGoogleMapKey: googleMapKey, dtableMineMapKey: mineMapKey } = { ...window.dtable, ...config };
  let mapType;
  let mapKey;
  if (baiduMapKey) {
    mapType = MAP_TYPES.B_MAP;
    mapKey = baiduMapKey;
  } else if (googleMapKey) {
    mapType = MAP_TYPES.G_MAP;
    mapKey = googleMapKey;
  } else if (mineMapKey) {
    mapType = MAP_TYPES.M_MAP;
    mapKey = mineMapKey;
  }
  return { mapType, mapKey };
};

export const loadMapSource = (mapType, mapKey, callback) => {
  if (!mapType || !mapKey) return;
  let scriptUrl = '';
  let script = document.createElement('script');
  script.type = 'text/javascript';
  if (mapType === MAP_TYPES.B_MAP) {
    scriptUrl = `https://api.map.baidu.com/api?v=3.0&ak=${mapKey}}&callback=renderBaiduMap`;
  } else if (mapType === MAP_TYPES.G_MAP) {
    scriptUrl = `https://maps.googleapis.com/maps/api/js?key=${mapKey}&callback=renderGoogleMap&libraries=&v=weekly`;
  } else {
    scriptUrl = 'https://minemap.minedata.cn/minemapapi/v2.1.1/minemap.js';
    let link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = 'https://minemap.minedata.cn/minemapapi/v2.1.1/minemap.css';
    document.head.appendChild(link);
  }
  script.src = scriptUrl;
  document.body.appendChild(script);
  if (callback) callback();
};

export const locateCurrentPosition = (map, mapType, callback) => {
  if (mapType === MAP_TYPES.B_MAP) {
    const geolocation = new window.BMap.Geolocation();
    geolocation.getCurrentPosition((result) => {
      if (result) {
        const point = result.point;
        map.setCenter(point);
        callback(null, point);
      } else {
        // Positioning failed
        callback(true);
      }
    });
  } else {
    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition((position) => {
        const lng = position.coords.longitude;
        const lat = position.coords.latitude;
        map.setCenter({ lng, lat });
        callback(null, { lng, lat });
      }, (e) => {
        // Positioning failed
        callback(true);
      }, { timeout: 5000 });
    }
  }
};
