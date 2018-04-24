/* @flow */

import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { translate } from '../../base/i18n';

declare var interfaceConfig: Object;

/**
 * React component for showing buttplugs!
 *
 * @extends Component
 */
class ButtplugPanel extends Component<*> {
    /**
     * Default values for {@code ContactListPanel} component's properties.
     *
     * @static
     */
    static propTypes = {
        /**
         * Invoked to obtain translated strings.
         */
        t: PropTypes.func
    };

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     */
    render() {
        return (
            <div className = 'buttplug-panel'>
                <div className = 'title'>
                    BUTTPLUG!!!
                </div>
            </div>
        );
    }
}

export default translate(ButtplugPanel);
