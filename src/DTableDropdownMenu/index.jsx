import PropTypes from 'prop-types';
import { DropdownMenu } from 'reactstrap';
import classnames from 'classnames';

const DTableDropdownMenu = ({ id, className, container, modifiers, flip, style, menuProps, children }) => {

  let customMenuProps = { ...menuProps };

  customMenuProps.modifiers = [
    { name: 'preventOverflow', options: { boundary: document.body } },
    ...(customMenuProps?.modifiers || []),
  ];

  if (container) {
    customMenuProps.container = container;
  }

  if (style) {
    customMenuProps.style = style;
  }

  if (Array.isArray(modifiers)) {
    customMenuProps.modifiers = modifiers;
  }

  if (typeof flip === 'boolean') {
    customMenuProps.flip = flip;
  }

  return (
    <DropdownMenu
      id={id}
      className={classnames('dtable-dropdown-menu', className)}
      {...customMenuProps}
    >
      {children}
    </DropdownMenu>
  );
};

DTableDropdownMenu.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  menuProps: PropTypes.object,
  container: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.node]),
  modifiers: PropTypes.array,
  flip: PropTypes.bool,
  style: PropTypes.object,
  children: PropTypes.node,
};

export default DTableDropdownMenu;
