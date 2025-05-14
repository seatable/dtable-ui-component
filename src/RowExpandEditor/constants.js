import { CellType } from 'dtable-utils';
import RowExpandTextEditor from './text-editor';
import RowExpandSingleSelectEditor from './single-select-editor';
import RowExpandMultipleSelectEditor from './multiple-select-editor';
import RowExpandUrlEditor from './url-editor';
import RowExpandNumberEditor from './number-editor';
import RowExpandDateEditor from './date-editor';
import RowExpandLongTextEditor from './long-text-editor';
import RowExpandCheckboxEditor from './checkbox-editor';
import RowExpandEmailEditor from './email-editor';
import RowExpandDurationEditor from './duration-editor';
import RowExpandRateEditor from './rate-editor';
import RowExpandCollaboratorEditor from './collaborator-editor';
import RowExpandDepartmentEditor from './department-editor';
import RowExpandImageEditor from './image-editor';
import RowExpandFileEditor from './file-editor';
import RowExpandDigitalSignEditor from './digital-sign-editor';
import RowExpandGeolocationEditor from './geolocation-editor';

const CELL_EDITOR_MAP = {
  [CellType.TEXT]: RowExpandTextEditor,
  [CellType.SINGLE_SELECT]: RowExpandSingleSelectEditor,
  [CellType.MULTIPLE_SELECT]: RowExpandMultipleSelectEditor,
  [CellType.NUMBER]: RowExpandNumberEditor,
  [CellType.DATE]: RowExpandDateEditor,
  [CellType.URL]: RowExpandUrlEditor,
  [CellType.LONG_TEXT]: RowExpandLongTextEditor,
  [CellType.CHECKBOX]: RowExpandCheckboxEditor,
  [CellType.EMAIL]: RowExpandEmailEditor,
  [CellType.DURATION]: RowExpandDurationEditor,
  [CellType.RATE]: RowExpandRateEditor,
  [CellType.COLLABORATOR]: RowExpandCollaboratorEditor,
  [CellType.DEPARTMENT_SINGLE_SELECT]: RowExpandDepartmentEditor,
  [CellType.IMAGE]: RowExpandImageEditor,
  [CellType.FILE]: RowExpandFileEditor,
  [CellType.DIGITAL_SIGN]: RowExpandDigitalSignEditor,
  [CellType.GEOLOCATION]: RowExpandGeolocationEditor,
};

export { CELL_EDITOR_MAP };
