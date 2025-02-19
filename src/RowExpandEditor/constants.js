import { CellType } from 'dtable-utils';
import RowExpandTextEditor from './RowExpandTextEditor';
import RowExpandSingleSelectEditor from './RowExpandSingleSelectorEditor';
import RowExpandMultipleSelectEditor from './RowExpandMultipleSelectEditor';
import RowExpandUrlEditor from './RowExpandUrlEditor';
import RowExpandNumberEditor from './RowExpandNumberEditor';
import RowExpandDateEditor from './RowExpandDateEditor';
import RowExpandLongTextEditor from './RowExpandLongTextEditor';
import RowExpandCheckboxEditor from './RowExpandCheckboxEditor';
import RowExpandEmailEditor from './RowExpandEmailEditor';
import RowExpandDurationEditor from './RowExpandDurationEditor';
import RowExpandRateEditor from './RowExpandRateEditor';
import RowExpandCollaboratorEditor from './RowExpandCollaboratorEditor';
import RowExpandDepartmentEditor from './RowExpandDepartmentEditor';
import RowExpandImageEditor from './RowExpandImageEditor';
import RowExpandFileEditor from './RowExpandFileEditor';
import RowExpandDigitalSignEditor from './RowExpandDigitalSignEditor';
import RowExpandGeolocationEditor from './RowExpandGeolocationEditor';

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
