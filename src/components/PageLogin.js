import React from 'react';
import { apiEndpoint } from '../lib/api.js';
import styles from './PageLogin.module.css';

function PageLogin(props) {

    let doLogin = e => {
        e.preventDefault();
        window.open(apiEndpoint + "/login/discord", '_blank', 'menubar=0,width=520,height=768');
    };

    return (
        <div className="capWidth">
            <h2>Login with:</h2>
            <button
                onClick={doLogin}
                className={styles.hoverPointer}
                style={{ background: "#444444" }}
            >
                <img width="200" alt="Discord Button" src="https://discordapp.com/assets/e7a3b51fdac2aa5ec71975d257d5c405.png" />
            </button>
        </div>
    );
}

export default PageLogin;
