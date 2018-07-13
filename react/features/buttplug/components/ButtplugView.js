/* eslint-disable no-unused-vars,new-cap */
import PropTypes from 'prop-types';
import React, { Component, create } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { translate } from '../../base/i18n';

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
    ButtplugEmbeddedServerConnector } from 'buttplug';

/*
import { CreateDevToolsClient } from 'buttplug/dist/main/src/devtools';
import {
    CreateDeviceManagerPanel,
    RemoveDeviceManagerPanel
} from 'buttplug/dist/main/src/devtools/web/index.web';
*/

import {
    buttplugSelectedDevicesChanged,
    buttplugClient
} from '../actions';

/**
 * BUTTPLUG!!!
 * Implements a React {@link Component} which various ways to change application
 * settings.
 *
 * @extends Component
 */
class ButtplugView extends Component {
    static propTypes = {
        /**
         * The state.
         */
        _activeDevices: PropTypes.array,

        /**
         * Updates the redux store with filmstrip hover changes.
         */
        dispatch: PropTypes.func
    };

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
        this._onConnectSimulatorClicked
            = this._onConnectSimulatorClicked.bind(this);
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
        this._onShowDevToolsClicked
            = this._onShowDevToolsClicked.bind(this);

        this._onDeviceSelected = this._onDeviceSelected.bind(this);
        this._onDeviceUnselected = this._onDeviceUnselected.bind(this);

        this.handleAddressChange = this.handleAddressChange.bind(this);
        this.handleClientNameChange = this.handleClientNameChange.bind(this);

        this.buttplugClient = null;

        this.state = {
            address: location.protocol === 'https:'
                ? 'wss://localhost:12345/buttplug'
                : 'ws://localhost:12345/buttplug',
            clientName: 'Jitsi Buttplug Client',
            devices: [],
            isSimulator: false,
            lastErrorMessage: null,
            logMessages: [],
            scanning: false,
            selectedDevices: []
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

        this.initializeClient(client);

        try {
            await client.ConnectWebsocket(this.state.address);

            this.buttplugClient = client;
            this.setState({
                scanning: false,
                connected: true,
                isSimulator: false
            });
            this.props.dispatch(buttplugClient(client));
        } catch (err) {
            console.error(err);
            this.setState({
                scanning: false,
                connected: false,
                isSimulator: false
            });
            this.props.dispatch(buttplugClient(null));
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

            this.buttplugClient = client;
            this.setState({
                scanning: false,
                connected: true,
                isSimulator: false
            });
            this.props.dispatch(buttplugClient(client));
        } catch (err) {
            console.error(err);
            this.setState({
                scanning: false,
                connected: false,
                isSimulator: false
            });
            this.props.dispatch(buttplugClient(null));
        }
    }

    /**
     * On click handler.
     *
     * @private
     * @returns {void}
     */
    _onConnectSimulatorClicked() {
        /*
        try {
            const client = await CreateDevToolsClient();

            this.initializeClient(client);

            this.buttplugClient = client;
            this.setState({
               scanning: false,
               connected: true,
               isSimulator: true
           });
       } catch (err) {
           console.error(err);
           this.setState({
               scanning: false,
               connected: false,
               isSimulator: false
           });
       }
       */
    }

    /**
     * On click handler.
     *
     * @private
     * @returns {void}
     */
    _onDisconnectClicked() {
        if (this.buttplugClient !== null) {
            try {
                this.buttplugClient.Disconnect();
            } catch (err) {
                console.error(err);
            }
            this.buttplugClient = null;
        }

        // RemoveDeviceManagerPanel();

        this.setState({
            scanning: false,
            connected: false,
            isSimulator: false
        });

        this.props.dispatch(buttplugSelectedDevicesChanged([]));
        this.props.dispatch(buttplugClient(null));
    }

    /**
     * On click handler.
     *
     * @private
     * @returns {void}
     */
    async _onStartScanningClicked() {
        if (!this.state.connected) {
            return;
        }

        try {
            await this.buttplugClient.StartScanning();
            this.setState({
                scanning: true
            });
        } catch (err) {
            console.error(err);
            this.setState({
                scanning: false
            });
        }
    }

    /**
     * On click handler.
     *
     * @private
     * @returns {void}
     */
    async _onStopScanningClicked() {
        if (!this.state.connected) {
            return;
        }

        try {
            await this.buttplugClient.StopScanning();
        } catch (err) {
            console.error(err);
        }

        this.setState({
            scanning: false
        });
    }

    /**
     * On click handler.
     *
     * @private
     * @returns {void}
     */
    _onShowDevToolsClicked() {
        if (!this.state.isSimulator) {
            return;
        }

        // CreateDeviceManagerPanel(this.buttplugClient.Connector.Server);
    }

    /**
     * On click handler.
     *
     * @param {*} logMessage - the logMessage
     * @private
     * @returns {void}
     */
    addLogMessage(logMessage) {
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
        const sDevs = [ ...this.state.selectedDevices ];

        if (devs.indexOf(device) !== -1) {
            devs.splice(devs.indexOf(device), 1);
        }
        if (sDevs.indexOf(device.Index) !== -1) {
            sDevs.splice(sDevs.indexOf(device.Index), 1);
        }
        this.setState({
            devices: devs,
            selectedDevices: sDevs
        });
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
        if (!this.state.connected) {
            return;
        }
        const device = this.state.devices.find(d => d.Index === deviceId);
        const sDevs = [ ...this.state.selectedDevices ];

        if (device !== undefined
            && this.state.selectedDevices.indexOf(device.Index) === -1) {
            sDevs.push(device.Index);
            this.setState({
                selectedDevices: sDevs
            });

            this.props.dispatch(buttplugSelectedDevicesChanged(
                this.state.devices.filter(d => sDevs.indexOf(d.Index) !== -1)));
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
        if (!this.state.connected) {
            return;
        }
        const device = this.state.devices.find(d => d.Index === deviceId);
        const sDevs = [ ...this.state.selectedDevices ];

        if (device !== undefined && sDevs.indexOf(device.Index) !== -1) {
            sDevs.splice(sDevs.indexOf(deviceId), 1);
            this.setState({
                selectedDevices: sDevs
            });

            this.props.dispatch(buttplugSelectedDevicesChanged(
                this.state.devices.filter(d => sDevs.indexOf(d.Index) !== -1)));
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
                    connected = { this.state.connected }
                    defaultAddress = { this.state.address }
                    defaultClientName = { this.state.clientName }
                    handleAddressChange = { this.handleAddressChange }
                    handleClientNameChange = { this.handleClientNameChange }
                    onConnectLocalClicked = {
                        this._onConnectLocalClicked
                    }
                    onConnectSimulatorClicked = {
                        this._onConnectSimulatorClicked
                    }
                    onConnectWebsocketClicked = {
                        this._onConnectWebsocketClicked
                    }
                    onDisconnectClicked = {
                        this._onDisconnectClicked
                    } />
                {this.state.connected
                    && <ButtplugDeviceManager
                        devices = { this.state.devices }
                        isSimulator = { this.state.isSimulator }
                        onDeviceSelected = { this._onDeviceSelected }
                        onDeviceUnselected = { this._onDeviceUnselected }
                        onShowDevToolsClicked = { this._onShowDevToolsClicked }
                        onStartScanningClicked = {
                            this._onStartScanningClicked
                        }
                        onStopScanningClicked = {
                            this._onStopScanningClicked
                        }
                        scanning = { this.state.scanning }
                        selectedDevices = { this.state.selectedDevices } />
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
    const { activeDevices } = state['features/buttplug'];

    return {
        _activeDevices: activeDevices
    };
}

export default connect(_mapStateToProps)(ButtplugView);
