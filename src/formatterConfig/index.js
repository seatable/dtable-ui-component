import React from 'react';
import { CellType } from '../constants';
import CheckboxFormatter from '../CheckboxFormatter';
import ImageFormatter from '../ImageFormatter';
import LongTextFormatter from '../LongTextFormatter';
import TextCellFormatter from '../TextFormatter';
import SingleSelectFormatter from '../SingleSelectFormatter';
import MultipleSelectFormatter from '../MultipleSelectFormatter';
import FileFormatter from '../FileFormatter';
import LinkFormatter from '../LinkFormatter';
import CollaboratorFormatter from '../CollaboratorFormatter';
import NumberFormatter from '../NumberFormatter';
import DateFormatter from '../DateFormatter';
import CreatorFormatter from '../CreatorFormatter';
import CTimeFormatter from '../CTimeFormatter';
import LastModifierFormatter from '../LastModifierFormatter';
import MTimeFormatter from '../MTimeFormatter';
import GeolocationFormatter from '../GeolocationFormatter';
import FormulaFormatter from '../FormulaFormatter';
import AutoNumberFormatter from '../AutoNumberFormatter';
import UrlFormatter from '../UrlFormatter';
import EmailFormatter from '../EmailFormatter';
import DurationFormatter from '../DurationFormatter';
import RateFormatter from '../RateFormatter';
import ButtonFormatter from '../ButtonFormatter';

const FormatterConfig = {
  [CellType.DEFAULT]: <TextCellFormatter />,
  [CellType.TEXT]: <TextCellFormatter />,
  [CellType.CHECKBOX]: <CheckboxFormatter />,
  [CellType.LONG_TEXT]: <LongTextFormatter />,
  [CellType.SINGLE_SELECT]: <SingleSelectFormatter />,
  [CellType.IMAGE]: <ImageFormatter />,
  [CellType.FILE]: <FileFormatter />,
  [CellType.MULTIPLE_SELECT]: <MultipleSelectFormatter />,
  [CellType.COLLABORATOR]: <CollaboratorFormatter />,
  [CellType.NUMBER]: <NumberFormatter />,
  [CellType.DATE]: <DateFormatter />,
  [CellType.LINK]: <LinkFormatter />,
  [CellType.CREATOR]: <CreatorFormatter />,
  [CellType.CTIME]: <CTimeFormatter />,
  [CellType.LAST_MODIFIER]: <LastModifierFormatter />,
  [CellType.MTIME]: <MTimeFormatter />,
  [CellType.GEOLOCATION]: <GeolocationFormatter />,
  [CellType.FORMULA]: <FormulaFormatter />,
  [CellType.AUTO_NUMBER]: <AutoNumberFormatter />,
  [CellType.URL]: <UrlFormatter />,
  [CellType.EMAIL]: <EmailFormatter />,
  [CellType.DURATION]: <DurationFormatter />,
  [CellType.RATE]: <RateFormatter />,
  [CellType.BUTTON]: <ButtonFormatter />,
};

export default FormatterConfig;
