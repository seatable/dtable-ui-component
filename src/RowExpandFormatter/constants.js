import { CellType } from 'dtable-utils';
import TextFormatter from '../TextFormatter';
import NumberFormatter from '../NumberFormatter';
import CheckboxFormatter from '../CheckboxFormatter';
import DateFormatter from '../DateFormatter';
import SingleSelectFormatter from '../SingleSelectFormatter';
import MultipleSelectFormatter from '../MultipleSelectFormatter';
import CollaboratorFormatter from '../CollaboratorFormatter';
import LongTextFormatter from '../LongTextFormatter';
import GeolocationFormatter from '../GeolocationFormatter';
import CTimeFormatter from '../CTimeFormatter';
import CreatorFormatter from '../CreatorFormatter';
import LastModifierFormatter from '../LastModifierFormatter';
import MTimeFormatter from '../MTimeFormatter';
import AutoNumberFormatter from '../AutoNumberFormatter';
import DurationFormatter from '../DurationFormatter';
import ButtonFormatter from '../ButtonFormatter';
import DigitalSignFormatter from '../DigitalSignFormatter';
import RowExpandUrlFormatter from './url-formatter';
import RowExpandEmailFormatter from './email-formatter';
import RowExpandRateFormatter from './rate-formatter';
import RowExpandImageFormatter from './image-formatter';
import RowExpandFileFormatter from './file-formatter';
import RowExpandLinkFormatter from './link-formatter';
import RowExpandFormulaFormatter from './formula-formatter';
import RowExpandDepartmentFormatter from './department-formatter';

export const DEFAULT_FORMATTER = {
  [CellType.TEXT]: TextFormatter,
  [CellType.NUMBER]: NumberFormatter,
  [CellType.CHECKBOX]: CheckboxFormatter,
  [CellType.DATE]: DateFormatter,
  [CellType.SINGLE_SELECT]: SingleSelectFormatter,
  [CellType.MULTIPLE_SELECT]: MultipleSelectFormatter,
  [CellType.COLLABORATOR]: CollaboratorFormatter,
  [CellType.LONG_TEXT]: LongTextFormatter,
  [CellType.GEOLOCATION]: GeolocationFormatter,
  [CellType.CTIME]: CTimeFormatter,
  [CellType.CREATOR]: CreatorFormatter,
  [CellType.LAST_MODIFIER]: LastModifierFormatter,
  [CellType.MTIME]: MTimeFormatter,
  [CellType.AUTO_NUMBER]: AutoNumberFormatter,
  [CellType.DURATION]: DurationFormatter,
  [CellType.BUTTON]: ButtonFormatter,
  [CellType.URL]: RowExpandUrlFormatter,
  [CellType.EMAIL]: RowExpandEmailFormatter,
  [CellType.RATE]: RowExpandRateFormatter,
  [CellType.IMAGE]: RowExpandImageFormatter,
  [CellType.FILE]: RowExpandFileFormatter,
  [CellType.LINK]: RowExpandLinkFormatter,
  [CellType.FORMULA]: RowExpandFormulaFormatter,
  [CellType.LINK_FORMULA]: RowExpandFormulaFormatter,
  [CellType.DIGITAL_SIGN]: DigitalSignFormatter,
  [CellType.DEPARTMENT_SINGLE_SELECT]: RowExpandDepartmentFormatter,
};
