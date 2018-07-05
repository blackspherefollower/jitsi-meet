// @flow

import {
    ADD_CLIENT,
    STATE_CHANGED
} from './actionTypes';

/**
 * A new buttplug has appeared.
 *
 * @param {Object} client - buttplug client
 * @returns {{
 *    type: ADD_CLIENT,
 *    client: Object
 * }}
 */
export function setAddButtplug(client: object) {
    return {
        type: ADD_CLIENT,
        client
    };
}

/**
 * A new buttplug has appeared!
 *
 * @returns {{
 *    type: STATE_CHANGED,
 * }}
 */
export function buttplugStateChanged() {
    return {
        type: STATE_CHANGED
    };
}
