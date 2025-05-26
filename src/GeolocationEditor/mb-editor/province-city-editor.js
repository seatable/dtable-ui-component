import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Picker from '../../Picker';
import List from '../../List';
import MobileFullScreenPage from '../../MobileFullScreenPage';
import { getLocale } from '../../lang';

const { Header, Body } = MobileFullScreenPage;

const ProvinceCityEditor = ({
  column,
  value: oldValue,
  getData,
  onToggle,
  onCommit,
}) => {
  const [value, setValue] = useState([oldValue?.province || '', oldValue?.city || '']);
  const [isLoading, setLoading] = useState(true);

  const locations = useRef([]);

  useEffect(() => {
    getData().then(data => {
      locations.current = data;
      setLoading(false);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onValueChange = useCallback((newValue) => {
    if (value === newValue) return;
    setValue(newValue);
  }, [value]);

  const onSubmit = useCallback(() => {
    if (value[0] !== oldValue?.province || value[1] !== oldValue?.city) {
      onCommit({ province: value[0], city: value[1] });
    }
    onToggle();
  }, [value, oldValue, onCommit, onToggle]);

  return (
    <MobileFullScreenPage onToggle={onToggle}>
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
          <List.Item arrow="horizontal">{value.join(' ') || getLocale('Select_location')}</List.Item>
        </Picker>
      </Body>
    </MobileFullScreenPage>
  );
};

ProvinceCityEditor.propTypes = {
  column: PropTypes.object,
  value: PropTypes.object,
  getData: PropTypes.func,
  onToggle: PropTypes.func,
  onCommit: PropTypes.func,
};

export default ProvinceCityEditor;
