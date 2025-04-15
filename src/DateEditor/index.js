import React, { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import { DEFAULT_DATE_FORMAT } from 'dtable-utils';
import dayjs from '../utils/dayjs';
import Large from './lg';
import Small from './sm';

import 'dayjs/locale/zh-cn';
import 'dayjs/locale/en-gb';

import './index.css';

const propTypes = {
  isReadOnly: PropTypes.bool,
  isInModal: PropTypes.bool,
  value: PropTypes.string,
  lang: PropTypes.string,
  className: PropTypes.string,
  column: PropTypes.object.isRequired,
  onCommit: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  firstDayOfWeek: PropTypes.string,
};

const DateEditor = forwardRef(({ lang, isReadOnly, column, className, isInModal, firstDayOfWeek, size, value: oldValue, hideCalendar, onCommit }, ref) => {
  const [isDateInit, setDateInit] = useState(false);
  const [value, setValue] = useState(oldValue || '');

  const format = useMemo(() => {
    return (column?.data && column?.data?.format) || DEFAULT_DATE_FORMAT;
  }, [column]);
  const showHourAndMinute = useMemo(() => format.indexOf('HH:mm') > -1, [format]);

  const handelCommit = useCallback((newValue) => {
    if (value !== newValue) {
      setValue(newValue);
      onCommit(newValue);
    }
  }, [value, onCommit]);

  useEffect(() => {
    dayjs.locale(lang);
    setDateInit(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isDateInit) return null;

  const props = {
    lang,
    value,
    dateFormat: format,
    showHourAndMinute,
    firstDayOfWeek,
    className,
    onCommit: handelCommit,
    onClose: hideCalendar,
  };

  if (size === 'lg') return (<Large { ...props } isInModal={isInModal} ref={ref} />);
  if (size === 'sm') return (<Small { ...props } isReadOnly={isReadOnly} column={column} ref={ref} />);

  return (
    <>
      <MediaQuery query={'(min-width: 768px)'}>
        <Large { ...props } isInModal={isInModal} ref={ref} />
      </MediaQuery>
      <MediaQuery query={'(max-width: 767.8px)'}>
        <Small { ...props } isReadOnly={isReadOnly} column={column} ref={ref} />
      </MediaQuery>
    </>
  );
});

DateEditor.propTypes = propTypes;

export default DateEditor;
