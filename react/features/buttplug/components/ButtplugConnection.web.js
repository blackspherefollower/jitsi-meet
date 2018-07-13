/* eslint-disable new-cap */
import Button from '@atlaskit/button';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

/**
 * Implements a React {@link Component} which displays a Buttplug connection
 * flow
 *
 * @extends Component
 */
class ButtplugConnection extends Component {
    static propTypes = {
        /**
         * The client
         */
        _client: PropTypes.object,

        /**
         * The connection status
         */
        connected: PropTypes.bool,

        /**
         * Default value for websocket address
         */
        defaultAddress: PropTypes.string,

        /**
         * Default value for client name
         */
        defaultClientName: PropTypes.string,

        /**
         * Updates the redux store with selected device changes
         */
        dispatch: PropTypes.func,

        /**
         * Input reference for websocket address
         */
        handleAddressChange: PropTypes.func,

        /**
         * Input reference for client name
         */
        handleClientNameChange: PropTypes.func,

        /**
         * The connection status
         */
        onConnectLocalClicked: PropTypes.func,

        /**
         * The connection status
         */
        onConnectSimulatorClicked: PropTypes.func,

        /**
         * The connection status
         */
        onConnectWebsocketClicked: PropTypes.func,

        /**
         * The connection status
         */
        onDisconnectClicked: PropTypes.func
    };

    /**
     * Constructs a buttplug conenction manager.
     *
     * @param {*} props - props passed down
     * @returns {void}
     */
    constructor(props) {
        super(props);

        this._onAddressChange = this._onAddressChange.bind(this);
        this._onClientNameChange = this._onClientNameChange.bind(this);
    }

    /**
     * Handle update to address.
     *
     * @param {*} event - the event
     * @private
     * @returns {void}
     */
    _onAddressChange(event) {
        this.props.handleAddressChange(event);
    }

    /**
     * Handle update to client name.
     *
     * @param {*} event - the event
     * @private
     * @returns {void}
     */
    _onClientNameChange(event) {
        this.props.handleClientNameChange(event);
    }


    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (
            <div id = 'buttplug-connection-manager'>
                <div className = 'title'>Connection</div>
                {!this.props.connected
                    && <form>
                        <span>Client Name</span>
                        <input
                            autoFocus = 'true'
                            className = 'input-control'
                            defaultValue = { this.props.defaultClientName }
                            id = 'clientName'
                            onChange = { this._onClientNameChange }
                            type = 'text' />
                        <span>Server Address</span>
                        <input
                            autoFocus = 'true'
                            className = 'input-control'
                            defaultValue = { this.props.defaultAddress }
                            id = 'serverAddress'
                            onChange = { this._onAddressChange }
                            type = 'text' />
                        <Button
                            appearance = 'primary'
                            onClick = {
                                this.props.onConnectWebsocketClicked
                            }
                            shouldFitContainer = { true }>
                            Connect Websocket
                        </Button>
                        <Button
                            appearance = 'primary'
                            onClick = { this.props.onConnectLocalClicked }
                            shouldFitContainer = { true }>
                            Connect Local
                        </Button>
                        <Button
                            appearance = 'primary'
                            onClick = {
                                this.props.onConnectSimulatorClicked
                            }
                            shouldFitContainer = { true }>
                            Connect Simulator
                        </Button>
                    </form>
                }
                {this.props.connected
                    && <form>
                        <Button
                            appearance = 'primary'
                            onClick = { this.props.onDisconnectClicked }
                            shouldFitContainer = { true }>
                            Disconnect
                        </Button>
                    </form>
                }
            </div>
        );
    }
}

export default ButtplugConnection;
