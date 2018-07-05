/* eslint-disable new-cap,max-len */
import Button from '@atlaskit/button';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

/**
 * Implements a React {@link Component} which displays a Buttplug connection
 * flow
 *
 * @extends Component
 */
class ButtplugDeviceManager extends Component {
    static propTypes = {
        /**
         * The connection status
         */
        devices: PropTypes.array,

        /**
         * The connection status
         */
        isSimulator: PropTypes.bool,

        /**
         * The connection status
         */
        onDeviceSelected: PropTypes.func,

        /**
         * The connection status
         */
        onDeviceUnselected: PropTypes.func,

        /**
         * The connection status
         */
        onShowDevToolsClicked: PropTypes.func,

        /**
         * The connection status
         */
        onStartScanningClicked: PropTypes.func,

        /**
         * The connection status
         */
        onStopScanningClicked: PropTypes.func,

        /**
         * The connection status
         */
        scanning: PropTypes.bool,

        /**
         * The connection status
         */
        selectedDevices: PropTypes.array
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

        this._onDeviceSelectionChanged
            = this._onDeviceSelectionChanged.bind(this);
    }

    /**
     * Handle device selection changed event.
     *
     * @param {*} event - the event
     * @private
     * @returns {void}
     */
    _onDeviceSelectionChanged(event) {
        const devId = event.target.id.match(/\d+/);

        if (devId !== null && devId.length > 0) {
            if (event.target.checked) {
                this.props.onDeviceSelected(parseInt(devId[0], 10));
            } else {
                this.props.onDeviceUnselected(parseInt(devId[0], 10));
            }
        }
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const devList = this.props.devices.map(device => {
            const checked
                = this.props.selectedDevices.indexOf(device.Index) !== -1;

            return (
                <div key = { device.Index.toString() }>
                    <input
                        checked = { checked }
                        className = 'buttplug-device-checkbox'
                        id = { `buttplug-device-${device.Index.toString()}` }
                        onChange = { this._onDeviceSelectionChanged }
                        // eslint-disable-next-line react-native/no-inline-styles
                        style = {{
                            display: 'inline-block',
                            margin: '0, 5px',
                            width: 'auto'
                        }}
                        type = 'checkbox' />
                    <label
                        className = 'buttplug-device-checkbox-label'
                        htmlFor = {
                            `buttplug-device-${device.Index.toString()}`
                        } >{ device.Name }</label>
                </div>
            );
        });

        return (
            <div id = 'buttplug-device-manager'>
                <div className = 'title'>Devices</div>
                <div>{ devList }</div>
                {!this.props.scanning
                && <Button
                    appearance = 'primary'
                    onClick = { this.props.onStartScanningClicked }
                    shouldFitContainer = { true }>
                    Start Scanning</Button>}
                {this.props.scanning
                && <Button
                    appearance = 'primary'
                    onClick = { this.props.onStopScanningClicked }
                    shouldFitContainer = { true }>
                    Stop Scanning</Button>}
                {this.props.isSimulator
                && <Button
                    appearance = 'primary'
                    onClick = { this.props.onShowDevToolsClicked }
                    shouldFitContainer = { true }>
                    Show DevTools</Button>}
            </div>
        );
    }
}

export default ButtplugDeviceManager;
