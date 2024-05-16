import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import DatePicker from '@seafile/seafile-calendar/lib/Picker';
import Calendar from '@seafile/seafile-calendar';
import { initDateEditorLanguage } from '../utils/editor-utils';

import '@seafile/seafile-calendar/assets/index.css';
import { getLocale } from '../lang';

const propTypes = {
  lang: PropTypes.string.isRequired,
  value: PropTypes.string,
  dateFormat: PropTypes.string.isRequired,
  showHourAndMinute: PropTypes.bool.isRequired,
  onValueChanged: PropTypes.func.isRequired,
};

class PCDateEditorPopover extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      open: true,
      datePickerValue: props.value ? dayjs(props.value) : null,
    };

    this.calendarContainerRef = React.createRef();
  }

  // event trigger sequence: onOpenChange --> onChange
  onChange = (value) => {
    if (!value) return;
    let { dateFormat } = this.props;
    this.setState({
      datePickerValue: value,
      open: true, // if value changed, don't close datePicker
    });
    this.props.onValueChanged(value.format(dateFormat));
  };

  onOpenChange = (open) => {
    this.setState({open: open});
    return;
  };

  onClear = () => {
    this.setState({datePickerValue: null});
  };

  onFocusDatePicker = () => {
    this.setState({open: true});
  };

  handleMouseDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  getCalendarContainer = () => {
    return this.calendarContainerRef.current;
  };

  getCalender = () => {
    let { dateFormat, showHourAndMinute, lang } = this.props;
    let defaultValue = dayjs().clone();
    return (
      <Calendar
        className="dtable-rc-calendar"
        locale={initDateEditorLanguage(lang)}
        style={{zIndex: 1001}}
        format={dateFormat}
        defaultValue={defaultValue}
        showHourAndMinute={showHourAndMinute}
        dateInputPlaceholder={getLocale('Please_input')}
        showDateInput={true}
        focusablePanel={false}
        onClear={this.onClear}
      />
    );
  };

  render() {
    let { dateFormat } = this.props;
    let { open, datePickerValue } = this.state;
    const calendar = this.getCalender();

    return (
      <DatePicker
        open={open}
        value={datePickerValue}
        animation="slide-up"
        style={{zIndex: 1001}}
        calendar={calendar}
        getCalendarContainer={this.getCalendarContainer}
        onChange={this.onChange}
        onOpenChange={this.onOpenChange}
      >
        {({value}) => {
          value = value && value.format(dateFormat);
          return (
            <span className="dtable-ui-date-editor-container" tabIndex="0" onFocus={this.onFocusDatePicker}>
              <input
                readOnly
                tabIndex="-1"
                className="form-control"
                placeholder={getLocale('Please_select')}
                value={value || ''}
                onMouseDown={this.handleMouseDown}
              />
              <div ref={this.calendarContainerRef} />
            </span>
          );
        }}
      </DatePicker>
    );
  }
}

PCDateEditorPopover.propTypes = propTypes;

export default PCDateEditorPopover;
