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
    TOGGLE_BUTTPLUG,
    BUTTPLUG_DISCONNECTED,
    BUTTPLUG_SCANNING_START,
    BUTTPLUG_SCANNING_STOP, SEND_LOCAL_CONTROL
} from './actionTypes';
import {buttplugDeviceToObject} from "./functions";
import {Device} from "buttplug";

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
export function setButtplugClient(client) {
    return {
        type: BUTTPLUG_CLIENT,
        buttplugClient: client
    };
}

/**
 * Buttplug ran away!
 *
 * @returns {{
 *    type: BUTTPLUG_DISCONNECTED,
 * }}
 */
export function buttplugDisconnected() {
    return {
        type: BUTTPLUG_DISCONNECTED
    };
}

/**
 * Buttplug started scanning
 *
 * @returns {{
 *    type: BUTTPLUG_SCANNING_START,
 * }}
 */
export function buttplugScanningStart() {
    return {
        type: BUTTPLUG_SCANNING_START
    };
}

/**
 * Buttplug stopped scanning
 *
 * @returns {{
 *    type: BUTTPLUG_SCANNING_STOP,
 * }}
 */
export function buttplugScanningStop() {
    return {
        type: BUTTPLUG_SCANNING_STOP
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
export function broadcastDevices(devices, user) {
    const userDevices = devices
        .filter(d => d.Remoted === user || d.Remoted === '')
        .map(d => buttplugDeviceToObject(d.Device));

    return {
        type: BROADCAST_REMOTED_DEVICES,
        user,
        devices,
        userDevices
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

export function sendRemoteDeviceMessage(user, device, state) {
    return {
        type: SEND_REMOTE_CONTROL,
        user,
        device,
        state
    };
}

export function sendLocalDeviceMessage(device, state) {
    return {
        type: SEND_LOCAL_CONTROL,
        device,
        state
    };
}

export function handleRemoteDeviceMessage(user, device, state) {
    device.Device = new Device(device.Device.index, device.Device.name, device.Device.allowedMsgs);

    return {
        type: HANDLE_REMOTE_CONTROL,
        user,
        device,
        state
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
