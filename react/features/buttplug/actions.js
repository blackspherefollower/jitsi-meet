// @flow

import {
    BROADCAST_REMOTED_DEVICES,
    BUTTPLUG_CLIENT,
    CONTROLLER_HOVERED,
    SELECTED_DEVICES_CHANGED,
    RECEIVED_REMOTED_DEVICES,
    REQUEST_REMOTE_DEVICES,
    SEND_REMOTE_CONTROL,
    HANDLE_REMOTE_CONTROL,
    TOGGLE_BUTTPLUG
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

/**
 * A new buttplug has appeared!
 *
 * @param {*} client - new device list
 * @returns {{
 *    type: BUTTPLUG_CLIENT,
 * }}
 */
export function broadcastDevices(devices) {
    return {
        type: BROADCAST_REMOTED_DEVICES,
        remotedDevices: devices
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
export function requestRemoteDevices() {
    return {
        type: REQUEST_REMOTE_DEVICES
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
export function handleRemoteDevices(participant, devices) {
    return {
        type: RECEIVED_REMOTED_DEVICES,
        user: participant._id,
        devices
    };
}

export function sendRemoteDeviceMessage(user, device, msg) {
    return {
        type: SEND_REMOTE_CONTROL,
        user,
        device,
        msg
    };
}

export function handleRemoteDeviceMessage(user, device, msg) {
    return {
        type: HANDLE_REMOTE_CONTROL,
        user,
        device,
        msg
    };
}

/**
 * Toggles display of the chat side panel.
 *
 * @returns {{
 *     type: TOGGLE_CHAT
 * }}
 */
export function toggleButtplug() {
    return {
        type: TOGGLE_BUTTPLUG
    };
}
