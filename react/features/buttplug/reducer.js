// @flow

import { ReducerRegistry } from '../base/redux';

import {
    BUTTPLUG_CLIENT,
    CONTROLLER_HOVERED,
    SELECTED_DEVICES_CHANGED
} from './actionTypes';

const DEFAULT_STATE = {
    activeDevices: [],
    hovered: false
};

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

        default:
            return state;
        }
    });
