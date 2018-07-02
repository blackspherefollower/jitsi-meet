/* global APP */
/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { translate } from '../../base/i18n';

import ButtplugConnection from './ButtplugConnection';

import { ButtplugClient } from 'buttplug';

import { setAddButtplug } from '../actions';

/**
 * BUTTPLUG!!!
 * Implements a React {@link Component} which various ways to change application
 * settings.
 *
 * @extends Component
 */
class ButtplugView extends Component {
    static propTypes = { };

    /**
     * Creates and appends buttplugs to the side panel.
     *
     * @param {*} args - Args passed though
     * @returns {void}
     */
    constructor(args) {
        super(args);

        const client = new ButtplugClient('Jitsi-buttplug');

        APP.store.dispatch(setAddButtplug(client));

        client.addListener('deviceadded', device => {
            console.info(device);
        });
        client.addListener('deviceremoved', device => {
            console.info(device);
        });

        // eslint-disable-next-line semi,new-cap
        client.ConnectWebsocket('wss://localhost:12345/buttplug').then(() => {
            // eslint-disable-next-line new-cap
            client.StartScanning();
        })
        .catch(x => {
            console.error(x);
        });
    }

    /**
     * Thing
     *
     * @returns {*} - The React enhanced HTML
     */
    render() {
        return (
            <div>
                <div className = 'title'>
                    BUTTPLUG!!!
                </div>
                <div>
                    <span data-i18n = 'chat.nickname.title'>foo</span>
                    <form>
                        <input
                            autoFocus = 'true'
                            className = 'input-control'
                            data-i18n = '[placeholder]chat.nickname.popover'
                            defaultValue = 'wss://localhost:12345/buttplug'
                            id = 'nickinput'
                            type = 'text' />
                    </form>
                    <ButtplugConnection />
                </div>
            </div>
        );
    }
}

/**
 * Maps parts of Redux store to component prop types.
 *
 * @param {Object} state - Snapshot of Redux store.
 * @returns {{
 *      _isModerator: boolean
 * }}
 */
function _mapStateToProps(state) {
    return {
    };
}

export default translate(connect(_mapStateToProps)(ButtplugView));
