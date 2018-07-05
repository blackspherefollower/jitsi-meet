// @flow

import { ReducerRegistry } from '../base/redux';

import {
    ADD_CLIENT,
    STATE_CHANGED
} from './actionTypes';

const DEFAULT_STATE = {
    client: null,
    tick: 0
};

/**
 * Reduces the Redux actions of the feature features/buttplug.
 */
ReducerRegistry.register('features/buttplug',
    (state = DEFAULT_STATE, action) => {
        switch (action.type) {

        case ADD_CLIENT:
            return {
                ...state,
                client: action.client
            };

        case STATE_CHANGED:
            return {
                ...state,
                tick: state.tick + 1
            };

        default:
            return state;
        }
    });
