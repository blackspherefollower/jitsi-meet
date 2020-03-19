// @flow

import { Component } from 'react';
import type { Dispatch } from 'redux';

import { toggleButtplug } from '../actions';

/**
 * The type of the React {@code Component} props of {@code AbstractChat}.
 */
export type Props = {

    /**
     * True if the chat window should be rendered.
     */
    _isOpen: boolean,

    /**
     * Function to toggle the chat window.
     */
    _onToggleButtplug: Function,

    /**
     * The Redux dispatch function.
     */
    dispatch: Dispatch<any>,

    /**
     * Function to be used to translate i18n labels.
     */
    t: Function
};

/**
 * Implements an abstract chat panel.
 */
export default class AbstractChat<P: Props> extends Component<P> {}

/**
 * Maps redux actions to the props of the component.
 *
 * @param {Function} dispatch - The redux action {@code dispatch} function.
 * @returns {{
 *     _onSendMessage: Function,
 *     _onToggleChat: Function
 * }}
 * @private
 */
export function _mapDispatchToProps(dispatch: Dispatch<any>) {
    return {
        /**
         * Toggles the chat window.
         *
         * @returns {Function}
         */
        _onToggleButtplug() {
            dispatch(toggleButtplug());
        }
    };
}

/**
 * Maps (parts of) the redux state to {@link Chat} React {@code Component}
 * props.
 *
 * @param {Object} state - The redux store/state.
 * @private
 * @returns {{
 *     _isOpen: boolean,
 *     _messages: Array<Object>,
 *     _showNamePrompt: boolean
 * }}
 */
export function _mapStateToProps(state: Object) {
    const { isOpen } = state['features/buttplug'];

    return {
        _isOpen: isOpen
    };
}
