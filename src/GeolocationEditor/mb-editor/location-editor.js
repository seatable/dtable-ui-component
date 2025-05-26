import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import InputItem from '../../InputItem';
import Picker from '../../Picker';
import List from '../../List';
import MobileFullScreenPage from '../../MobileFullScreenPage';
import { getLocale } from '../../lang';
import ObjectUtils from '../../utils/object-utils';

const { Header, Body } = MobileFullScreenPage;

const LocationEditor = ({
  isShowDetails,
  column,
  value: oldValue,
  getData,
  onToggle,
  onCommit,
}) => {
  let initValue = [oldValue?.province || '', oldValue?.city || '', oldValue?.district || ''];
  if (isShowDetails) {
    initValue.push(oldValue?.detail || '');
  }
  const [value, setValue] = useState(initValue);
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

  const onAddressChange = useCallback((address) => {
    const newValue = value.slice(0, 3);
    newValue.push(address);
    setValue(newValue);
  }, [value]);

  const onSubmit = useCallback(() => {
    let newValue = { province: value[0], city: value[1], district: value[2] };
    if (isShowDetails) {
      newValue['detail'] = value[3];
    }

    if (!ObjectUtils.isSameObject(newValue, oldValue)) {
      onCommit(newValue);
    }
    onToggle();
  }, [isShowDetails, value, oldValue, onCommit, onToggle]);

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
          value={value.slice(0, 3)}
          format=""
          onChange={onValueChange}
          cascade={true}
          title={getLocale('Address_information')}
          extra={getLocale('Select_location')}
          onOk={e => onValueChange(e)}
          okText={getLocale('Done')}
          dismissText={getLocale('Cancel')}
          cols={3}
        >
          <List.Item arrow="horizontal">{value.slice(0, 3).join(' ') || getLocale('Select_location')}</List.Item>
        </Picker>
        {isShowDetails && (
          <>
            <div className="dtable-ui-mobile-row-expand-subtitle">
              <span>{getLocale('Detailed_address')}</span>
            </div>
            <InputItem placeholder={getLocale('Detailed_address_placeholder')} value={value[3]} onChange={onAddressChange} moneyKeyboardAlign="left" />
          </>
        )}
      </Body>
    </MobileFullScreenPage>
  );
};

LocationEditor.propTypes = {
  isShowDetails: PropTypes.bool,
  column: PropTypes.object,
  value: PropTypes.object,
  getData: PropTypes.func,
  onToggle: PropTypes.func,
  onCommit: PropTypes.func,
};

export default LocationEditor;
