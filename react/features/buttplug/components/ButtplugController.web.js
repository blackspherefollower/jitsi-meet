/* eslint-disable new-cap,max-len */
/* @flow */

import _ from 'lodash';
import FieldRange from '@atlaskit/field-range';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { dockToolbox } from '../../toolbox';

import { setButtplugControllerHovered } from '../actions';

declare var interfaceConfig: Object;

import { CreateSimpleVibrateCmd, Device } from 'buttplug';

/**
 * Implements a React {@link Component} which displays a Buttplug connection
 * flow
 *
 * @extends Component
 */
class ButtplugVibeControl extends Component {
    /**
     * {@code Filmstrip} component's property types.
     *
     * @static
     */
    static propTypes = {
        /**
         * value
         */
        device: PropTypes.object,

        /**
         * value
         */
        onChange: PropTypes.func,

        /**
         * value
         */
        value: PropTypes.double
    }

    /**
     * Construct a vibe control
     *
     * @param {*} props - the props
     * @private
     * @returns {void}
     */
    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);
    }

    /**
     * Render a vibe control
     *
     * @private
     * @returns {void}
     */
    render() {
        return (
            <div key = { this.props.device.Index } >
                <span>{this.props.device.Name}</span>
                <FieldRange
                    onChange = { this._onChange }
                    value = { Math.max(Math.min(this.props.value * 100, 100), 0) } />
            </div>
        );
    }

    /**
     * Trigger a vibe control chnage
     *
     * @param {*} newValue - the new value
     * @private
     * @returns {void}
     */
    _onChange(newValue) {
        this.props.onChange(this.props.device, newValue / 100);
    }
}

/**
 * Implements a React {@link Component} which displays a Buttplug connection
 * flow
 *
 * @extends Component
 */
class ButtplugController extends Component {
    _isHovered: boolean;

    _notifyOfHoveredStateUpdate: Function;

    _onMouseOut: Function;

    _onMouseOver: Function;

    /**
     * {@code Filmstrip} component's property types.
     *
     * @static
     */
    static propTypes = {
        /**
         * List of active buttplug devices.
         */
        _activeDevices: PropTypes.array,

        /**
         * List of active buttplug devices.
         */
        _client: PropTypes.object,

        /**
         * Whether or not remote videos are currently being hovered over.
         */
        _hovered: PropTypes.bool,

        /**
         * Whether or not the toolbox is visible. The height of the vertical
         * filmstrip needs to adjust to accommodate the horizontal toolbox.
         */
        _toolboxVisible: PropTypes.bool,

        /**
         * Updates the redux store with filmstrip hover changes.
         */
        dispatch: PropTypes.func
    };

    /**
     * Construct a device panel
     *
     * @param {*} props - the props
     * @private
     * @returns {void}
     */
    constructor(props) {
        super(props);

        // Debounce the method for dispatching the new filmstrip handled state
        // so that it does not get called with each mouse movement event. This
        // also works around an issue where mouseout and then a mouseover event
        // is fired when hovering over remote thumbnails, which are not yet in
        // react.
        this._notifyOfHoveredStateUpdate
            = _.debounce(this._notifyOfHoveredStateUpdate, 100);

        // Cache the current hovered state for _updateHoveredState to always
        // send the last known hovered state.
        this._isHovered = false;

        // Bind event handlers so they are only bound once for every instance.
        this._onMouseOver = this._onMouseOver.bind(this);
        this._onMouseOut = this._onMouseOut.bind(this);

        this._onControlChange = this._onControlChange.bind(this);

        this.state = {
            deviceStates: {}
        };
    }

    /**
     * Renderes a controller for a device
     *
     * @private
     * @param {Device} device - a ButtplugDevice
     * @returns {*} the controller
     */
    renderControl(device) {
        let value = 0;

        if (device.AllowedMessages.indexOf('VibrateCmd') === -1) {
            return '';
        }

        if (this.state.deviceStates[device.Index] !== undefined) {
            value = this.state.deviceStates[device.Index];
        }

        return (
            <ButtplugVibeControl
                device = { device }
                onChange = { this._onControlChange }
                value = { value } />
        );
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const {
            _toolboxVisible
        } = this.props;

        /**
         * Note: Appending of {@code RemoteVideo} views is handled through
         * VideoLayout. The views do not get blown away on render() because
         * ReactDOMComponent is only aware of the given JSX and not new appended
         * DOM. As such, when updateDOMProperties gets called, only attributes
         * will get updated without replacing the DOM. If the known DOM gets
         * modified, then the views will get blown away.
         */
        const reduceHeight
            = _toolboxVisible && interfaceConfig.TOOLBAR_BUTTONS.length;
        const filmstripClassNames = `buttplugcontroller ${reduceHeight ? 'reduce-height' : ''}`;
        let devList = '';

        if (this.props._activeDevices !== undefined) {
            devList = this.props._activeDevices.map(device => this.renderControl(device));
        }

        return (
            <div className = { filmstripClassNames }>
                <div
                    className = 'buttplugcontroller__videos'
                    id = 'remoteVideos'>
                    <div
                        className = 'buttplugcontroller__videos'
                        id = 'buttplugLocalController'
                        onMouseOut = { this._onMouseOut }
                        onMouseOver = { this._onMouseOver }>
                        {devList}
                    </div>
                    <div
                        className = 'buttplugcontroller__videos'
                        id = 'buttplugRemoteControllers'>
                        {/**
                         * This extra video container is needed for scrolling
                         * thumbnails in Firefox; otherwise, the flex
                         * thumbnails resize instead of causing overflow.
                         */}
                        <div
                            className = 'remote-video-container'
                            id = 'buttplugRemoteControllersContainer'
                            onMouseOut = { this._onMouseOut }
                            onMouseOver = { this._onMouseOver } />
                    </div>
                </div>
            </div>
        );
    }

    /**
     * If the current hover state does not match the known hover state in redux,
     * dispatch an action to update the known hover state in redux.
     *
     * @private
     * @returns {void}
     */
    _notifyOfHoveredStateUpdate() {
        if (this.props._hovered !== this._isHovered) {
            this.props.dispatch(dockToolbox(this._isHovered));
            this.props.dispatch(setButtplugControllerHovered(this._isHovered));
        }
    }

    /**
     * Updates the currently known mouseover state and attempt to dispatch an
     * update of the known hover state in redux.
     *
     * @private
     * @returns {void}
     */
    _onMouseOut() {
        this._isHovered = false;
        this._notifyOfHoveredStateUpdate();
    }

    /**
     * Updates the currently known mouseover state and attempt to dispatch an
     * update of the known hover state in redux.
     *
     * @private
     * @returns {void}
     */
    _onMouseOver() {
        this._isHovered = true;
        this._notifyOfHoveredStateUpdate();
    }


    /**
     * Updates the device state
     *
     * @private
     * @param {Device} device - a Buttplug Device
     * @param {*} newValue - the new value
     * @returns {void}
     */
    _onControlChange(device, newValue) {
        this.setState({ deviceStates: {
            ...this.state.deviceStates,
            [device.Index]: newValue
        } });
        this.props._client.SendDeviceMessage(device, CreateSimpleVibrateCmd(device, newValue));
    }
}

/**
 * Maps (parts of) the Redux state to the associated {@code Filmstrip}'s props.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
 *     _hovered: boolean,
 *     _remoteVideosVisible: boolean,
 *     _toolboxVisible: boolean
 * }}
 */
function _mapStateToProps(state) {
    const { activeDevices, hovered, buttplugClient } = state['features/buttplug'];

    return {
        _client: buttplugClient,
        _activeDevices: activeDevices,
        _hovered: hovered,
        _toolboxVisible: state['features/toolbox'].visible
    };
}

export default connect(_mapStateToProps)(ButtplugController);
