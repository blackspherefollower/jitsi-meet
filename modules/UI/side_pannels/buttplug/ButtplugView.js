/* global $, APP */

/* eslint-disable no-unused-vars */
import React from 'react';
import ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';

import { i18next } from '../../../../react/features/base/i18n';
import { ContactListPanel } from '../../../../react/features/buttplug';
/* eslint-enable no-unused-vars */

import UIUtil from '../../util/UIUtil';

/**
 * BUTTPLUG!!!
 */
const ButtplugView = {
    /**
     * Creates and appends buttplugs to the side panel.
     *
     * @returns {void}
     */
    init() {
        const buttplugPanelContainer = document.createElement('div');

        buttplugPanelContainer.id = 'buttplug_container';
        buttplugPanelContainer.className = 'sideToolbarContainer__inner';

        $('#sideToolbarContainer').append(buttplugPanelContainer);

        ReactDOM.render(
            <Provider store = { APP.store }>
                <I18nextProvider i18n = { i18next }>
                    <ButtplugPanel />
                </I18nextProvider>
            </Provider>,
            buttplugPanelContainer
        );
    },

    /**
     * Indicates if the contact list is currently visible.
     *
     * @return {boolean) true if the contact list is currently visible.
     */
    isVisible() {
        return UIUtil.isVisible(document.getElementById('buttplug'));
    }
};

export default ButtplugView;
