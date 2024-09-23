import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { CellType, FORMULA_RESULT_TYPE, getFormulaDisplayString, getColumnType, DISPLAY_INTERNAL_ERRORS } from 'dtable-utils';
import BaseFormatterConfig from '../formatterConfig/base-formatter-config';
import TextFormatter from '../TextFormatter';
import {
  isArrayFormatColumn, isSimpleCellFormatter, isFunction,
  convertValueToDtableLongTextValue, isValidUrl, openUrlLink,
} from '../FormulaFormatter/utils';
import cellValueValidator from '../FormulaFormatter/cell-value-validator';
import toaster from '../toaster';
import { getLocale } from '../lang';

import '../FormulaFormatter/index.css';

export default class RowExpandFormulaFormatter extends React.Component {

  static propTypes = {
    value: PropTypes.any,
    column: PropTypes.object,
    containerClassName: PropTypes.string,
    collaborators: PropTypes.array,
  };

  getGridCellClassName = (resultType) => {
    switch (resultType) {
      case FORMULA_RESULT_TYPE.NUMBER:
      case FORMULA_RESULT_TYPE.DATE: {
        return 'text-right';
      }
      default: {
        return '';
      }
    }
  };

  onOpenUrlLink = (url) => {
    if (!isValidUrl(url)) {
      url = `http://${url}`;
    }
    try {
      openUrlLink(url);
    } catch {
      toaster.danger(getLocale('URL_is_invalid'));
    }
  };

  onOpenEmailLink = (email) => {
    window.location.href = `mailto:${email.trim()}`;
  };

  renderBorder = (dom) => {
    const { column } = this.props;
    const { result_type } = column.data;
    let style = { minHeight: '38px' };
    if (result_type === FORMULA_RESULT_TYPE.DATE || result_type === FORMULA_RESULT_TYPE.NUMBER) {
      style = { width: '320px' };
    }
    const columnType = getColumnType(column);
    if ([CellType.URL, CellType.EMAIL].includes(columnType)) {
      style = { ...style, position: 'relative' };
    }
    return (
      <div className="d-flex align-items-center form-control disabled h-auto" style={style}>{dom}</div>
    );
  };

  renderCellValue = (cellValue, resultType) => {
    const { containerClassName } = this.props;
    const customClassName = this.getGridCellClassName(resultType);
    const className = `dtable-ui cell-formatter-container formula-formatter ${containerClassName} ${customClassName}`;
    return this.renderBorder(
      <div className={className} title={cellValue} aria-label={cellValue}>{cellValue}</div>
    );
  };

  renderInternalErrorValue = (errorValue, resultType) => {
    return this.renderCellValue(errorValue, resultType);
  };

  renderOtherColumnFormatter = () => {
    const { value, column, collaborators } = this.props;
    const { array_type, array_data } = column.data;
    if (!array_type || array_type === CellType.LINK) {
      return null;
    }
    const Formatter = BaseFormatterConfig[array_type];
    let formatterProps = this.getFormatterProps(array_type, array_data, collaborators);

    if (isArrayFormatColumn(array_type)) {
      formatterProps.value = value;
      return this.renderBorder(this.createColumnFormatter(Formatter, formatterProps));
    }

    const columnType = getColumnType(column);
    let cellValue = value;
    if (!Array.isArray(value)) {
      cellValue = cellValueValidator(value, array_type) ? [value] : [];
    }
    let formulaUrl = '';
    if (columnType === CellType.URL) {
      formulaUrl = cellValue[0];
      formulaUrl = formulaUrl ? formulaUrl.trim() : '';
    }
    let formulaEmail = '';
    if (columnType === CellType.EMAIL) {
      formulaEmail = cellValue[0];
      formulaEmail = formulaEmail ? formulaEmail.trim() : '';
    }
    return this.renderBorder(
      <div className="dtable-ui formula-formatter multiple">
        {cellValue.map((v, index) => {
          formatterProps.value = v;
          return (
            <div
              className={classnames('formula-formatter-content-item',
                { 'simple-cell-formatter': isSimpleCellFormatter(array_type) },
                { 'formula-url-formatter-column': formulaUrl || formulaEmail }
              )}
              key={`formula-formatter-content-item-${index}`}
            >
              {formulaUrl &&
                <span aria-hidden="true" className="dtable-font dtable-icon-url formula-url-link" onClick={this.onOpenUrlLink.bind(this, formulaUrl)}></span>
              }
              {formulaEmail &&
                <span aria-hidden="true" className="dtable-font dtable-icon-email formula-email-link" onClick={this.onOpenEmailLink.bind(this, formulaEmail)}></span>
              }
              {this.createColumnFormatter(Formatter, formatterProps)}
            </div>
          );
        })}
      </div>
    );
  };

  createColumnFormatter(Formatter, formatterProps) {
    if (React.isValidElement(Formatter)) {
      return React.cloneElement(Formatter, { ...formatterProps });
    }
    else if (isFunction(Formatter)) {
      return <Formatter {...formatterProps} />;
    }
    else {
      return <TextFormatter {...formatterProps} />;
    }
  }

  getFormatterProps = (array_type, array_data, collaborators) => {
    switch (array_type) {
      case CellType.DURATION: {
        const { duration_format } = array_data;
        return { format: duration_format };
      }
      case CellType.NUMBER:
      case CellType.RATE:
      case CellType.GEOLOCATION: {
        return { data: array_data };
      }
      default: {
        return { ...array_data, collaborators };
      }
    }
  };

  render() {
    let { column, collaborators, value } = this.props;
    const { data } = column;
    const { array_type, result_type } = data;

    if (DISPLAY_INTERNAL_ERRORS.includes(value)) {
      return this.renderInternalErrorValue(value, result_type);
    }

    if (array_type === CellType.LONG_TEXT && Array.isArray(value)) {
      value = value.map(item => convertValueToDtableLongTextValue(item));
    }

    if (result_type === FORMULA_RESULT_TYPE.ARRAY) {
      return this.renderOtherColumnFormatter();
    }

    if (typeof value === 'object') {
      return null;
    }

    const formattedValue = getFormulaDisplayString(value, data, { collaborators });
    return this.renderCellValue(formattedValue, result_type);
  }
}
