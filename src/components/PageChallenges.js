import React from 'react';
import { Api, loadingError } from '../lib/api.js';
import ChallengeCardGrid from './ChallengeCardGrid';

export default class PageChallenges extends React.Component {
    state = { challenges: [] };
    submitFlag = e => {
        e.preventDefault();
        let flag = document.querySelector('#flagInput').value;
        document.querySelector('#flagInput').value = null;
        if (!flag) return;
        Api('submitflag', { flag: flag })
            .then(j => {
                alert(j.msg);
                if (j.ok)
                    this.props.checkSession();
            }).catch(loadingError);
    };
    render() {

        let sections = {};
        for (let chal of this.state.challenges) {
            if (!sections[chal['category']])
                sections[chal['category']] = [];

            sections[chal['category']].push(chal);
        }

        return (
            <div className="capWidth">
                <h1>Challenges!</h1>

                <form style={this.props.userinfo ? {} : { display: 'none' }} onSubmit={this.submitFlag}>
                    <input id="flagInput" type="text" placeholder="flag{}" />
                    <input type="submit" value="Submit" />
                </form>
                <ChallengeCardGrid
                    challenges={this.state.challenges}
                    solves={this.props.userinfo ? this.props.userinfo.solves : []}
                />
            </div>
        );
    }
    componentDidMount = () => Api('challenges').then(x => this.setState({ challenges: x })).catch(loadingError);
}
