/* global $, APP */

/* eslint-disable no-unused-vars */

import React from 'react';
import ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';

import { i18next } from '../../../../react/features/base/i18n';
import { ButtplugView } from '../../../../react/features/buttplug';
import UIUtil from '../../util/UIUtil';

/* eslint-enable no-unused-vars */

export default {
    init() {
        const buttplugViewContainer = document.createElement('div');

        buttplugViewContainer.id = 'buttplug_container';
        buttplugViewContainer.className = 'sideToolbarContainer__inner';

        $('#sideToolbarContainer').append(buttplugViewContainer);

        const props = {
        };

        ReactDOM.render(
            <Provider store = { APP.store }>
                <I18nextProvider i18n = { i18next }>
                    <ButtplugView { ...props } />
                </I18nextProvider>
            </Provider>,
            buttplugViewContainer
        );
    },

    /**
     * Check if settings menu is visible or not.
     * @returns {boolean}
     */
    isVisible() {
        return UIUtil.isVisible(document.getElementById('buttplug_container'));
    }
};
