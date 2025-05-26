const MUNICIPALITY = ['北京市', '天津市', '上海市', '重庆市', '香港', '澳门'];

let initProvince = null;
let initCity = null;

function getProvince(string, geoTree) {
  if (string.length === 0) {
    return { province: '', city: '', district: '', detail: '' };
  }
  let startPoint = 0;
  let endPoint = 2;
  let subProvince = string.substring(startPoint, endPoint);
  let province;
  while (subProvince.length === 2) {
    // eslint-disable-next-line no-loop-func
    const selectedProvince = geoTree.children.find((provinceItem) => {
      if (provinceItem.name.indexOf(subProvince) === 0) {
        return true;
      }
      return null;
    });
    if (selectedProvince) {
      province = selectedProvince;
      break;
    }
    startPoint++;
    endPoint++;
    subProvince = string.substring(startPoint, endPoint);
  }

  if (province) {
    const name = province.name;
    while (name.includes(string.substring(startPoint, endPoint)) && endPoint <= string.length) {
      endPoint++;
    }
    return { province, string: string.substring(endPoint - 1) };
  }
  return { province, string: string.substring(0) };
}

function getCity(province, string, geoTree) {
  let city;
  let startPoint = 0;
  let endPoint = 2;
  if (string.length === 0) {
    return { province, city: '', district: '', detail: '' };
  }
  let subCity = string.substring(startPoint, endPoint);
  if (province) {
    if (MUNICIPALITY.includes(province.name)) {
      city = province.children[0];
      const name = city.name;
      if (!name.includes(subCity)) {
        return { province, city, string: string.substring(startPoint) };
      }
      while (name.includes(string.substring(startPoint, endPoint)) && endPoint <= string.length) {
        endPoint++;
      }
      return { province, city, string: string.substring(endPoint - 1) };
    }
    while (subCity.length === 2) {
      // eslint-disable-next-line no-loop-func
      let selectedCity = province.children.find((cityItem) => {
        if (cityItem.name.indexOf(subCity) === 0) {
          return true;
        }
        return false;
      });
      if (selectedCity) {
        city = selectedCity;
        break;
      }
      startPoint++;
      endPoint++;
      subCity = string.substring(startPoint, endPoint);
    }
    if (city) {
      while (city.name.includes(string.substring(startPoint, endPoint)) && endPoint <= string.length) {
        endPoint++;
      }
      return { province, city, string: string.substring(endPoint - 1) };
    }
    return { province, city, string };
  }

  if (!province) {
    let city;
    let newProvince;
    while (subCity.length === 2) {
      // eslint-disable-next-line no-loop-func
      geoTree.children.find((provinceItem) => {
        let selectedCity = provinceItem.children.find((city) => {
          if (city.name.indexOf(subCity) === 0) {
            return true;
          }
          return false;
        });
        if (selectedCity) {
          city = selectedCity;
          newProvince = provinceItem;
          return true;
        }
        return false;
      });
      if (city) {
        break;
      }
      startPoint++;
      endPoint++;
      subCity = string.substring(startPoint, endPoint);
    }
    if (city) {
      const name = city.name;
      while (name.includes(string.substring(startPoint, endPoint)) && endPoint <= string.length) {
        endPoint++;
      }
      return { province: newProvince, city, string: string.substring(endPoint - 1) };
    } else {
      return { province, city, string };
    }
  }
}

const getDistrict = (province, city, string, geoTree) => {
  if (!string) {
    return { province, city, district: '', detail: '' };
  }
  let startPoint = 0;
  let endPoint = 2;
  let subDistrict = string.substring(startPoint, endPoint);
  let district;
  if (province) {
    if (city) {
      while (subDistrict.length === 2) {
        // eslint-disable-next-line no-loop-func
        let selectedDistrict = city.children.find((item) => {
          if (item.name.indexOf(subDistrict) === 0) {
            return true;
          }
          return false;
        });
        if (selectedDistrict) {
          district = selectedDistrict;
          break;
        }
        startPoint++; endPoint++;
        subDistrict = string.substring(startPoint, endPoint);
      }

      if (district) {
        const name = district.name;
        while (name.includes(string.substring(startPoint, endPoint)) && endPoint <= string.length) {
          endPoint++;
        }
        return { province, city, district, string: string.substring(endPoint - 1) };
      } else {
        return { province: initProvince, city: initCity, district, string: string.substring(0) };
      }
    } else {
      let result = { province, city, district: '' };
      for (let index = 0; index < province.children.length; index++) {
        const city = province.children[index];
        result = getDistrict(province, city, string, geoTree);
        if (result.district) {
          break;
        }
      }
      return result;
    }
  } else {
    let result = { province, city };
    const provinces = geoTree.children;
    for (let provinceIndex = 0; provinceIndex < provinces.length; provinceIndex++) {
      const province = provinces[provinceIndex];
      const cities = province.children;
      for (let cityIndex = 0; cityIndex < cities.length; cityIndex++) {
        result = getDistrict(province, cities[cityIndex], string, geoTree);
        if (result.district) {
          break;
        }
      }
      if (result.district) {
        break;
      }
    }
    return result;
  }
};

const parseGeolocationString = (geoTree, geoString) => {
  if (geoString === null || geoString.length < 2) {
    return { province: {}, city: {}, district: {}, detail: geoString };
  }
  let string = geoString;
  let provinceResult = getProvince(string, geoTree);
  let province = provinceResult.province;
  string = provinceResult.string;
  const cityResult = getCity(province, string, geoTree);
  province = cityResult.province;
  let city = cityResult.city;
  string = cityResult.string;
  initProvince = province;
  initCity = city;
  let districtResult = getDistrict(province, city, string, geoTree);
  let district = districtResult.district;
  province = districtResult.province;
  city = districtResult.city;
  string = districtResult.string;
  return { province, city, district, detail: string };
};

export default parseGeolocationString;
