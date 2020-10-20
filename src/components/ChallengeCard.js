import React from 'react';
import styles from './ChallengeCard.module.css';

export default class ChallengeCard extends React.Component {
    render() {
        return (
            <div className={styles.challengeCard} style={{ backgroundColor: this.props.solved ? "#28a745" : "#dc3545" }} >
                <br />
                <b>{this.props.challenge.title}</b>
                <br />
                {this.props.challenge.points} points
                <br /><br />
            </div>
        );
    }
}