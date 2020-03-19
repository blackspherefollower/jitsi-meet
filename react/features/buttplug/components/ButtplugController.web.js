/* eslint-disable new-cap,max-len */
/* @flow */

import _ from 'lodash';
import FieldRange from '@atlaskit/range';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { dockToolbox } from '../../toolbox';

import { broadcastDevices, setButtplugControllerHovered, sendRemoteDeviceMessage } from '../actions';

declare var interfaceConfig: Object;

import { CreateSimpleVibrateCmd, Device } from 'buttplug';

export type VibeControlProps = {

    /**
     * value
     */
    device: Object,

    /**
     * value
     */
    onChange: Function,

    /**
     * value
     */
    onRemoteAccessChange: Function,

    /**
     * value
     */
    remote: boolean,

    /**
     * value
     */
    remoted: boolean,

    /**
     * value
     */
    user: string,

    /**
     * value
     */
    value: number
}

/**
 * Implements a React {@link Component} which displays a Buttplug connection
 * flow
 *
 * @extends Component
 */
class ButtplugVibeControl<P: VibeControlProps> extends PureComponent<P> {

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
        this._onRemoteAccessChange = this._onRemoteAccessChange.bind(this);
    }

    /**
     * Render a vibe control
     *
     * @private
     * @returns {void}
     */
    render() {
        return (
            <div>
                <span>{this.props.device.Name}</span>
                { !this.props.remote && <input
                    onChange = { this._onRemoteAccessChange }
                    type = 'checkbox' /> }
                <FieldRange
                    disabled = { this.props.remoted }
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
        this.props.onChange(this.props.device, newValue / 100, this.props.user);
    }

    /**
     * Trigger a vibe control chnage
     *
     * @param {*} event - the event
     * @private
     * @returns {void}
     */
    _onRemoteAccessChange(event) {
        this.props.onRemoteAccessChange(this.props.device, event.target.checked);
    }
}

export type ControllerProps = {

    /**
     * List of active buttplug devices.
     */
    _activeDevices: Array<Object>,

    /**
     * List of active buttplug devices.
     */
    _client: Object,

    /**
     * Whether or not remote videos are currently being hovered over.
     */
    _hovered: boolean,

    _remoteDevices: Object,

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
class ButtplugController<P: ControllerProps> extends PureComponent<P> {
    _isHovered: boolean;

    _notifyOfHoveredStateUpdate: Function;

    _onMouseOut: Function;

    _onMouseOver: Function;

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
        this._onRemoteAccessChange = this._onRemoteAccessChange.bind(this);
        this._onRemoteControlChange = this._onRemoteControlChange.bind(this);

        this.state = {
            deviceStates: {},
            remotedDevices: [],
            remoteDeviceStates: {}
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
                key = { device.Index }
                onChange = { this._onControlChange }
                onRemoteAccessChange = { this._onRemoteAccessChange }
                remote = { false }
                remoted = { this.state.remotedDevices.indexOf(device.Index) !== -1 }
                user = { '' }
                value = { value } />
        );
    }

    /**
     * Renderes a controller for a device
     *
     * @private
     * @param {Device} device - a ButtplugDevice
     * @returns {*} the controller
     */
    renderRemoteControl(u, d) {
        let msgs = {};

        d.allowedMsgs.forEach(m => {
            msgs = {
                ...msgs,
                [m[0]]: m[1]
            };
        });
        const device = new Device(d.index, d.name, msgs);

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
                key = { device.Index }
                onChange = { this._onRemoteControlChange }
                remote = { true }
                remoted = { false }
                user = { u }
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
        const remoteDevList = [];

        if (this.props._activeDevices !== undefined) {
            devList = this.props._activeDevices.map(device => this.renderControl(device));
        }

        if (this.props._remoteDevices !== undefined) {
            for (const user in this.props._remoteDevices) {
                if (this.props._remoteDevices.hasOwnProperty(user)) {
                    const devices = this.props._remoteDevices[user];

                    if (devices.length > 0) {
                        remoteDevList.push(
                            <div key = { user }>
                                <span>{ user }</span>
                                { devices.map(d =>
                                    this.renderRemoteControl(user, d)) }
                            </div>);
                    }
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
     * Updates the device state
     *
     * @private
     * @param {Device} device - a Buttplug Device
     * @param {*} newValue - the new value
     * @returns {void}
     */
    _onControlChange(device, newValue) {
        this.setState({
            deviceStates: {
                ...this.state.deviceStates,
                [device.Index]: newValue
            } });
        this.props._client.SendDeviceMessage(device, CreateSimpleVibrateCmd(device, newValue));
    }

    /**
     * Updates the device state
     *
     * @private
     * @param {Device} device - a Buttplug Device
     * @param {*} newValue - the new value
     * @returns {void}
     */
    _onRemoteControlChange(device, newValue, user) {
        this.setState({
            remoteDeviceStates: {
                ...this.state.remoteDeviceStates,
                [user]: {
                    ...this.state.remoteDeviceStates[user],
                    [device.Index]: newValue
                }
            }
        });
        this.props.dispatch(sendRemoteDeviceMessage(user, device.Index, CreateSimpleVibrateCmd(device, newValue)));
    }

    /**
     * Updates the device state
     *
     * @private
     * @param {Device} device - a Buttplug Device
     * @param {*} remoted - the new value
     * @returns {void}
     */
    _onRemoteAccessChange(device, remoted) {
        const rDevs = [ ...this.state.remotedDevices ];

        if ((remoted && rDevs.indexOf(device.Index) !== -1)
            || (!remoted && rDevs.indexOf(device.Index) === -1)) {
            return;
        }

        if (remoted) {
            rDevs.push(device.Index);
        } else {
            rDevs.splice(rDevs.indexOf(device.Index), 1);
        }

        this.setState({ remotedDevices: rDevs });
        this.props.dispatch(broadcastDevices(this.props._activeDevices.filter(
            d => rDevs.indexOf(d.Index) !== -1)));
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
        buttplugClient,
        remoteDevices
    } = state['features/buttplug'];

    return {
        _client: buttplugClient,
        _activeDevices: activeDevices,
        _hovered: hovered,
        _remoteDevices: remoteDevices,
        _toolboxVisible: state['features/toolbox'].visible
    };
}

export default connect(_mapStateToProps)(ButtplugController);
