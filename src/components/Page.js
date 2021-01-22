import React from 'react';
import PageHome from './PageHome';
import PageChallenges from './PageChallenges';
import PageScoreboard from './PageScoreboard';
import PageProfile from './PageProfile';
import PageLogin from './PageLogin';

let ValidPages = {
    'challenges': PageChallenges,
    'scoreboard': PageScoreboard,
    'profile': PageProfile,
    'login': PageLogin,
    '': PageHome
};

function Page(props) {
    return React.createElement(
        ValidPages[props.path[0]],
        {
            userinfo: props.userinfo,
            checkSession: props.checkSession,
            path: props.path
        }
    );
}

let ValidPageList = Object.keys(ValidPages);

export { Page, ValidPageList };
