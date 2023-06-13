import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { CellType } from 'dtable-store';
import {
  TextFormatter,
  NumberFormatter,
  CheckboxFormatter,
  DateFormatter,
  SingleSelectFormatter,
  MultipleSelectFormatter,
  CollaboratorFormatter,
  SimpleLongTextFormatter,
  GeolocationFormatter,
  LinkFormatter,
  CTimeFormatter,
  CreatorFormatter,
  LastModifierFormatter,
  MTimeFormatter,
  AutoNumberFormatter,
  UrlFormatter,
  EmailFormatter,
  DurationFormatter,
  RateFormatter,
  ButtonFormatter,
  ImageFormatter,
  FileFormatter,
  // LongTextFormatter,
  // FormulaFormatter,
} from './index';
import { COLLABORATORS } from './data/dtable-value';

const propTypes = {
  type: PropTypes.string,
  className: PropTypes.string,
  column: PropTypes.object.isRequired,
  row: PropTypes.object.isRequired,
  CellType: PropTypes.object,
  getOptionColors: PropTypes.func,
};

const emptyTypeMap = {
  [CellType.TEXT]: true,
  [CellType.LONG_TEXT]: true,
  [CellType.GEOLOCATION]: true,
  [CellType.SINGLE_SELECT]: true,
  [CellType.MULTIPLE_SELECT]: true,
  [CellType.CTIME]: true,
  [CellType.MTIME]: true,
  [CellType.DATE]: true,
  [CellType.AUTO_NUMBER]: true,
  [CellType.URL]: true,
  [CellType.EMAIL]: true,
  [CellType.DURATION]: true,
  [CellType.IMAGE]: true,
  [CellType.FILE]: true,
};

class EditorFormatter extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      collaborators: COLLABORATORS,
    };
  }

  renderEmptyFormatter = () => {
    let emptyFormatter = <span className="row-cell-empty d-inline-block"></span>;
    if (this.props.type === 'row_title') {
      emptyFormatter = <span>未命名行</span>;
    }
    return emptyFormatter;
  }

  renderFormatter = () => {
    const { column, row, CellType, className } = this.props;
    let { type: columnType } = column;

    const { collaborators } = this.state;
    const containerClassName = `dtable-${columnType}-formatter ${className || ''}`;
    let cellValue = row[column.key];

    if (!cellValue && emptyTypeMap[columnType]) {
      return this.renderEmptyFormatter();
    }

    switch(columnType) {
      case CellType.TEXT: {
        return <TextFormatter value={cellValue} containerClassName={containerClassName} />;
      }
      case CellType.COLLABORATOR: {
        if (!cellValue || cellValue.length === 0) {
          return this.renderEmptyFormatter();
        }
        let collaboratorFormatter = (
          <CollaboratorFormatter
            value={cellValue}
            collaborators={collaborators}
            containerClassName={containerClassName}
          />
        );
        return collaboratorFormatter;
      }
      case CellType.LONG_TEXT: {
        let longTextFormatter = <SimpleLongTextFormatter value={cellValue} containerClassName={containerClassName} />;
        if (!cellValue) {
          longTextFormatter =  this.renderEmptyFormatter();
        }
        return longTextFormatter;
      }
      case CellType.IMAGE: {
        let imageFormatter = <ImageFormatter value={cellValue} />;
        if (!cellValue || cellValue.length === 0) {
          imageFormatter = this.renderEmptyFormatter();
        }
        return imageFormatter;
      }
      case CellType.GEOLOCATION : {
        let geolocationFormatter = (
          <GeolocationFormatter value={cellValue} data={column.data} containerClassName={containerClassName} />
        );
        if (!cellValue) {
          geolocationFormatter = this.renderEmptyFormatter();
        }
        return geolocationFormatter;
      }
      case CellType.NUMBER: {
        let numberFormatter = <NumberFormatter value={cellValue} data={column.data} containerClassName={containerClassName} />;
        if (!cellValue) {
          numberFormatter = this.renderEmptyFormatter();
        }
        return numberFormatter;
      }
      case CellType.DATE: {
        let dateFormatter = <DateFormatter value={cellValue} format={column.data.format} containerClassName={containerClassName} />;
        if (!cellValue) {
          dateFormatter =  this.renderEmptyFormatter();
        }
        return dateFormatter;
      }
      case CellType.MULTIPLE_SELECT: {
        const options = column.data ? column.data.options : [];
        let multipleSelectFormatter = <MultipleSelectFormatter value={cellValue} options={options} containerClassName={containerClassName} />;
        if (!cellValue || cellValue.length === 0) {
          multipleSelectFormatter = this.renderEmptyFormatter();
        }
        return multipleSelectFormatter;
      }
      case CellType.SINGLE_SELECT: {
        const options = column.data ? column.data.options : [];
        let singleSelectFormatter = <SingleSelectFormatter value={cellValue} options={options} containerClassName={containerClassName} />;
        if (!cellValue) {
          singleSelectFormatter = this.renderEmptyFormatter();
        }
        return singleSelectFormatter;
      }
      case CellType.FILE: {
        let fileFormatter = <FileFormatter value={cellValue} isSample />;
        if (!cellValue || cellValue.length === 0) {
          fileFormatter = this.renderEmptyFormatter();
        }
        return fileFormatter;
      }
      case CellType.CHECKBOX: {
        return  <CheckboxFormatter value={cellValue} />;
      }
      case CellType.CTIME: {
        let cTimeFormatter = <CTimeFormatter value={row._ctime} containerClassName={containerClassName} />;
        if (!row._ctime) {
          cTimeFormatter = this.renderEmptyFormatter();
        }
        return cTimeFormatter;
      }
      case CellType.MTIME: {
        let mTimeFormatter = <MTimeFormatter value={row._mtime} containerClassName={containerClassName} />;
        if (!row._mtime) {
          mTimeFormatter = this.renderEmptyFormatter();
        }
        return mTimeFormatter;
      }
      case CellType.CREATOR: {
        if (!cellValue) return this.renderEmptyFormatter();
        let creatorFormatter = <CreatorFormatter collaborators={collaborators} value={cellValue} containerClassName={containerClassName} />;
        return creatorFormatter;
      }
      case CellType.LAST_MODIFIER: {
        if (!cellValue) return this.renderEmptyFormatter();
        let lastModifierFormatter = <LastModifierFormatter collaborators={collaborators} value={cellValue} containerClassName={containerClassName} />;
        return lastModifierFormatter;
      }
      case CellType.FORMULA:
      case CellType.LINK_FORMULA: {
        let textFormatter = <TextFormatter value={cellValue} containerClassName={containerClassName} />;
        if (!cellValue) {
          textFormatter = this.renderEmptyFormatter();
        }
        return textFormatter;
      }
      case CellType.LINK: {
        if (!Array.isArray(cellValue) || cellValue.length === 0) return this.renderEmptyFormatter();
        return (
          <LinkFormatter
            value={cellValue}
            column={column}
            collaborators={collaborators}
            containerClassName={'map-app-link-formatter'}
            renderEmptyFormatter={this.renderEmptyFormatter}
            getOptionColors={this.props.getOptionColors}
            getUserCommonInfo={() => {}}
            CellType={CellType}
          />
        );
      }
      case CellType.AUTO_NUMBER: {
        return <AutoNumberFormatter value={cellValue} containerClassName={containerClassName} />;
      }
      case CellType.URL: {
        return <UrlFormatter value={cellValue} containerClassName={containerClassName} />;
      }
      case CellType.EMAIL: {
        return <EmailFormatter value={cellValue} containerClassName={containerClassName} />;
      }
      case CellType.DURATION: {
        return <DurationFormatter value={cellValue} format={column.data.duration_format} containerClassName={containerClassName} />;
      }
      case CellType.RATE: {
        return <RateFormatter value={cellValue} data={column.data} containerClassName={containerClassName} />;
      }
      case CellType.BUTTON: {
        const { data = {} } = column;
        let buttonFormatter = <ButtonFormatter data={data} containerClassName={containerClassName} />;
        if (!data.button_name) {
          buttonFormatter = this.renderEmptyFormatter();
        }
        return buttonFormatter;
      }
      default:
        return null;
    }
  }

  render() {
    return(
      <Fragment>
        {this.renderFormatter()}
      </Fragment>
    );
  }
}

EditorFormatter.propTypes = propTypes;

export default EditorFormatter;
