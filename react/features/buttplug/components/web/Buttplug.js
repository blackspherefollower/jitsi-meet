// @flow

import React from 'react';
import Transition from 'react-transition-group/Transition';

import { translate } from '../../../base/i18n';
import { Icon, IconClose } from '../../../base/icons';
import { connect } from '../../../base/redux';

import AbstractButtplug, {
    _mapDispatchToProps,
    _mapStateToProps,
    type Props
} from '../AbstractButtplug';
import ButtplugView from './ButtplugView';

/**
 * React Component for holding the chat feature in a side panel that slides in
 * and out of view.
 */
class Buttplug extends AbstractButtplug<Props> {

    /**
     * Whether or not the {@code Chat} component is off-screen, having finished
     * its hiding animation.
     */
    _isExited: boolean;

    /**
     * Initializes a new {@code Chat} instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props: Props) {
        super(props);

        this._isExited = true;

        // Bind event handlers so they are only bound once for every instance.
        this._renderPanelContent = this._renderPanelContent.bind(this);
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (
            <Transition
                in = { this.props._isOpen }
                timeout = { 500 }>
                { this._renderPanelContent }
            </Transition>
        );
    }

    /**
     * Instantiates a React Element to display at the top of {@code Chat} to
     * close {@code Chat}.
     *
     * @private
     * @returns {ReactElement}
     */
    _renderChatHeader() {
        return (
            <div className = 'chat-header'>
                <div
                    className = 'chat-close'
                    onClick = { this.props._onToggleButtplug }>
                    <Icon src = { IconClose } />
                </div>
            </div>
        );
    }

    _renderPanelContent: (string) => React$Node | null;

    /**
     * Renders the contents of the chat panel, depending on the current
     * animation state provided by {@code Transition}.
     *
     * @param {string} state - The current display transition state of the
     * {@code Chat} component, as provided by {@code Transition}.
     * @private
     * @returns {ReactElement | null}
     */
    _renderPanelContent(state) {
        this._isExited = state === 'exited';

        const { _isOpen } = this.props;
        const ComponentToRender = !_isOpen && state === 'exited'
            ? null
            : (
                <>
                    { this._renderChatHeader() }
                    { <ButtplugView /> }
                </>
            );

        let className = '';

        if (_isOpen) {
            className = 'slideInExt';
        } else if (this._isExited) {
            className = 'invisible';
        }

        return (
            <div
                className = { `sideToolbarContainer ${className}` }
                id = 'sideToolbarContainer'>
                { ComponentToRender }
            </div>
        );
    }
}

export default translate(connect(_mapStateToProps, _mapDispatchToProps)(Buttplug));
