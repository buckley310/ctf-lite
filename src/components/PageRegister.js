import React from 'react';
import { Api, loadingError } from '../lib/api.js';

function doRegister(e) {
    e.preventDefault();
    let uname = document.getElementById('username').value;
    let pwd1 = document.getElementById('password').value;
    let pwd2 = document.getElementById('password2').value;

    if (pwd1 !== pwd2)
        return document.getElementById('errorText').textContent = "Passwords don't match.";

    Api('newaccount', { username: uname, password: pwd1 })
        .then(function (j) {
            if (j.ok)
                window.location.assign('#/login');
            else
                document.getElementById('errorText').textContent = j.txt;
        }).catch(loadingError);
}

function PageRegister() {
    return (
        <div className="capWidth">
            <h2>Register!</h2>
            <form id="registerForm" onSubmit={doRegister}>
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
                        <th className="loginLabel">Confirm Password:</th>
                        <th className="loginInput"> <input id="password2" type="password" required /> </th>
                    </tr>
                    <tr>
                        <th></th>
                        <th className="loginInput"> <input type="submit" value="Register" /> </th>
                    </tr>
                </tbody></table>
            </form>
        </div>
    );
}

export default PageRegister;
