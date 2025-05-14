import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Picker, List } from 'antd-mobile';
import MobileFullScreenPage from '../../MobileFullScreenPage';
import { getLocale } from '../../lang';

const { Header, Body } = MobileFullScreenPage;

const CountryEditor = ({
  column,
  value: oldValue,
  getData,
  onToggle,
  onCommit,
}) => {
  const [value, setValue] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const locations = useRef([]);

  useEffect(() => {
    getData().then(data => {
      locations.current = data;
      const continent = data.find(a => a.children.find(b => b.value === oldValue?.country_region || ''));
      const value = [continent?.value || '', oldValue?.country_region || ''];
      setValue(value);
      setLoading(false);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onValueChange = useCallback((newValue) => {
    if (value === newValue) return;
    setValue(newValue);
  }, [value]);

  const onSubmit = useCallback(() => {
    if (value[1] !== oldValue?.country_region) {
      onCommit({ country_region: value[1] });
    }
    onToggle();
  }, [value, oldValue, onCommit, onToggle]);

  return (
    <MobileFullScreenPage onClose={onToggle}>
      <Header onLeftClick={onToggle} onRightClick={onSubmit}>
        <>{getLocale('Cancel')}</>
        <>{column.name}</>
        <span style={{ color: '#f09f3f' }}>{getLocale('Submit')}</span>
      </Header>
      <Body>
        <div className="dtable-ui-mobile-row-expand-subtitle">
          <span>{getLocale('Address_information')}</span>
        </div>
        <Picker
          className="dtable-ui-mobile-geolocation-editor-picker"
          data={isLoading ? [] : locations.current}
          value={value}
          format=""
          onChange={onValueChange}
          cascade={true}
          title={getLocale('Address_information')}
          extra={getLocale('Select_location')}
          onOk={e => onValueChange(e)}
          okText={getLocale('Done')}
          dismissText={getLocale('Cancel')}
          cols={2}
        >
          <List.Item arrow="horizontal">{value[1] || getLocale('Select_location')}</List.Item>
        </Picker>
      </Body>
    </MobileFullScreenPage>
  );
};

CountryEditor.propTypes = {
  column: PropTypes.object,
  value: PropTypes.object,
  getData: PropTypes.func,
  onToggle: PropTypes.func,
  onCommit: PropTypes.func,
};

export default CountryEditor;
