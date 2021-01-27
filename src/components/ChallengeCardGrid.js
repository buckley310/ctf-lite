import React from 'react';
import { Api, loadingError } from '../lib/api.js';
import ChallengeCard from './ChallengeCard';

export default class ChallengeCardGrid extends React.Component {
    state = { challenges: [] };
    render() {
        let sections = {};
        for (let chal of this.state.challenges) {
            if (!sections[chal['category']])
                sections[chal['category']] = [];

            sections[chal['category']].push(chal);
        }

        return (
            <div id="challenges">
                {Object.keys(sections).map(category => (
                    <div key={category}>
                        <div style={{ fontSize: "1.5em" }}>
                            {category}
                        </div>
                        <div className="challengeSection" style={{ display: 'flex', flexWrap: 'wrap' }}>
                            {sections[category].map(chal =>
                                <ChallengeCard
                                    key={chal.title}
                                    challenge={chal}
                                    solved={this.props.solves.includes(chal._id)}
                                />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        );
    }
    componentDidMount = () => Api('challenges').then(x => this.setState({ challenges: x })).catch(loadingError);
}
