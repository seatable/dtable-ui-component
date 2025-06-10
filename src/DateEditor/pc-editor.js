import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import classnames from 'classnames';
import DatePicker from '@seafile/seafile-calendar/lib/Picker';
import Calendar from '@seafile/seafile-calendar';
import { initDateEditorLanguage } from '../utils/editor-utils';
import { KeyCodes } from '../constants';
import { getLocale } from '../lang';

import '@seafile/seafile-calendar/assets/index.css';

let now = dayjs();

class PCDateEditor extends React.Component {

  constructor(props) {
    super(props);

    const { dateFormat, value } = this.props;

    this.state = {
      value: value ? dayjs(value) : null,
      open: false,
    };
    this.calendarContainerRef = React.createRef();
    this.defaultCalendarValue = null;
    this.showHourAndMinute = !!(dateFormat.indexOf('HH:mm') > -1);
  }

  // event trigger sequence: onOpenChange --> onChange
  onChange = (value) => {
    if (!value) return;
    let { dateFormat } = this.props;
    this.setState({
      value: value,
      open: true, // if value changed, don't close datePicker
    });
    this.props.onCommit(value.format(dateFormat));
  };

  onBlur = () => {
    this.props.onCommit(this.getValue());
  };

  getValue = () => {
    let { dateFormat } = this.props;
    let value = this.state.value ? this.state.value.format(dateFormat) : null;
    return value;
  };

  getInputNode = () => {
    if (!this.datePickerRef) return null;
    if (this.datePickerRef.tagName === 'INPUT') {
      return this.datePickerRef;
    }
    return this.datePickerRef.querySelector('input:not([type=hidden])');
  };

  onOpenChange = (open) => {
    const { isInModal } = this.props;
    if (open) {
      this.toggleCalendar(open);
    }
    if (isInModal && !open) {
      this.props.onClose && this.props.onClose();
    }
  };

  toggleCalendar = (open) => {
    this.setState({ open });
  };

  onClear = () => {
    this.setState({ value: null });
    this.props.onCommit(null);
  };

  onFocusDatePicker = () => {
    this.setState({ open: true });
  };

  handleMouseDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  getCalendarContainer = () => {
    const { isInModal } = this.props;
    return isInModal ? this.calendarContainerRef.current : document.body;
  };

  handleKeyDown = (e) => {
    const directionKeyCodes = [37, 38, 39, 40];
    if (directionKeyCodes.includes(e.keyCode)) {
      e.stopPropagation();
    } else if (e.keyCode === KeyCodes.Enter) {
      e.preventDefault();
      this.onBlur();
      if (this.props.selectDownCell) this.props.selectDownCell();
    }
  };

  onClick = (e) => {
    if (!this.showHourAndMinute && e.target.className === 'rc-calendar-date') {
      this.timer = setTimeout(() => {
        this.closeEditor();
      }, 1);
    }
  };

  closeEditor = () => {
    this.toggleCalendar(false);
    this.onBlur();
  };

  onReadOnlyFocus = () => {
    this.toggleCalendar(true);
  };

  onClickRightPanelTime = () => {
    const { isInModal } = this.props;
    let onClickRightPanelTime = isInModal ? this.props.onClose : this.closeEditor;
    // we should change value and save it(async function), then close Editor.
    setTimeout(() => {
      onClickRightPanelTime && onClickRightPanelTime();
    }, 1);
  };

  componentDidMount() {
    const { value, lang, isInModal } = this.props;
    const iszhcn = (lang === 'zh-cn');
    if (iszhcn) {
      now = now.locale('zh-cn');
    } else {
      now = now.locale('en-gb');
    }
    this.timer = null;
    this.defaultCalendarValue = now.clone();
    if (value) {
      if (typeof value === 'string' && value.length === 1 && !isNaN(Number(value, 10))) {
        this.timer = setTimeout(() => {
          let inputDom = document.getElementsByClassName('rc-calendar-input')[0];
          if (inputDom) {
            inputDom.value = value;
          }
        }, 200);
        return;
      }
      let validValue = dayjs(value).isValid() ? dayjs(value) : dayjs(this.defaultCalendarValue);
      this.setState({
        value: iszhcn ? dayjs(validValue).locale('zh-cn') : dayjs(validValue).locale('en-gb')
      });
    }
    if (isInModal) {
      this.onReadOnlyFocus();
    }
    document.addEventListener('keydown', this.onHotKey, true);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onHotKey, true);
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  onHotKey = (e) => {
    if (e.keyCode === KeyCodes.Escape) {
      if (this.props.isInModal) {
        e.stopPropagation();
        this.props.onClose && this.props.onClose();
      }
    }
  };

  getDefaultTime = () => {
    const { value } = this.props;
    if (value) return dayjs(value).format('HH:mm');
    return '';
  };

  getCalender = () => {
    let { dateFormat, showHourAndMinute, lang, className, firstDayOfWeek } = this.props;
    let defaultValue = dayjs().clone();
    const defaultTime = this.getDefaultTime();
    const calanderFormat = Array.isArray(dateFormat) ? dateFormat : Array.of(dateFormat)
    return (
      <Calendar
        className={classnames('dtable-rc-calendar', className)}
        locale={initDateEditorLanguage(lang)}
        style={{ zIndex: 1001 }}
        format={calanderFormat}
        defaultValue={defaultValue}
        showHourAndMinute={showHourAndMinute}
        defaultMinutesTime={defaultTime}
        showDateInput={true}
        focusablePanel={false}
        onClear={this.onClear}
        firstDayOfWeek={firstDayOfWeek}
      />
    );
  };

  render() {
    let { dateFormat, isInModal } = this.props;
    let { open, value } = this.state;
    const calendar = this.getCalender();

    return (
      <div
        className={`date-picker-container ${isInModal ? 'modal-date-picker-container' : ''}`}
        ref={ref => this.datePickerRef = ref}
        onKeyDown={this.handleKeyDown}
        onClick={this.onClick}
      >
        <DatePicker
          open={open}
          value={value}
          animation="slide-up"
          style={{ zIndex: 1001 }}
          calendar={calendar}
          getCalendarContainer={this.getCalendarContainer}
          onChange={this.onChange}
          onOpenChange={this.onOpenChange}
        >
          {({ value }) => {
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
      </div>
    );
  }
}

PCDateEditor.propTypes = {
  isInModal: PropTypes.bool,
  lang: PropTypes.string.isRequired,
  value: PropTypes.string,
  dateFormat: PropTypes.string.isRequired,
  className: PropTypes.string,
  showHourAndMinute: PropTypes.bool.isRequired,
  onCommit: PropTypes.func.isRequired,
  firstDayOfWeek: PropTypes.string,
};

export default PCDateEditor;
