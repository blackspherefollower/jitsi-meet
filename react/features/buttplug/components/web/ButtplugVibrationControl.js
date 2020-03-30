// @flow

import React, { PureComponent } from 'react';
import { Checkbox } from '@atlaskit/checkbox';
import FieldRange from '@atlaskit/range/Range';
import type { ButtplugDeviceWarpper } from './ButtplugController';

export type Props = {

    /**
     * value
     */
    device: ButtplugDeviceWarpper,

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
    remoted: string,

    /**
     * value
     */
    user: string
}

/**
 * Implements a React {@link Component} which displays a Buttplug connection
 * flow
 *
 * @extends Component
 */
export class ButtplugVibrationControl<P: Props> extends PureComponent<P> {

    /**
     * Construct a vibe control.
     *
     * @param {*} props - The props.
     * @private
     * @returns {void}
     */
    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);
        this._onRemoteAccessChange = this._onRemoteAccessChange.bind(this);
    }

    /**
     * Render a vibe control.
     *
     * @private
     * @returns {void}
     */
    render() {
        let speed = 0;

        if (this.props.device.State.hasOwnProperty('VibrateCmd')) {
            Object.entries(this.props.device.State.VibrateCmd).forEach((k, v) => {
                speed = Math.max(speed, v);
            });
        }

        return (
            <div>
                <span>{this.props.device.Device.Name}</span>
                { !this.props.remote && <Checkbox
                    defaultChecked = { this.props.remoted !== null }
                    label = 'Remote Controlled'
                    onChange = { this._onRemoteAccessChange } /> }
                <FieldRange
                    defaultValue = { Math.max(Math.min(speed * 100, 100), 0) }
                    isDisabled = { this.props.remoted !== null }
                    max = { 100 }
                    min = { 0 }
                    onChange = { this._onChange }
                    step = { 1 } />
            </div>
        );
    }

    /**
     * Trigger a vibe control chnage.
     *
     * @param {*} newValue - The new value.
     * @private
     * @returns {void}
     */
    _onChange(newValue) {
        const speed = newValue / 100;
        let features = 1;

        try {
            // eslint-disable-next-line new-cap
            features = this.props.device.Device.MessageAttributes('VibrateCmd').FeatureCount;
        } catch (e) {
            // no-op
        }
        const newState = { ...this.props.device.State,
            VibrateCmd: {} };

        for (let i = 0; i <= features; i++) {
            newState.VibrateCmd[i] = speed;
        }
        this.props.onChange(this.props.device, newState, this.props.user);
    }

    /**
     * Trigger a vibe control chnage.
     *
     * @param {*} event - The event.
     * @private
     * @returns {void}
     */
    _onRemoteAccessChange(event) {
        this.props.onRemoteAccessChange(this.props.device, event.target.checked ? '' : null);
    }
}
