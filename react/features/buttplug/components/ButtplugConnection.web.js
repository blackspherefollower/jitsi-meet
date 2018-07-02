import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';


import { getConnected } from '../functions';

/**
 * Implements a React {@link Component} which displays a Buttplug connection
 * flow
 *
 * @extends Component
 */
class ButtplugConnection extends Component {
    static propTypes = {
        /**
         * The number of unread chat messages in the conference.
         */
        _connected: PropTypes.bool
    };

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (
            <span>
                Buttplug? { this.props._connected ? 'yes!' : 'no' }
            </span>
        );
    }
}

/**
 * Maps (parts of) the Redux state to the associated
 * {@code ButtplugConnection}'s props.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
 *     _connected: number
 * }}
 */
function _mapStateToProps(state) {
    return {
        _connected: getConnected(state)
    };
}

export default connect(_mapStateToProps)(ButtplugConnection);
