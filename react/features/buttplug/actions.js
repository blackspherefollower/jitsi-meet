// @flow

import {
    BUTTPLUG_CLIENT,
    CONTROLLER_HOVERED,
    SELECTED_DEVICES_CHANGED
} from './actionTypes';


/**
 * A new buttplug has appeared!
 *
 * @returns {{
 *    type: STATE_CHANGED,
 * }}
 */
export function setButtplugControllerHovered(isHovered) {
    return {
        type: CONTROLLER_HOVERED,
        hovered: isHovered
    };
}

/**
 * A new buttplug has appeared!
 *
 * @param {*} devices - new device list
 * @returns {{
 *    type: SELECTED_DEVICES_CHANGED,
 * }}
 */
export function buttplugSelectedDevicesChanged(devices) {
    return {
        type: SELECTED_DEVICES_CHANGED,
        activeDevices: devices
    };
}

/**
 * A new buttplug has appeared!
 *
 * @param {*} client - new device list
 * @returns {{
 *    type: BUTTPLUG_CLIENT,
 * }}
 */
export function buttplugClient(client) {
    return {
        type: BUTTPLUG_CLIENT,
        buttplugClient: client
    };
}