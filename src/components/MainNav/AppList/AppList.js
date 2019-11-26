/**
 * App List
 */

import React, { Component, Fragment } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Dropdown } from '@folio/stripes-components/lib/Dropdown';
import DropdownMenu from '@folio/stripes-components/lib/DropdownMenu';
import Icon from '@folio/stripes-components/lib/Icon';

import { ResizeContainer, AppListDropdown } from './components';
import NavButton from '../NavButton';
import css from './AppList.css';

class AppList extends Component {
  static propTypes = {
    apps: PropTypes.arrayOf(
      PropTypes.shape({
        displayName: PropTypes.string,
        description: PropTypes.string,
        id: PropTypes.string,
        href: PropTypes.string,
        active: PropTypes.bool,
        name: PropTypes.string,
        icon: PropTypes.string,
        iconData: PropTypes.object, // Only need because "Settings" isn't a standalone app yet
      }),
    ),
    dropdownId: PropTypes.string,
    dropdownToggleId: PropTypes.string.isRequired,
    selectedApp: PropTypes.object,
  }

  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };

    this.focusHandlers = {
      open: (trigger, menu, firstItem) => {
        if (this.props.selectedApp) {
          /* the selected app may not be in the list...
           * if focusing the selected item fails, focus
           * the first item... */
          if (!this.focusSelectedItem()) {
            firstItem.focus();
          }
          // If not; focus first item in the list
        } else if (firstItem) firstItem.focus();
      }
    };

    this.dropdownListRef = React.createRef();
    this.dropdownToggleRef = React.createRef();
  }

  /**
   * focus management
   */
  focusSelectedItem = () => {
    const selectedApp = this.props.selectedApp;
    if (selectedApp) {
      const activeElement = document.getElementById(`app-list-dropdown-item-${selectedApp.id}`);
      if (activeElement) {
        activeElement.focus();
        return true;
      }
    }
    return false;
  }

  /**
   * Get the nav buttons that is displayed
   * in the app header on desktop
   */
  renderNavButtons = (refs, hiddenItemIds, itemWidths) => {
    const { selectedApp, apps } = this.props;

    return (
      <ul className={css.navItemsList}>
        {
          apps.map(app => {
            const hidden = hiddenItemIds.includes(app.id);

            return (
              <li
                className={classnames(css.navItem, { [css.hidden]: hidden })}
                key={app.id}
                ref={refs[app.id]}
                aria-hidden={hidden}
                style={{ width: itemWidths[app.id] }}
              >
                <NavButton
                  data-test-app-list-item
                  aria-label={app.displayName}
                  iconData={app.iconData}
                  iconKey={app.name}
                  id={`app-list-item-${app.id}`}
                  label={app.displayName}
                  role="button"
                  selected={selectedApp && selectedApp.id === app.id}
                  to={app.href}
                />
              </li>
            );
          })
        }
      </ul>
    );
  }

  /**
   * The button that toggles the dropdown
   */
  renderDropdownToggleButton = ({ open, getTriggerProps }) => {
    const { dropdownToggleId } = this.props;
    const icon = (
      <svg className={css.dropdownToggleIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M8.4 2.4H5.1c-1.5 0-2.7 1.2-2.7 2.7v3.3c0 1.5 1.2 2.7 2.7 2.7h3.3c1.5 0 2.7-1.2 2.7-2.7V5.1c0-1.5-1.2-2.7-2.7-2.7zm.7 6c0 .4-.3.7-.7.7H5.1c-.4 0-.7-.3-.7-.7V5.1c0-.4.3-.7.7-.7h3.3c.4 0 .7.3.7.7v3.3zM18.9 2.4h-3.3c-1.5 0-2.7 1.2-2.7 2.7v3.3c0 1.5 1.2 2.7 2.7 2.7h3.3c1.5 0 2.7-1.2 2.7-2.7V5.1c0-1.5-1.2-2.7-2.7-2.7zm.7 6c0 .4-.3.7-.7.7h-3.3c-.4 0-.7-.3-.7-.7V5.1c0-.4.3-.7.7-.7h3.3c.4 0 .7.3.7.7v3.3zM8.4 12.9H5.1c-1.5 0-2.7 1.2-2.7 2.7v3.3c0 1.5 1.2 2.7 2.7 2.7h3.3c1.5 0 2.7-1.2 2.7-2.7v-3.3c0-1.5-1.2-2.7-2.7-2.7zm.7 6c0 .4-.3.7-.7.7H5.1c-.4 0-.7-.3-.7-.7v-3.3c0-.4.3-.7.7-.7h3.3c.4 0 .7.3.7.7v3.3zM18.9 12.9h-3.3c-1.5 0-2.7 1.2-2.7 2.7v3.3c0 1.5 1.2 2.7 2.7 2.7h3.3c1.5 0 2.7-1.2 2.7-2.7v-3.3c0-1.5-1.2-2.7-2.7-2.7zm.7 6c0 .4-.3.7-.7.7h-3.3c-.4 0-.7-.3-.7-.7v-3.3c0-.4.3-.7.7-.7h3.3c.4 0 .7.3.7.7v3.3z" />
      </svg>
    );
    const label = (
      <Icon iconPosition="end" icon={open ? 'caret-up' : 'caret-down'}>
        <FormattedMessage id="stripes-core.mainnav.showAllApplicationsButtonLabel" />
      </Icon>
    );

    return (
      <Fragment>
        <FormattedMessage id="stripes-core.mainnav.showAllApplicationsButtonAriaLabel">
          { ariaLabel => (
            <NavButton
              data-test-app-list-apps-toggle
              label={label}
              aria-label={ariaLabel}
              className={css.navMobileToggle}
              labelClassName={css.dropdownToggleLabel}
              onClick={this.toggleDropdown}
              selected={this.state.open}
              icon={icon}
              {...getTriggerProps()}
              id={dropdownToggleId}
              noSelectedBar
            />
          )}
        </FormattedMessage>
      </Fragment>
    );
  }

  /**
   * App list dropdown
   */
  renderNavDropdown = (hiddenItemIds) => {
    const {
      renderDropdownToggleButton,
      dropdownListRef,
    } = this;

    const { apps, dropdownId, dropdownToggleId, selectedApp } = this.props;

    if (!hiddenItemIds.length) {
      return null;
    }

    return (
      <div className={css.navListDropdownWrap}>
        <Dropdown
          placement="bottom-end"
          dropdownClass={css.navListDropdown}
          id={dropdownId}
          renderTrigger={renderDropdownToggleButton}
          usePortal={false}
          focusHandlers={this.focusHandlers}
        >
          { ({ onToggle }) => (
            <DropdownMenu onToggle={onToggle}>
              <AppListDropdown
                apps={apps.filter(item => hiddenItemIds.includes(item.id))}
                dropdownToggleId={dropdownToggleId}
                listRef={dropdownListRef}
                selectedApp={selectedApp}
                toggleDropdown={onToggle}
              />
            </DropdownMenu>
          )
          }
        </Dropdown>
      </div>
    );
  }

  render() {
    const { apps } = this.props;

    // If no apps are installed
    if (!apps.length) {
      return null;
    }

    return (
      <ResizeContainer items={apps} hideAllWidth={767}>
        {({ refs, hiddenItems, itemWidths }) => {
          return (
            <nav className={css.appList} aria-labelledby="main_app_list_label" data-test-app-list>
              <h3 className="sr-only" id="main_app_list_label">
                <FormattedMessage id="stripes-core.mainnav.applicationListLabel" />
              </h3>
              {this.renderNavButtons(refs, hiddenItems, itemWidths)}
              {this.renderNavDropdown(hiddenItems)}
            </nav>
          );
        }
      }
      </ResizeContainer>
    );
  }
}

export default AppList;
