import React, { useId } from 'react';
import DTableIcon from '../../DTableIcon';
import DTableToolTip from '../../DTableToolTip';
import { getLocale } from '../../lang';

import './index.css';

function ClearIcon() {
  const tooltipId = `dtable-ui-clear-icon-${useId().replace(/:/g, '')}`;
  const label = getLocale('Clear');

  return (
    <span id={tooltipId} className="dtable-ui-clear-icon" aria-label={label}>
      <DTableIcon symbol="close" ariaHidden={true} />
      <DTableToolTip target={tooltipId} placement="bottom">
        {label}
      </DTableToolTip>
    </span>
  );
}

export default ClearIcon;
