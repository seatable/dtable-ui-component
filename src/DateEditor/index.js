import React from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import dayjs from '../utils/dayjs';
import PCDateEditorPopover from './pc-date-editor-popover';
import MBDateEditorPopover from './mb-date-editor-popover';

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
};

class DateEditor extends React.Component {

  static defaultProps = {
    isReadOnly: false,
    value: '',
    lang: 'en'
  };

  constructor(props) {
    super(props);
    this.state = {
      isDateInit: false,
      newValue: '',
      dateFormat: '',
      showHourAndMinute: false,
      defaultCalendarValue: null,
    };
  }

  componentDidMount() {
    const { value, lang } = this.props;
    dayjs.locale(lang);
    let dateFormat = this.getDateFormat();
    this.setState({
      isDateInit: true,
      newValue: value,
      dateFormat,
      showHourAndMinute: dateFormat.indexOf('HH:mm') > -1,
    });
  }

  getDateFormat = () => {
    let { column } = this.props;
    let defaultDateFormat = 'YYYY-MM-DD';
    let dateFormat = column.data && column.data.format;
    return dateFormat || defaultDateFormat;
  };

  onValueChanged = (value) => {
    if (value !== this.state.newValue) {
      this.setState({ newValue: value });
      this.onCommit(value);
    }
  };

  onCommit = (newValue) => {
    this.props.onCommit(newValue);
  };

  render() {
    if (!this.state.isDateInit) {
      return null;
    }

    let { lang, column, className, isInModal } = this.props;
    let { newValue, dateFormat, showHourAndMinute } = this.state;

    return (
      <>
        <MediaQuery query={'(min-width: 768px)'}>
          <PCDateEditorPopover
            className={className}
            lang={lang}
            isInModal={isInModal}
            value={newValue}
            dateFormat={dateFormat}
            showHourAndMinute={showHourAndMinute}
            onValueChanged={this.onValueChanged}
            hideCalendar={this.props.hideCalendar}
          />
        </MediaQuery>
        <MediaQuery query={'(max-width: 767.8px)'}>
          <MBDateEditorPopover
            className={className}
            isReadOnly={this.props.isReadOnly}
            lang={lang}
            value={newValue}
            dateFormat={dateFormat}
            showHourAndMinute={showHourAndMinute}
            column={column}
            onValueChanged={this.onValueChanged}
            onClosePopover={this.props.hideCalendar}
          />
        </MediaQuery>
      </>
    );
  }
}

DateEditor.propTypes = propTypes;

export default DateEditor;
