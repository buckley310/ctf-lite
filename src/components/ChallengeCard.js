import React from 'react';
import styles from './ChallengeCard.module.css';
import ModalPopup from './ModalPopup';

export default class ChallengeCard extends React.Component {
    state = { show: false };
    render() {
        return <div>
            <div
                className={styles.challengeCard}
                style={{ backgroundColor: this.props.solved ? "#28a745" : "#dc3545" }}
                onClick={() => this.setState({ show: true })}
            >
                <br />
                <b>{this.props.challenge.title}</b>
                <br />
                {this.props.challenge.points} points
                <br /><br />
            </div>
            <ModalPopup
                title={this.props.challenge.title}
                show={this.state.show}
                close={() => this.setState({ show: false })}
            >
                <div
                    dangerouslySetInnerHTML={{ __html: this.props.challenge.text }}
                    style={{ paddingBottom: '20px' }}
                />
                <div>points: {this.props.challenge.points}</div>
                <div>solves: {this.props.challenge.solves}</div>
            </ModalPopup>
        </div>;
    }
}
