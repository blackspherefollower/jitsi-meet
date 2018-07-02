// @flow

import {
    ADD_CLIENT
} from './actionTypes';

/**
 * Dispatches an action to set whether document editing has started or stopped.
 *
 * @param {Object} client - Whether or not a document is currently being
 * edited.
 * @returns {{
 *    type: SET_DOCUMENT_EDITING_STATUS,
 *    editing: boolean
 * }}
 */
export function setAddButtplug(client: object) {
    return {
        type: ADD_CLIENT,
        client
    };
}


