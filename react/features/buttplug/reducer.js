// @flow

import { ReducerRegistry } from '../base/redux';

import {
    BROADCAST_REMOTED_DEVICES,
    BUTTPLUG_CLIENT,
    CONTROLLER_HOVERED,
    SELECTED_DEVICES_CHANGED,
    RECEIVED_REMOTED_DEVICES,
    REQUEST_REMOTE_DEVICES,
    SEND_REMOTE_CONTROL,
    HANDLE_REMOTE_CONTROL
} from './actionTypes';

import { FromJSON, Error as ErrorMsg } from 'buttplug';

const DEFAULT_STATE = {
    activeDevices: [],
    remoteDevices: {},
    remotedDevices: [],
    hovered: false,
    buttplugClient: null
};

declare var APP: Object;

/**
 * Reduces the Redux actions of the feature features/buttplug.
 */
ReducerRegistry.register('features/buttplug',
    (state = DEFAULT_STATE, action) => {
        switch (action.type) {

        case SELECTED_DEVICES_CHANGED:
            return {
                ...state,
                activeDevices: action.activeDevices
            };

        case CONTROLLER_HOVERED:
            return {
                ...state,
                hovered: action.hovered
            };

        case BUTTPLUG_CLIENT:
            return {
                ...state,
                buttplugClient: action.buttplugClient
            };

        case BROADCAST_REMOTED_DEVICES:
            if (action.remotedDevices === null) {
                action.remotedDevices = state.remotedDevices;
            }

            APP.conference.sendEndpointMessage('', {
                type: 'buttplug',
                value: {
                    event: 'remote-devices',
                    devices: action.remotedDevices
                }
            });

            return {
                ...state,
                remotedDevices: action.remotedDevices
            };

        case RECEIVED_REMOTED_DEVICES:
            return {
                ...state,
                remoteDevices: {
                    ...state.remoteDevices,
                    [action.user]: action.devices
                }
            };

        case REQUEST_REMOTE_DEVICES:
            APP.conference.sendEndpointMessage('', {
                type: 'buttplug',
                value: {
                    event: 'request-devices'
                }
            });
            break;

        case SEND_REMOTE_CONTROL:
            APP.conference.sendEndpointMessage(action.user, {
                type: 'buttplug',
                value: {
                    event: 'remote-control-device',
                    device: action.device,
                    buttplugMessage: action.msg
                }
            });
            break;

        case HANDLE_REMOTE_CONTROL:
            if (state.buttplugClient !== null) {
                const dev = state.activeDevices.find(
                    d => d.Index === action.device);
                // eslint-disable-next-line new-cap
                const msgs = FromJSON(`[${action.msg}]`);

                if (dev === null || msgs.length < 1) {
                    break;
                }

                if (msgs[0].Type instanceof ErrorMsg) {
                    console.error(msgs[0].ErrorMessage);
                    break;
                }

                // eslint-disable-next-line new-cap
                state.buttplugClient.SendDeviceMessage(dev, msgs[0]);
            }
            break;
        }

        return state;
    });
