import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Picker, List } from 'antd-mobile';
import MobileFullScreenPage from '../../MobileFullScreenPage';
import { getLocale } from '../../lang';

const ProvinceEditor = ({
  column,
  value: oldValue,
  getData,
  onToggle,
  onCommit,
}) => {
  const [value, setValue] = useState([oldValue?.province || '']);
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
    if (value[0] === newValue[0]) return;
    setValue(newValue);
  }, [value]);

  const onSubmit = useCallback(() => {
    if (value[0] !== oldValue?.province) {
      onCommit({ province: value[0] });
    }
    onToggle();
  }, [value, oldValue, onCommit, onToggle]);

  return (
    <MobileFullScreenPage onLeftClick={onToggle} onRightClick={onSubmit} onClose={onToggle}>
      <>{getLocale('Cancel')}</>
      <>{column.name}</>
      <span style={{ color: '#f09f3f' }}>{getLocale('Submit')}</span>
      <>
        <div className="mobile-dtable-ui-row-expand-subtitle">
          <span>{getLocale('Address_information')}</span>
        </div>
        <Picker
          className="mobile-dtable-ui-geolocation-editor-picker"
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
          cols={1}
        >
          <List.Item arrow="horizontal">{value[0] || getLocale('Select_location')}</List.Item>
        </Picker>
      </>
    </MobileFullScreenPage>
  );
};

ProvinceEditor.propTypes = {
  column: PropTypes.object,
  value: PropTypes.object,
  getData: PropTypes.func,
  onToggle: PropTypes.func,
  onCommit: PropTypes.func,
};

export default ProvinceEditor;
