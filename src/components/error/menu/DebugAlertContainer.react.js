import './DebugAlertContainer.css';
import {Component} from 'react';
import PropTypes from 'prop-types';
import WarningIcon from '../icons/WarningIcon.svg';
import ErrorIcon from '../icons/ErrorIcon.svg';
import InlineSVG from 'svg-inline-react';

class DebugAlertContainer extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const {alertsOpened} = this.props;
        return (
            <div
                className={`dash-debug-alert-container${
                    alertsOpened ? ' dash-debug-alert-container--opened' : ''
                }`}
                onClick={this.props.onClick}
            >
                <div className="dash-debug-alert">
                    <InlineSVG
                        className="dash-debug-alert-container__icon"
                        src={ErrorIcon}
                    />
                    {this.props.errors.length}
                </div>
                <div className="dash-debug-alert">
                    <InlineSVG
                        className="dash-debug-alert-container__icon dash-debug-alert-container__icon--warning"
                        src={WarningIcon}
                    />
                    0
                </div>
            </div>
        );
    }
}

DebugAlertContainer.propTypes = {
    errors: PropTypes.object,
    alertsOpened: PropTypes.bool,
    onClick: PropTypes.function,
};

export {DebugAlertContainer};
