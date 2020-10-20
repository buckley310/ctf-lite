import React from 'react';
import PageHome from './PageHome';
import PageChallenges from './PageChallenges';
import PageScoreboard from './PageScoreboard';
import PageProfile from './PageProfile';
import PageRegister from './PageRegister';
import PageLogin from './PageLogin';

function Page(props) {
    switch (props.path[0]) {
        case 'challenges': return <PageChallenges userinfo={props.userinfo} />;
        case 'scoreboard': return <PageScoreboard />;
        case 'profile': return <PageProfile />;
        case 'register': return <PageRegister />;
        case 'login': return <PageLogin checkSession={props.checkSession} />;
        default: return <PageHome userinfo={props.userinfo} />;
    }
}

export default Page;
