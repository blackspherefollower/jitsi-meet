/* eslint-disable new-cap */

// @flow

/**
 * Selector for calculating the number of unread chat messages.
 *
 * @param {Object} state - The redux state.
 * @returns {number} The number of unread messages.
 */
export function getClient(state: Object) {
    const { client } = state['features/buttplug'];

    return client;
}

/**
 * Selector for calculating the number of unread chat messages.
 *
 * @param {Object} state - The redux state.
 * @returns {number} The number of unread messages.
 */
export function getConnected(state: Object) {
    const { client } = state['features/buttplug'];

    return client !== null
        && client.hasOwnProperty('Connected')
        && client.Connected();
}
