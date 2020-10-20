import React from 'react';
import { Api, loadingError } from '../lib/api.js';
import ChallengeCardSection from './ChallengeCardSection';

export default class PageChallenges extends React.Component {
    state = { challenges: [] };
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

                <form id="loginForm" style={{ display: 'none' }} onSubmit={e => e.preventDefault()}>
                    <input id="flag" type="text" placeholder="flag{}" />
                    <input type="submit" value="Submit" />
                </form>
                <div id="challenges">
                    {Object.keys(sections).map(category => (
                        <ChallengeCardSection
                            key={category}
                            challenges={sections[category]}
                            solves={this.props.userinfo ? this.props.userinfo.solves : []}
                        />
                    ))}
                </div>
                {/* <script>
                function submitFlag() {
                    let flag = document.getElementById('flag').value;
                    if (!flag) return;
                    api('submitflag', { flag: flag })
                        .then(function (j) {
                                alert(j.msg);
                                if (j.ok)
                                    location.reload();
                        }).catch(loadingError);
                }
                function contentInit() {
                    insertChallengeCards(
                        document.getElementById('challenges'),
                        userinfo ? userinfo['_id'] : ''
                    );
                    if (userinfo) {
                        document.getElementById('loginForm').addEventListener('submit', submitFlag);
                        document.getElementById('loginForm').style.display = '';
                    }
                }
            </script> */}
            </div>
        );
    }
    componentDidMount = () => Api('challenges').then(x => this.setState({ challenges: x })).catch(loadingError);
}
