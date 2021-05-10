import React from 'react';
import * as CellTypes from '../../utils/cell-types';
import CheckboxFormatter from './checkbox-formatter';
import ImageFormatter from './image-formatter';
import LongTextFormatter from './long-text-formatter';
import TextCellFormatter from './text-formatter';
import SingleSelectFormatter from './single-select-formatter';
import MultipleSelectFormatter from './multiple-select-formatter';
import FileFormatter from './file-formatter';
import LinkFormatter from './link-formatter';
import CollaboratorFormatter from './collaborator-formatter';
import NumberFormatter from './number-formatter';
import DateFormatter from './date-formatter';
import CreatorFormatter from './creator-formatter';
import CTimeFormatter from './ctime-formatter';
import LastModifierFormatter from './last-modifier-formatter';
import MTimeFormatter from './mtime-formatter';
import GeolocationFormatter from './geolocation-formatter';
import FormulaFormatter from './formula-formatter';
import AutoNumberFormatter from './auto-number-formatter';
import UrlFormatter from './url-formatter';
import EmailFormatter from './email-formatter';
import DurationFormatter from './duration-formatter';
import RateFormatter from './rate-formatter';

const FormatterConfig = {
  [CellTypes.DEFAULT]: <TextCellFormatter />,
  [CellTypes.TEXT]: <TextCellFormatter />,
  [CellTypes.CHECKBOX]: <CheckboxFormatter />,
  [CellTypes.LONG_TEXT]: <LongTextFormatter />,
  [CellTypes.SINGLE_SELECT]: <SingleSelectFormatter />,
  [CellTypes.IMAGE]: <ImageFormatter />,
  [CellTypes.FILE]: <FileFormatter />,
  [CellTypes.MULTIPLE_SELECT]: <MultipleSelectFormatter />,
  [CellTypes.COLLABORATOR]: <CollaboratorFormatter />,
  [CellTypes.NUMBER]: <NumberFormatter />,
  [CellTypes.DATE]: <DateFormatter />,
  [CellTypes.LINK]: <LinkFormatter />,
  [CellTypes.CREATOR]: <CreatorFormatter />,
  [CellTypes.CTIME]: <CTimeFormatter />,
  [CellTypes.LAST_MODIFIER]: <LastModifierFormatter />,
  [CellTypes.MTIME]: <MTimeFormatter />,
  [CellTypes.GEOLOCATION]: <GeolocationFormatter />,
  [CellTypes.FORMULA]: <FormulaFormatter />,
  [CellTypes.AUTO_NUMBER]: <AutoNumberFormatter />,
  [CellTypes.URL]: <UrlFormatter />,
  [CellTypes.EMAIL]: <EmailFormatter />,
  [CellTypes.DURATION]: <DurationFormatter />,
  [CellTypes.RATE]: <RateFormatter />,
};

export default FormatterConfig;