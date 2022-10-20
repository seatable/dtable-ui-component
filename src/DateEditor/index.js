import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import dayjs from 'dayjs';
import { getDateDisplayString }  from '../utils/value-format-utils';
import PCDateEditorPopover from './pc-date-editor-popover';
import MBDateEditorPopover from './mb-date-editor-popover';

import './index.css';

const propTypes = {
  isReadOnly: PropTypes.bool,
  value: PropTypes.string,
  lang: PropTypes.string,
  column: PropTypes.object.isRequired,
  onCommit: PropTypes.func.isRequired,
};

class DateEditor extends React.Component {

  static defaultProps = {
    isReadOnly: false,
    value: '',
    lang: 'en'
  }

  constructor(props) {
    super(props);
    this.state = {
      isDateInit: false,
      newValue: '',
      isPopoverShow: false,
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
      dateFormat: dateFormat,
      showHourAndMinute: dateFormat.indexOf('HH:mm') > -1,
    });
  }

  getDateFormat = () => {
    let { column } = this.props;
    let defaultDateFormat = 'YYYY-MM-DD';
    let dateFormat = column.data && column.data.format;
    return dateFormat || defaultDateFormat;
  }

  onDateEditorToggle = () => {
    const { isReadOnly } = this.props;
    if (isReadOnly) {
      return;
    }
    this.setState({isPopoverShow: !this.state.isPopoverShow});
  }

  onValueChanged = (value) => {
    if (value !== this.state.newValue) {
      this.setState({newValue: value});
      this.onCommit(value);
    }
  }

  onCommit = (newValue) => {
    let updated = {};
    let { column } = this.props;
    updated[column.key] = newValue;
    this.props.onCommit(updated);
  }

  onClosePopover = () => {
    this.setState({isPopoverShow: false});
  }

  render() {
    if (!this.state.isDateInit) {
      return (
        <div className="cell-editor date-editor">
          <div className="date-editor-container">
            <div className="control-form"></div>
          </div>
        </div>
      );
    }

    let { lang, column } = this.props;
    let { newValue, isPopoverShow, dateFormat, showHourAndMinute } = this.state;

    return (
      <div className="cell-editor dtable-ui-date-editor">
        {!isPopoverShow && (
          <div className="dtable-ui-date-editor-container">
            <div className="form-control" onClick={this.onDateEditorToggle}>{getDateDisplayString(newValue, dateFormat)}</div>
          </div>
        )}
        {isPopoverShow && (
          <Fragment>
            <MediaQuery query={'(min-width: 768px)'}>
              <PCDateEditorPopover
                lang={lang}
                value={newValue}
                dateFormat={dateFormat}
                showHourAndMinute={showHourAndMinute}
                onValueChanged={this.onValueChanged}
              />
            </MediaQuery>
            <MediaQuery query={'(max-width: 767.8px)'}>
              <MBDateEditorPopover
                isReadOnly={this.props.isReadOnly}
                lang={lang}
                value={newValue}
                dateFormat={dateFormat}
                showHourAndMinute={showHourAndMinute}
                column={column}
                onValueChanged={this.onValueChanged}
                onClosePopover={this.onClosePopover}
              />
            </MediaQuery>
          </Fragment>
        )}
      </div>
    );
  }
}

DateEditor.propTypes = propTypes;

export default DateEditor;
