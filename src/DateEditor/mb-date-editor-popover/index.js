import React from 'react';
import PropTypes from 'prop-types';
import { DatePicker } from 'antd-mobile';
import dayjs from 'dayjs';
import Calendar from '@seafile/seafile-calendar';
import * as SeaDatePicker from '@seafile/seafile-calendar/lib/Picker';
import { getLocale } from '../../lang';
import { initDateEditorLanguage } from '../../utils/editor-utils';
import MBEditorHeader from '../../MBEditorHeader';

import '@seafile/seafile-calendar/assets/index.css';
import './index.css';

const propTypes = {
  isReadOnly: PropTypes.bool,
  lang: PropTypes.string.isRequired,
  value: PropTypes.string,
  dateFormat: PropTypes.string.isRequired,
  showHourAndMinute: PropTypes.bool.isRequired,
  column: PropTypes.object.isRequired,
  onValueChanged: PropTypes.func.isRequired,
  onClosePopover: PropTypes.func,
};

class DateEditorPopover extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      open: true,
      datePickerValue: props.value ? dayjs(props.value) : dayjs().clone(),
    };
    this.calendarContainerRef = React.createRef();
  }

  componentDidMount() {
    history.pushState(null, null, '#'); // eslint-disable-line
    window.addEventListener('popstate', this.handleHistaryBack, false);
  }

  componentWillUnmount() {
    window.removeEventListener('popstate', this.handleHistaryBack, false);
  }

  handleHistaryBack = (e) => {
    e.preventDefault();
    this.closePopover();
  }

  handleDateChange = (date) => {
    let { dateFormat, showHourAndMinute } = this.props;
    let newValue = dayjs(date);
    if (showHourAndMinute) {
      const { datePickerValue } = this.state;
      const HM = datePickerValue.format('HH:mm');
      const format = dateFormat.split(' ')[0];  // 'YYYY-MM-DD HH:mm'
      const newDate = dayjs(date).format(format) + ' ' + HM;
      newValue = dayjs(newDate);
    }
    this.setState({datePickerValue: dayjs(date)});
    this.props.onValueChanged(newValue.format(dateFormat));
  }

  handleTimeChange = (time) => {
    const { datePickerValue } = this.state;
    const { dateFormat } = this.props;
    const format = dateFormat.split(' ')[0];  // 'YYYY-MM-DD HH:mm'
    const YMD = datePickerValue.format(format);
    const newDate = YMD + ' ' + dayjs(time).format('HH:mm');
    const newValue = dayjs(newDate);

    this.setState({ datePickerValue: newValue });
    this.props.onValueChanged(datePickerValue.format(dateFormat));
  }

  closePopover = () => {
    this.props.onClosePopover();
  }

  deleteDate = () => {
    this.props.onValueChanged('');
    this.closePopover();
  }

  onChange = (value) => {
    if (!value) return;
    let { dateFormat } = this.props;
    this.setState({datePickerValue: value,});
    this.props.onValueChanged(value.format(dateFormat));
  }

  onContainerClick = (event) => {
    if (this.editorPopover && this.editorPopover.contains(event.target)) {
      event.stopPropagation();
      event.nativeEvent.stopImmediatePropagation();
      return false;
    }
  }

  setEditorPopover = (editorPopover) => {
    this.editorPopover = editorPopover;
  }

  getCalendarContainer = () => {
    return this.calendarContainerRef.current;
  }

  getCalender = () => {
    let { dateFormat, lang } = this.props;
    let defaultValue = dayjs().clone();
    return (
      <Calendar
        locale={initDateEditorLanguage(lang)}
        format={dateFormat}
        defaultValue={defaultValue}
        dateInputPlaceholder={getLocale('Please_input')}
        showDateInput={false}
        focusablePanel={false}
        showToday={false}
        showTime={false}
        style={{width: '100%', fontSize: '14px'}}
      />
    );
  }

  renderDataPicker = () => {
    let { dateFormat } = this.props;
    let { datePickerValue } = this.state;
    let calendar = this.getCalender();

    return (
      <SeaDatePicker
        open={true}
        style={{width: '100%'}}
        calendar={calendar}
        value={datePickerValue}
        getCalendarContainer={this.getCalendarContainer}
        onChange={this.onChange}
      >
        {({ value }) => {
          value = value && value.format(dateFormat);
          return (
            <div tabIndex="0" onFocus={this.onReadOnlyFocus}>
              <input
                placeholder={getLocale('Please_select')}
                readOnly
                tabIndex="-1"
                className="form-control"
                value={value || ''}
              />
              <div ref={this.calendarContainerRef} style={{height: '22rem'}}/>
            </div>
          );
        }}
      </SeaDatePicker>
    );
  }

  render() {
    const { lang, column, dateFormat, showHourAndMinute } = this.props;
    const leftFormat = dateFormat.split(' ')[0];
    const rightFormat = dateFormat.split(' ')[1];
    const { datePickerValue } = this.state;

    return (
      <div ref={this.setEditorPopover} className="dtable-ui-mb-editor-popover mb-date-editor-popover" onClick={this.onContainerClick}>
        <MBEditorHeader
          title={column.name}
          leftContent={(<i className="dtable-font dtable-icon-return"></i>)}
          rightContent={(<span>{getLocale('Done')}</span>)}
          onLeftClick={this.props.onClosePopover}
          onRightClick={this.props.onClosePopover}
        />
        <div className="dtable-ui-mb-editor-body dtable-ui-mb-date-editor-body">
          <div className="mb-date-editor-input">
            <div className="date-input">
              <DatePicker mode="date" locale={initDateEditorLanguage(lang)} value={this.state.value} onChange={this.handleDateChange}>
                <div className="date-input-day">{datePickerValue && datePickerValue.format(leftFormat)}</div>
              </DatePicker>
            </div>
            {showHourAndMinute &&
              <div className="date-input">
                <DatePicker mode="time" locale={initDateEditorLanguage(lang)} value={this.state.value} onChange={this.handleTimeChange}>
                  <div className="date-input-day">{datePickerValue && datePickerValue.format(rightFormat)}</div>
                </DatePicker>
              </div>
            }
          </div>
          <div className="dtable-ui mb-date-editor-picker">
            {this.renderDataPicker()}
          </div>
          <div className="mb-date-editor-clear">
            <div onClick={this.deleteDate} className="clear-date">{getLocale('Clear')}</div>
          </div>
        </div>
      </div>
    );
  }
}

DateEditorPopover.propTypes = propTypes;

export default DateEditorPopover;
