import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { CellType } from '../constants';
import { MultipleSelectFormatter, DateFormatter, CTimeFormatter, MTimeFormatter } from '../index';
import CollaboratorItemFormatter from './collaborator-item-formatter';
import { getFormulaArrayValue, isArrayFormalColumn } from './utils';
import { getCellDisplayValue } from './value-display-utils';
import './index.css';

export default class RowExpandLinkFormatter extends Component {

  static propTypes = {
    column: PropTypes.object.isRequired,
    value: PropTypes.any,
    collaborators: PropTypes.array,
    containerClassName: PropTypes.string,
    renderEmpty: PropTypes.func,
    context: PropTypes.object,
  }

  render() {
    const props = this.props;
    const { column, value, containerClassName, collaborators } = props;
    const { data } = column;

    if (!Array.isArray(value) || value.length === 0) {
      return props.renderEmpty();
    }

    let { display_column: displayColumn } = data || {};
    if (!displayColumn) {
      return props.renderEmpty();
    }

    const { type: displayColumnType, data: displayColumnData } = displayColumn;
    const cellValue = getFormulaArrayValue(value, !isArrayFormalColumn(displayColumnType));

    if (!Array.isArray(cellValue) || cellValue.length === 0) {
      return props.renderEmpty();
    }

    switch(displayColumnType) {
      case CellType.TEXT:
      case CellType.AUTO_NUMBER:
      case CellType.EMAIL:
      case CellType.URL:
      case CellType.DURATION:
      case CellType.NUMBER: {
        return (
          <div className={containerClassName}>
            {cellValue.map((value, index) => {
              if (!value) return null;
              return (
                <div key={`link-${displayColumnType}-${index}`} className="row-expand-link-item">
                  {value}
                </div>
              );
            })}
          </div>
        );
      }
      case CellType.DATE: {
        return (
          <div className={containerClassName}>
            {cellValue.map((value, index) => {
              if (!value || typeof value !== 'string') return null;
              const { format } = displayColumnData || {};
              return (
                <DateFormatter
                  key={`link-${displayColumnType}-${index}`}
                  value={value.replace('T', ' ').replace('Z', '')}
                  format={format}
                  containerClassName="row-expand-link-item"
                />
              );
            })}
          </div>
        );
      }
      case CellType.CTIME: {
        return (
          <div className={containerClassName}>
            {cellValue.map((value, index) => {
              if (!value) return null;
              return (
                <CTimeFormatter
                  key={`link-${displayColumnType}-${index}`}
                  value={value}
                  containerClassName="row-expand-link-item"
                />
              );
            })}
          </div>
        );
      }
      case CellType.MTIME: {
        return (
          <div className={containerClassName}>
            {cellValue.map((value, index) => {
              if (!value) return null;
              return (
                <MTimeFormatter
                  key={`link-${displayColumnType}-${index}`}
                  value={value}
                  containerClassName="row-expand-link-item"
                />
              );
            })}
          </div>
        );
      }
      case CellType.CREATOR:
      case CellType.LAST_MODIFIER: {
        return (
          <div className="dtable-ui cell-formatter-container collaborator-formatter sql-query-collaborator-formatter">
            {cellValue.map((value, index) => {
              if (!value) return null;
              return (
                <CollaboratorItemFormatter
                  key={`link-${displayColumnType}-${index}`}
                  cellValue={value}
                  collaborators={collaborators}
                  context={props.context}
                  renderEmpty={props.renderEmpty}
                />
              );
            })}
          </div>
        );
      }
      case CellType.SINGLE_SELECT: {
        const options = displayColumnData && Array.isArray(displayColumnData.options) ? displayColumnData.options : [];
        return (
          <MultipleSelectFormatter
            value={cellValue}
            options={options || []}
          />
        );
      }
      case CellType.FORMULA: {
        return (
          <div className={containerClassName}>
            {cellValue.map((value, index) => {
              if (!value) return null;
              return (
                <div key={`link-${displayColumnType}-${index}`} className="row-expand-link-item">
                  {getCellDisplayValue({[displayColumn.key]: value}, displayColumn, collaborators)}
                </div>
              );
            })}
          </div>
        );
      }
      default: {
        return props.renderEmpty();
      }
    }
  }
}
