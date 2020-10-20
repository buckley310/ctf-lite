import React from 'react';
import styles from './NavBar.module.css';

function NavBar(props) {
    let s = tabname => props.path[0] === tabname ? { color: 'white' } : {};

    let doLogout = () => {
        localStorage.removeItem('sessionToken');
        props.checkSession();
    }

    return (
        <header className={styles.header}>
            <div className={"capWidth " + styles.navbar}>
                <span>
                    <span className={styles.logo}>{props.websiteName}</span>
                    <a style={s('')} href="#/">home</a>
                </span>
                <span>
                    <a style={s('challenges')} href="#/challenges">challenges</a>
                    <a style={s('scoreboard')} href="#/scoreboard">scoreboard</a>
                </span>
                <span style={{ display: props.userinfo ? '' : 'none' }}>
                    <a style={s('profile')} href="#/profile">profile</a>
                    <a style={s('logout')} href="#/" onClick={doLogout}>logout</a>
                </span>
                <span style={{ display: props.userinfo ? 'none' : '' }}>
                    <a style={s('register')} href="#/register">register</a>
                    <a style={s('login')} href="#/login">login</a>
                </span>
            </div>
        </header>
    );
}

export default NavBar;
