import React from 'react';
import PropTypes from 'prop-types';
import { DatePicker } from 'antd-mobile';
import classnames from 'classnames';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/en-gb';
import Calendar from '@seafile/seafile-calendar';
import Picker from '@seafile/seafile-calendar/lib/Picker';
import { getLocale } from '../../lang';
import { initDateEditorLanguage, minDate, maxDate } from '../../utils/editor-utils';
import MobileFullScreenPage from '../../MobileFullScreenPage';

import '@seafile/seafile-calendar/assets/index.css';
import './index.css';

let now = dayjs();

class Small extends React.PureComponent {

  constructor(props) {
    super(props);
    const { dateFormat, showHourAndMinute } = props;
    this.state = {
      time: null,
    };
    this.calendarContainerRef = React.createRef();
    this.leftFormat = dateFormat ? (dateFormat.indexOf(' ') === -1 ? dateFormat : dateFormat.slice(0, dateFormat.indexOf(' '))) : 'YYYY-MM-DD';
    this.rightFormat = 'HH:mm';
    this.showTime = showHourAndMinute;
    this.format = showHourAndMinute ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD';
  }

  componentDidMount() {
    let { value, lang } = this.props;
    const iszhcn = lang === 'zh-cn';
    if (iszhcn) {
      now = now.locale('zh-cn');
    } else {
      now = now.locale('en-gb');
    }
    if (!value) {
      value = new Date(Date.now());
    }
    this.defaultCalendarValue = now.clone();
    this.setState({ time: iszhcn ? dayjs(value).locale('zh-cn') : dayjs(value).locale('en-gb') });
  }

  handleDateChange = (date) => {
    if (this.showTime) {
      const HM = dayjs(this.state.time).format('HH:mm');
      // In iOS, the time standard is ISO-8601, new Date("YYYY-MM-DD") will be wrong, new Date("YYYY/MM/DD") will be OK.
      const newTime = dayjs(date).format('YYYY/MM/DD') + ' ' + HM;
      this.setState({ time: new Date(newTime) });
    } else {
      this.setState({ time: date });
    }
  };

  handleTimeChange = (time) => {
    // In iOS, the time standard is ISO-8601, new Date("YYYY-MM-DD") will be wrong, new Date("YYYY/MM/DD") will be OK.
    const YMD = dayjs(this.state.time).format('YYYY/MM/DD');
    const newTime = YMD + ' ' + dayjs(time).format('HH:mm');
    this.setState({ time: new Date(newTime) });
  };

  onSave = () => {
    const value = dayjs(this.state.time).format(this.format);
    this.props.onCommit(value);
    this.props.onClose();
  };

  deleteDate = () => {
    this.props.onCommit(null);
    this.props.onClose();
  };

  getCalendarContainer = () => {
    return this.calendarContainerRef.current;
  };

  onChange = (value) => {
    if (!value) return;
    const newTime = dayjs(value.format(this.format));
    this.setState({ time: newTime });
  };

  renderCalender = () => {
    const { lang, className, firstDayOfWeek } = this.props;
    const { time } = this.state;
    const calendar = (
      <Calendar
        className={classnames('dtable-rc-calendar', className)}
        locale={initDateEditorLanguage(lang)}
        dateInputPlaceholder={getLocale('Please_input')}
        format={this.format}
        defaultValue={this.defaultCalendarValue}
        showDateInput={false}
        focusablePanel={false}
        showToday={false}
        showTime={false}
        style={{ width: '100%', fontSize: '14px' }}
        firstDayOfWeek={firstDayOfWeek}
      />
    );

    return (
      <Picker
        calendar={calendar}
        value={time}
        onChange={this.onChange}
        getCalendarContainer={this.getCalendarContainer}
        open={true}
        style={{ width: '100%' }}
      >
        {({ time }) => {
          return (
            <div tabIndex="0" onFocus={this.onReadOnlyFocus}>
              <input
                placeholder={getLocale('please_select')}
                readOnly
                tabIndex="-1"
                className="ant-calendar-picker-input ant-input form-control"
                value={time ? dayjs(time).format(this.getFormat()) : ''}
              />
              <div ref={this.calendarContainerRef} style={{ height: '22rem' }}/>
            </div>
          );
        }}
      </Picker>
    );
  };

  render() {
    const { lang, column } = this.props;
    const { time } = this.state;

    return (
      <MobileFullScreenPage
        className="mobile-dtable-ui-date-editor"
        onClose={this.props.onClose}
        onLeftClick={this.props.onClose}
        onRightClick={this.onSave}
      >
        <>{getLocale('Cancel')}</>
        <>{column.name}</>
        <span style={{ color: '#f09f3f' }}>{getLocale('Done')}</span>
        <>
          <div className="mobile-dtable-ui-date-editor-input">
            <div className="date-input" style={this.showTime ? { width: '50%' } : { width: '100%' }}>
              <DatePicker mode="date" minDate={minDate} maxDate={maxDate} locale={initDateEditorLanguage(lang)} value={null} onChange={this.handleDateChange}>
                <div className="date-input-day">{dayjs(time).format(this.leftFormat)}</div>
              </DatePicker>
            </div>
            {this.showTime &&
              <div className="date-input" style={{ width: '50%' }}>
                <DatePicker mode="time" locale={initDateEditorLanguage(lang)} value={null} onChange={this.handleTimeChange}>
                  <div className="date-input-day">{dayjs(time).format(this.rightFormat)}</div>
                </DatePicker>
              </div>
            }
          </div>
          <div className="dtable-ui mobile-dtable-ui-date-editor-picker">
            {this.renderCalender()}
          </div>
          <div className="mobile-dtable-ui-date-editor-clear">
            <div onClick={this.deleteDate} className="clear-date">{getLocale('Clear')}</div>
          </div>
        </>
      </MobileFullScreenPage>
    );
  }
}

Small.propTypes = {
  isReadOnly: PropTypes.bool,
  lang: PropTypes.string.isRequired,
  value: PropTypes.string,
  dateFormat: PropTypes.string.isRequired,
  showHourAndMinute: PropTypes.bool.isRequired,
  className: PropTypes.string,
  column: PropTypes.object.isRequired,
  onCommit: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  firstDayOfWeek: PropTypes.string,
};

export default Small;
