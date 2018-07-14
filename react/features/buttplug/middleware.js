// @flow

import { MiddlewareRegistry } from '../base/redux';
import { CONFERENCE_JOINED } from '../base/conference';
import { JitsiConferenceEvents } from '../base/lib-jitsi-meet';
import {
    broadcastDevices,
    handleRemoteDevices,
    requestRemoteDevices,
    handleRemoteDeviceMessage
} from './actions';

declare var APP: Object;

/**
 * Implements the middleware of the chat feature.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry.register(store => next => action => {
    if (typeof APP !== 'object') {
        return next(action);
    }

    switch (action.type) {
    case CONFERENCE_JOINED:
        _addButtblugMsgListener(action.conference, store);
        // store.dispatch(requestRemoteDevices());
        break;
    }

    return next(action);
});

/**
 * Registers listener for {@link JitsiConferenceEvents.MESSAGE_RECEIVED} which
 * will play a sound on the event, given that the chat is not currently visible.
 *
 * @param {JitsiConference} conference - The conference instance on which the
 * new event listener will be registered.
 * @param {Dispatch} next - The redux dispatch function to dispatch the
 * specified action to the specified store.
 * @private
 * @returns {void}
 */
function _addButtblugMsgListener(conference, { dispatch }) {
    // XXX Currently, there's no need to remove the listener, because the
    // JitsiConference instance cannot be reused. Hence, the listener will be
    // gone with the JitsiConference instance.
    conference.on(
        JitsiConferenceEvents.ENDPOINT_MESSAGE_RECEIVED,
        (participant, event) => {
            if (event.type === 'buttplug'
                && event.value !== undefined
                && event.value.event !== undefined) {

                console.debug(event);

                switch (event.value.event) {
                case 'remote-devices':
                    dispatch(handleRemoteDevices(participant,
                        event.value.devices));
                    break;
                case 'request-devices':
                    dispatch(broadcastDevices(null));
                    break;
                case 'remote-control-device':
                    dispatch(handleRemoteDeviceMessage(participant._id,
                        event.value.device, event.value.buttplugMessage));
                    break;
                }
            }
        });
}
