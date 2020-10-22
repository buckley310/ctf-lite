import React from 'react';
import PageHome from './PageHome';
import PageChallenges from './PageChallenges';
import PageScoreboard from './PageScoreboard';
import PageProfile from './PageProfile';
import PageRegister from './PageRegister';
import PageLogin from './PageLogin';

function Page(props) {
    switch (props.path[0]) {
        case 'challenges': return <PageChallenges userinfo={props.userinfo} checkSession={props.checkSession} />;
        case 'scoreboard': return <PageScoreboard userinfo={props.userinfo} checkSession={props.checkSession} />;
        case 'profile': return <PageProfile userinfo={props.userinfo} checkSession={props.checkSession} />;
        case 'register': return <PageRegister userinfo={props.userinfo} checkSession={props.checkSession} />;
        case 'login': return <PageLogin userinfo={props.userinfo} checkSession={props.checkSession} />;
        default: return <PageHome userinfo={props.userinfo} checkSession={props.checkSession} />;
    }
}

export default Page;
