// @flow

import { ReducerRegistry } from '../base/redux';


import {
    FromJSON,
    Error as ErrorMsg,
    Device,
    CreateSimpleVibrateCmd
} from 'buttplug';
import { buttplugDeviceToObject } from './functions';
import {
    BROADCAST_REMOTED_DEVICES, BUTTPLUG_CLIENT,
    BUTTPLUG_DISCONNECTED,
    BUTTPLUG_SCANNING_START,
    BUTTPLUG_SCANNING_STOP,
    CONTROLLER_HOVERED,
    HANDLE_REMOTE_CONTROL,
    RECEIVED_REMOTED_DEVICES,
    REQUEST_REMOTE_DEVICES,
    SELECTED_DEVICES_CHANGED, SEND_LOCAL_CONTROL,
    SEND_REMOTE_CONTROL, TOGGLE_BUTTPLUG
} from './actionTypes';
import type { ButtplugDeviceWarpper } from './components/web/ButtplugController';

const DEFAULT_STATE = {
    activeDevices: [],
    hovered: false,
    buttplugClient: null,
    isOpen: false,
    isScanning: false
};

declare var APP: Object;

/**
 * Reduces the Redux actions of the feature features/buttplug.
 */
ReducerRegistry.register('features/buttplug',
    (state = DEFAULT_STATE, action) => {
        let devices = null;

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

        case BUTTPLUG_DISCONNECTED:
            return {
                ...state,
                buttplugClient: null,
                activeDevices: [],
                isScanning: false
            };

        case BUTTPLUG_SCANNING_START:
            return {
                ...state,
                isScanning: true
            };

        case BUTTPLUG_SCANNING_STOP:
            return {
                ...state,
                isScanning: false
            };

        case BROADCAST_REMOTED_DEVICES:
            if (APP.conference.getConnectionState() !== null) {
                APP.conference.sendEndpointMessage(action.user, {
                    type: 'buttplug',
                    value: {
                        event: 'remote-devices',
                        devices: action.userDevices
                    }
                });
            }

            return {
                ...state,
                activeDevices: action.devices
            };

        case RECEIVED_REMOTED_DEVICES:
            devices = state.activeDevices.filter(d => d.Remote !== action.user);
            for (const dev of action.devices) {
                const device = new Device(dev.index, dev.name, dev.allowedMsgs);
                const wrap: ButtplugDeviceWarpper = {
                    Device: device,
                    Client: null,
                    Remoted: null,
                    Remote: action.user,
                    State: {}
                };

                let feats = 1;

                for (const msg of device.AllowedMessages) {
                    switch (msg) {
                    case 'VibrateCmd':
                    case 'LinearCmd':
                    case 'RotateCmd':
                        // eslint-disable-next-line new-cap
                        feats = device.MessageAttributes(msg)?.FeatureCount || 1;

                        wrap.State[msg] = [];
                        for (let i = 0; i < feats; i++) {
                            wrap.State[msg].push(0);
                        }
                        break;
                    }
                }
                devices.push(wrap);
            }

            return {
                ...state,
                activeDevices: devices
            };

        case REQUEST_REMOTE_DEVICES:
            if (APP.conference.getConnectionState() !== null) {
                APP.conference.sendEndpointMessage('', {
                    type: 'buttplug',
                    value: {
                        event: 'request-devices'
                    }
                });
            }
            break;

        case SEND_REMOTE_CONTROL:
            if (action.user === action.device.Remote
                && APP.conference.getConnectionState() !== null) {
                console.log(action);
                APP.conference.sendEndpointMessage(action.user, {
                    type: 'buttplug',
                    value: {
                        event: 'remote-control-device',
                        device: action.device,
                        state: action.state
                    }
                });
            }
            break;

        case SEND_LOCAL_CONTROL:
        case HANDLE_REMOTE_CONTROL: {
            const devIdx = state.activeDevices.findIndex(
                d => d.Device.Index === action.device.Device.Index && d.Remote === null);

            if (devIdx === -1) {
                return state;
            }

            const newDevs = [ ...state.activeDevices ];
            const newDev = { ...state.activeDevices[devIdx] };

            newDev.State = action.state;
            newDevs.splice(devIdx, 1, newDev);

            if (state.buttplugClient?.Connected && action.state.VibrateCmd?.hasOwnProperty(0)) {
                // eslint-disable-next-line new-cap
                state.buttplugClient.SendDeviceMessage(newDev.Device,
                    // eslint-disable-next-line new-cap
                    CreateSimpleVibrateCmd(newDev.Device, action.state.VibrateCmd[0]));
            }

            return {
                ...state,
                activeDevices: newDevs
            };
        }

        case TOGGLE_BUTTPLUG:
            return {
                ...state,
                isOpen: !state.isOpen
            };
        }

        return state;
    });
