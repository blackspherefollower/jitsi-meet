/* @flow */

import React, { Component } from 'react';

declare var interfaceConfig: Object;

/**
 * React component for showing a list of current conference participants.
 *
 * @extends Component
 */
class ButtplugPanel extends Component<*> {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     */
    render() {
        return (
            <div className = 'contact-list-panel'>
                <div className = 'title'>
                    BUTTPLUG!!!
                </div>
            </div>
        );
    }
}

export default ButtplugPanel;
