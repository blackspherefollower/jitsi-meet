// @flow
/* eslint-disable new-cap,max-len */
import Button from '@atlaskit/button';

import React, { PureComponent } from 'react';
import { Checkbox } from '@atlaskit/checkbox';

export type Props = {

    /**
     * The connection status
     */
    devices: Array<Object>,

    /**
     * The connection status
     */
    onDeviceSelected: Function,

    /**
     * The connection status
     */
    onDeviceUnselected: Function,

    /**
     * The connection status
     */
    onStartScanningClicked: Function,

    /**
     * The connection status
     */
    onStopScanningClicked: Function,

    /**
     * The connection status
     */
    scanning: boolean,

    /**
     * The connection status
     */
    selectedDevices: Array<Object>
};

/**
 * Implements a React {@link Component} which displays a Buttplug connection
 * flow
 *
 * @extends Component
 */
class ButtplugDeviceManager<P: Props> extends PureComponent<P> {


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
        const devId = event.target.value;

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
                = this.props.selectedDevices.findIndex(d => d.Device.Index === device.Index) !== -1;

            return (
                <Checkbox
                    className = 'buttplug-device-checkbox'
                    defaultChecked = { checked }
                    id = { `buttplug-device-${device.Index}` }
                    key = { device.Index }
                    label = { device.Name }
                    onChange = { this._onDeviceSelectionChanged }
                    value = { device.Index } />
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
            </div>
        );
    }
}

export default ButtplugDeviceManager;
