/* eslint-disable new-cap,max-len */
/* @flow */

import _ from 'lodash';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { dockToolbox } from '../../../toolbox';

import {
    broadcastDevices,
    setButtplugControllerHovered,
    sendRemoteDeviceMessage,
    sendLocalDeviceMessage
} from '../../actions';

declare var interfaceConfig: Object;
declare var APP: Object;

import { ButtplugClient, CreateSimpleVibrateCmd, Device } from 'buttplug';
import { ButtplugVibrationControl } from './ButtplugVibrationControl';
import {buttplugDeviceToObject} from "../../functions";

export type ButtplugDeviceWarpper = {

    /**
     * The buttplug device
     */
    Device: Device,

    /**
     * The buttplug device state
     */
    State: Object,

    /**
     * The buttplug client (for convenience)
     */
    Client: ButtplugClient | null,

    /**
     * The device owner (null if local)
     */
    Remote: string | null,

    /**
     * The delegated controlling user (null if not remoted, empty for free-for-all)
     */
    Remoted: string | null,
}

export type Props = {

    /**
     * List of active buttplug devices.
     */
    _activeDevices: Array<ButtplugDeviceWarpper>,

    /**
     * List of active buttplug devices.
     */
    _client: Object,

    /**
     * Whether or not remote videos are currently being hovered over.
     */
    _hovered: boolean,

    /**
     * Whether or not the toolbox is visible. The height of the vertical
     * filmstrip needs to adjust to accommodate the horizontal toolbox.
     */
    _toolboxVisible: boolean,

    /**
     * Updates the redux store with filmstrip hover changes.
     */
    dispatch: PropTypes.func
};

/**
 * Implements a React {@link Component} which displays a Buttplug connection
 * flow
 *
 * @extends Component
 */
class ButtplugController<P: Props> extends PureComponent<P> {
    _isHovered: boolean;

    /**
     * Construct a device panel.
     *
     * @param {*} props - The props.
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
        this._onRemoteAccessChange = this._onRemoteAccessChange.bind(this);
        this._onRemoteControlChange = this._onRemoteControlChange.bind(this);

        this.state = {};
    }

    /**
     * Renderes a controller for a device.
     *
     * @private
     * @param {ButtplugDeviceWarpper} device - A ButtplugDevice.
     * @returns {*} The controller.
     */
    renderControl(device) {
        const dev = device.Device;

        if (dev.AllowedMessages.indexOf('VibrateCmd') === -1) {
            return '';
        }

        return (
            <ButtplugVibrationControl
                device = { device }
                key = { dev.Index }
                onChange = { this._onControlChange }
                onRemoteAccessChange = { this._onRemoteAccessChange }
                remote = { false }
                remoted = { device.Remoted }
                user = { '' } />
        );
    }

    /**
     * Renderes a controller for a device.
     *
     * @private
     * @param {*} user - The owner of the device.
     * @param {ButtplugDeviceWarpper} device - A ButtplugDevice.
     * @returns {*} The controller.
     */
    renderRemoteControl(user, device) {
        const dev = device.Device;

        if (dev.AllowedMessages.indexOf('VibrateCmd') === -1) {
            return '';
        }

        return (
            <ButtplugVibrationControl
                device = { device }
                key = { dev.Index }
                onChange = { this._onRemoteControlChange }
                remote = { true }
                remoted = { null }
                user = { device.Remote } />
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
        const remoteDevList = [];

        if (this.props._activeDevices !== undefined) {
            devList = this.props._activeDevices.filter(device => device.Remote === null).map(device => this.renderControl(device));
        }

        if (APP.conference.getConnectionState()) {
            for (const user of APP.conference.listMembersIds()) {
                const devs = this.props._activeDevices.filter(device => device.Remote === user);

                if (devs.length > 0) {
                    remoteDevList.push(
                        <div key = { user } >
                            <span>{APP.conference.getParticipantDisplayName(user)}</span>
                            {devs.map(d => this.renderRemoteControl(user, d))}
                        </div>);
                }
            }
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
                            onMouseOver = { this._onMouseOver }>
                            { remoteDevList }
                        </div>
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
     * Updates the device state.
     *
     * @private
     * @param {Device} device - A Buttplug Device.
     * @param {*} newValue - The new value.
     * @returns {void}
     */
    _onControlChange(device, newValue) {
        this.props.dispatch(sendLocalDeviceMessage(device, newValue));
    }

    /**
     * Updates the device state.
     *
     * @private
     * @param {Device} device - A Buttplug Device.
     * @param {*} newValue - The new value.
     * @param {*} user - The owner of the device.
     * @returns {void}
     */
    _onRemoteControlChange(device, newValue, user) {
        const dev = { ...device };

        dev.Device = buttplugDeviceToObject(dev.Device);
        this.props.dispatch(sendRemoteDeviceMessage(user, dev, newValue));
    }

    /**
     * Updates the device state.
     *
     * @private
     * @param {ButtplugDeviceWarpper} device - A Buttplug Device.
     * @param {string|null} remoted - The new value.
     * @returns {void}
     */
    _onRemoteAccessChange(device, remoted) {
        const devs = [ ...this.props._activeDevices ];
        const idx = devs.findIndex(d => d.Device.Index === device.Device.Index && d.Remote === null);

        if (idx === -1) {
            return;
        }

        const dev = { ...devs[idx] };

        dev.Remoted = remoted;
        devs.splice(idx, 1, dev);

        this.props.dispatch(broadcastDevices(devs, remoted));
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
    const {
        activeDevices,
        hovered,
        buttplugClient
    } = state['features/buttplug'];

    return {
        _client: buttplugClient,
        _activeDevices: activeDevices,
        _hovered: hovered,
        _toolboxVisible: state['features/toolbox'].visible
    };
}

export default connect(_mapStateToProps)(ButtplugController);
