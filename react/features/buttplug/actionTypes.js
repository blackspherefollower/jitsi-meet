
/**
 * Something happened.
 *
 * {
 *     type: STATE_CHANGED
 * }
 */
export const CONTROLLER_HOVERED = Symbol('CONTROLLER_HOVERED');

/**
 * Something happened.
 *
 * {
 *     type: SELECTED_DEVICES_CHANGED
 * }
 */
export const SELECTED_DEVICES_CHANGED = Symbol('SELECTED_DEVICES_CHANGED');

/**
 * Something happened.
 *
 * {
 *     type: SELECTED_DEVICES_CHANGED
 * }
 */
export const BUTTPLUG_CLIENT = Symbol('BUTTPLUG_CLIENT');

/**
 * The type of the action which updates which is the most recent message that
 * has been seen by the local participant.
 *
 * {
 *     type: SET_LAST_READ_MESSAGE,
 *     message: Object
 * }
 */
export const BROADCAST_REMOTED_DEVICES = Symbol('BROADCAST_REMOTED_DEVICES');

export const RECEIVED_REMOTED_DEVICES = Symbol('RECEIVED_REMOTED_DEVICES');
export const REQUEST_REMOTE_DEVICES = Symbol('REQUEST_REMOTE_DEVICES');
export const SEND_REMOTE_CONTROL = Symbol('SEND_REMOTE_CONTROL');
export const HANDLE_REMOTE_CONTROL = Symbol('HANDLE_REMOTE_CONTROL');

/**
 * The type of the action which signals to toggle the display of the buttplug panel.
 *
 * {
 *     type: TOGGLE_BUTTPLUG
 * }
 */
export const TOGGLE_BUTTPLUG = 'TOGGLE_BUTTPLUG';
