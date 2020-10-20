import React from 'react';
import { Api, loadingError } from '../lib/api.js';

function PageLogin(props) {

    let doLogin = e => {
        e.preventDefault();
        Api('login',
            {
                username: document.getElementById('username').value,
                password: document.getElementById('password').value
            }
        ).then(function (j) {
            if (!j.sesid)
                return document.getElementById('errorText').textContent = j.txt;

            localStorage.setItem('sessionToken', j.sesid);

            window.location.assign('#/');
            props.checkSession();
        }).catch(loadingError);
    };

    return (
        <div className="capWidth">
            <h2>Login!</h2>
            <form id="loginForm" onSubmit={doLogin}>
                <table><tbody>
                    <tr>
                        <th className="loginLabel">Username:</th>
                        <th className="loginInput"> <input id="username" type="text" required autoFocus /> </th>
                    </tr>
                    <tr>
                        <th className="loginLabel">Password:</th>
                        <th className="loginInput"> <input id="password" type="password" required /> </th>
                    </tr>
                    <tr>
                        <th />
                        <th className="loginInput"> <input type="submit" value="Login" /> </th>
                    </tr>
                </tbody></table>
            </form>
        </div>
    );
}

export default PageLogin;
