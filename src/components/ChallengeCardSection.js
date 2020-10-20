import React from 'react';
import ChallengeCard from './ChallengeCard';

export default class ChallengeCardSection extends React.Component {
    render() {
        return <div>
            <div style={{ fontSize: "1.5em" }}>
                {this.props.challenges[0].category}
            </div>
            <div className="challengeSection" style={{ display: 'flex', flexWrap: 'wrap' }}>
                {this.props.challenges.map(chal =>
                    <ChallengeCard key={chal.title} challenge={chal} solved={this.props.solves.includes(chal._id)} />
                )}
            </div>
        </div>;
    }
}
