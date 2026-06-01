import PropTypes from 'prop-types';
import classnames from 'classnames';
import DTableDropdownMenu from '../DTableDropdownMenu';

const DTableSubDropdownMenu = ({ id, className, container, modifiers, flip, style, menuProps, children }) => {

  let customMenuProps = { ...menuProps };

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
    <DTableDropdownMenu
      id={id}
      className={classnames('dtable-sub-dropdown-menu', className)}
      menuProps={{
        ...customMenuProps,
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [-8, -1],
            },
          },
          ...(customMenuProps?.modifiers || []),
        ],
      }}
    >
      {children}
    </DTableDropdownMenu>
  );
};

DTableSubDropdownMenu.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  menuProps: PropTypes.object,
  container: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.node]),
  modifiers: PropTypes.array,
  flip: PropTypes.bool,
  style: PropTypes.object,
  children: PropTypes.node,
};

export default DTableSubDropdownMenu;
