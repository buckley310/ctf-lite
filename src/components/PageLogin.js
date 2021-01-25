import React from 'react';
import { apiEndpoint } from '../lib/api.js';

function PageLogin(props) {

    let doLogin = e => {
        e.preventDefault();
        window.open(apiEndpoint + "/login/discord", '_blank', 'menubar=0,width=520,height=768');
    };

    return (
        <div className="capWidth">
            <h2>Login!</h2>
            <form id="loginForm" onSubmit={doLogin}>
                <input type="submit" value="Login" />
            </form>
        </div>
    );
}

export default PageLogin;
