// @flow

/* eslint-disable no-unused-vars,new-cap */
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { translate } from '../../../base/i18n';

import ButtplugConnection from './ButtplugConnection';
import ButtplugDeviceManager from './ButtplugDeviceManager';

// noinspection ES6UnusedImports
import {
    ButtplugClient,
    ButtplugMessage,
    ButtplugDeviceMessage,
    Device,
    Log,
    StopDeviceCmd,
    Error as ErrorMsg,
    ButtplugEmbeddedServerConnector,
    ButtplugLogger,
    ButtplugLogLevel } from 'buttplug';

/*
import { CreateDevToolsClient } from 'buttplug/dist/main/src/devtools';
import {
    CreateDeviceManagerPanel,
    RemoveDeviceManagerPanel
} from 'buttplug/dist/main/src/devtools/web/index.web';
*/

import {
    buttplugDisconnected, buttplugScanningStart, buttplugScanningStop,
    buttplugSelectedDevicesChanged,
    setButtplugClient
} from '../../actions';
import type { ButtplugDeviceWarpper } from './ButtplugController';

export type Props = {

    /**
     * The state.
     */
    _activeDevices: Array<ButtplugDeviceWarpper>,

    /**
     * The state.
     */
    _buttplugClient: ButtplugClient,

    /**
     * The state.
     */
    _isScanning: boolean,

    /**
     * Updates the redux store with filmstrip hover changes.
     */
    dispatch: Function
};

/**
 * BUTTPLUG!!!
 * Implements a React {@link Component} which various ways to change application
 * settings.
 *
 * @extends Component
 */
class ButtplugView<P: Props> extends PureComponent<P> {

    /**
     * Creates and appends buttplugs to the side panel.
     *
     * @param {*} args - Args passed though
     * @returns {void}
     */
    constructor(args) {
        super(args);

        this._onConnectLocalClicked
            = this._onConnectLocalClicked.bind(this);
        this._onConnectWebsocketClicked
            = this._onConnectWebsocketClicked.bind(this);
        this._onDisconnectClicked
            = this._onDisconnectClicked.bind(this);
        this.initializeClient
            = this.initializeClient.bind(this);

        this._onStartScanningClicked
            = this._onStartScanningClicked.bind(this);
        this._onStopScanningClicked
            = this._onStopScanningClicked.bind(this);

        this._onDeviceSelected = this._onDeviceSelected.bind(this);
        this._onDeviceUnselected = this._onDeviceUnselected.bind(this);

        this.handleAddressChange = this.handleAddressChange.bind(this);
        this.handleClientNameChange = this.handleClientNameChange.bind(this);

        let devices = [];

        if (this.props._buttplugClient?.Devices !== undefined ) {
            devices = [ ...this.props._buttplugClient.Devices ];
        }

        this.state = {
            address: location.protocol === 'https:'
                ? 'wss://localhost:12346/buttplug'
                : 'ws://localhost:12345/buttplug',
            clientName: 'Jitsi Buttplug Client',
            devices,
            lastErrorMessage: null,
            logMessages: []
        };
    }

    /**
     * Init a client.
     *
     * @param {*} client - the client
     * @returns {void}
     */
    initializeClient(client) {
        client.addListener('disconnect', this._onDisconnectClicked);
        client.addListener('log', log => this.addLogMessage(log));
        client.addListener('deviceadded', dev => this.addDevice(dev));
        client.addListener('deviceremoved', dev => this.removeDevice(dev));
    }

    /**
     * Update the address
     *
     * @param {*} event - the onChange event
     * @returns {void}
     */
    handleAddressChange(event) {
        this.setState({
            ...this.state,
            address: event.target.value
        });
    }

    /**
     * Update the address
     *
     * @param {*} event - the onChange event
     * @returns {void}
     */
    handleClientNameChange(event) {
        this.setState({
            ...this.state,
            clientName: event.target.value
        });
    }

    /**
     * On click handler.
     *
     * @private
     * @returns {void}
     */
    async _onConnectWebsocketClicked() {
        const client = new ButtplugClient(this.state.clientName);

        ButtplugLogger.Logger.MaximumConsoleLogLevel = ButtplugLogLevel.Trace;
        this.initializeClient(client);

        try {
            await client.ConnectWebsocket(this.state.address);
            this.props.dispatch(setButtplugClient(client));
        } catch (err) {
            console.error(err);
            this.props.dispatch(setButtplugClient(null));
        }
    }

    /**
     * On click handler.
     *
     * @private
     * @returns {void}
     */
    async _onConnectLocalClicked() {
        const client = new ButtplugClient(this.state.clientName);

        this.initializeClient(client);

        try {
            await client.ConnectLocal();
            this.props.dispatch(setButtplugClient(client));
        } catch (err) {
            console.error(err);
            this.props.dispatch(setButtplugClient(null));
        }
    }

    /**
     * On click handler.
     *
     * @private
     * @returns {void}
     */
    async _onDisconnectClicked() {
        try {
            await this.props._buttplugClient?.Disconnect();
        } catch (err) {
            console.error(err);
        }

        this.props.dispatch(buttplugDisconnected());
    }

    /**
     * On click handler.
     *
     * @private
     * @returns {void}
     */
    async _onStartScanningClicked() {
        if (!this.props._buttplugClient?.Connected) {
            return;
        }

        try {
            await this.props._buttplugClient.StartScanning();
            this.props.dispatch(buttplugScanningStart());
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * On click handler.
     *
     * @private
     * @returns {void}
     */
    async _onStopScanningClicked() {
        if (!this.props._buttplugClient?.Connected) {
            return;
        }

        try {
            await this.props._buttplugClient.StopScanning();
            this.props.dispatch(buttplugScanningStop());
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * On click handler.
     *
     * @param {*} logMessage - the logMessage
     * @private
     * @returns {void}
     */
    addLogMessage(logMessage) {
        console.log(logMessage);
        this.setState({
            logMessages: [
                ...this.state.logMessages,
                logMessage.LogMessage ]
        });
    }

    /**
     * On click handler.
     *
     * @param {*} device - the device being added
     * @private
     * @returns {void}
     */
    addDevice(device) {
        if (this.state.devices.filter(d => device.Index === d.Index)
            .length === 0) {
            this.setState({
                devices: [ ...this.state.devices, device ]
            });
        }
    }

    /**
     * On click handler.
     *
     * @param {*} device - the device being removed
     * @private
     * @returns {void}
     */
    removeDevice(device) {
        const devs = [ ...this.state.devices ];

        if (devs.indexOf(device) !== -1) {
            devs.splice(devs.indexOf(device), 1);
        }
        this._onDeviceUnselected(device.Index);
    }

    /**
     * On click handler.
     *
     * @param {*} deviceId - the deviceId of the device being selected
     * @private
     * @returns {void}
     */
    _onDeviceSelected(deviceId) {
        // If we're not connected, ignore.
        if (!this.props._buttplugClient?.Connected) {
            return;
        }
        const device = this.props._buttplugClient.Devices.find(d => d.Index === deviceId);
        const sDevs = [ ...this.props._activeDevices ];

        if (device !== undefined && sDevs.findIndex(d => d.Index === deviceId) === -1) {
            const wrap: ButtplugDeviceWarpper = {
                Device: device,
                Client: this.props._buttplugClient,
                Remoted: null,
                Remote: null,
                State: {}
            };
            let feats = 1;

            for (const msg of device.AllowedMessages) {
                switch (msg) {
                case 'VibrateCmd':
                case 'LinearCmd':
                case 'RotateCmd':
                    feats = device.MessageAttributes(msg)?.FeatureCount || 1;

                    wrap.State[msg] = [];
                    for (let i = 0; i < feats; i++) {
                        wrap.State[msg].push(0);
                    }
                    break;
                }
            }

            sDevs.push(wrap);
            this.props.dispatch(buttplugSelectedDevicesChanged(sDevs));
        }

    }

    /**
     * On click handler.
     *
     * @param {*} deviceId - the deviceId of the device being unselected
     * @private
     * @returns {void}
     */
    _onDeviceUnselected(deviceId) {
        // If we're not connected, ignore.
        if (!this.props._buttplugClient?.Connected) {
            return;
        }

        const sDevs = [ ...this.props._activeDevices ];
        const idx = sDevs.findIndex(d => d.Index === deviceId);

        if (idx !== -1) {
            sDevs.splice(idx, 1);
            this.props.dispatch(buttplugSelectedDevicesChanged(sDevs));
        }
    }

    /**
     * Thing
     *
     * @returns {*} - The React enhanced HTML
     */
    render() {
        return (
            <div>
                <ButtplugConnection
                    connected = { this.props._buttplugClient?.Connected || false }
                    defaultAddress = { this.state.address }
                    defaultClientName = { this.state.clientName }
                    handleAddressChange = { this.handleAddressChange }
                    handleClientNameChange = { this.handleClientNameChange }
                    onConnectLocalClicked = {
                        this._onConnectLocalClicked
                    }
                    onConnectWebsocketClicked = {
                        this._onConnectWebsocketClicked
                    }
                    onDisconnectClicked = {
                        this._onDisconnectClicked
                    } />
                {(this.props._buttplugClient?.Connected || false)
                    && <ButtplugDeviceManager
                        devices = { this.state.devices }
                        onDeviceSelected = { this._onDeviceSelected }
                        onDeviceUnselected = { this._onDeviceUnselected }
                        onStartScanningClicked = {
                            this._onStartScanningClicked
                        }
                        onStopScanningClicked = {
                            this._onStopScanningClicked
                        }
                        scanning = { this.props._isScanning }
                        selectedDevices = { this.props._activeDevices } />
                }
            </div>
        );
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
    const { activeDevices, buttplugClient, isScanning } = state['features/buttplug'];

    return {
        _activeDevices: activeDevices,
        _buttplugClient: buttplugClient,
        _isScanning: isScanning
    };
}

export default connect(_mapStateToProps)(ButtplugView);
