// @flow

import { ReducerRegistry } from '../base/redux';

import {
    ADD_CLIENT
} from './actionTypes';

/**
 * Reduces the Redux actions of the feature features/buttplug.
 */
ReducerRegistry.register('features/buttplug', (state = {}, action) => {
    switch (action.type) {

    case ADD_CLIENT:
        return {
            ...state,
            client: action.client
        };

    default:
        return state;
    }
});
