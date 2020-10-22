import React from 'react';
import { Api, loadingError } from '../lib/api.js';
import ChallengeCardGrid from './ChallengeCardGrid';

export default class PageProfile extends React.Component {

    changeEmail = e => {
        e.preventDefault();

        let pwd = document.getElementById('epassword').value;
        let email1 = document.getElementById('email1').value;
        let email2 = document.getElementById('email2').value;

        if (email1 !== email2)
            return document.getElementById('errorText').textContent = "Emails don't match.";

        Api('setemail', { password: pwd, email: email1 })
            .then(j => {
                if (j.ok) {
                    alert('Email has been changed.');
                    this.props.checkSession();
                } else {
                    document.getElementById('errorText').textContent = j.txt;
                }
            }).catch(loadingError);
    };

    changePass = e => {
        e.preventDefault();

        let pwdold = document.getElementById('passwordOld').value;
        let pwd1 = document.getElementById('password').value;
        let pwd2 = document.getElementById('password2').value;

        if (pwd1 !== pwd2)
            return document.getElementById('errorText').textContent = "Passwords don't match.";

        Api('setpassword', { oldpass: pwdold, newpass: pwd1 })
            .then(j => {
                if (j.ok)
                    alert('Password has been changed.');
                else
                    document.getElementById('errorText').textContent = j.txt;
            }).catch(loadingError);
    };

    render() {
        return (
            <div className="capWidth">
                <div style={{ display: this.props.userinfo ? '' : 'none' }}>
                    <h1>profile</h1>
                    <div>email: {this.props.userinfo.email}</div>
                    <div>username: {this.props.userinfo.username}</div>
                    <div>score: {this.props.userinfo.score}</div>

                    <form onSubmit={this.changePass} style={{ backgroundColor: '#f0f0f0' }}>
                        <h3>Change Password:</h3>
                        <table><tbody>
                            <tr>
                                <th className="loginLabel">Current Password:</th>
                                <th className="loginInput"> <input id="passwordOld" type="password" required /> </th>
                            </tr>
                            <tr>
                                <th className="loginLabel">New Password:</th>
                                <th className="loginInput"> <input id="password" type="password" required /> </th>
                            </tr>
                            <tr>
                                <th className="loginLabel">Confirm New Password:</th>
                                <th className="loginInput"> <input id="password2" type="password" required /> </th>
                            </tr>
                            <tr>
                                <th></th>
                                <th className="loginInput"> <input type="submit" value="Change" /> </th>
                            </tr>
                        </tbody></table>
                    </form>

                    <form onSubmit={this.changeEmail} style={{ backgroundColor: '#f0f0f0' }}>
                        <h3>Change Email:</h3>
                        <table><tbody>
                            <tr>
                                <th className="loginLabel">Current Password:</th>
                                <th className="loginInput"> <input id="epassword" type="password" required /> </th>
                            </tr>
                            <tr>
                                <th className="loginLabel">New Email:</th>
                                <th className="loginInput"> <input id="email1" type="email" required /> </th>
                            </tr>
                            <tr>
                                <th className="loginLabel">Confirm New Email:</th>
                                <th className="loginInput"> <input id="email2" type="email" required /> </th>
                            </tr>
                            <tr>
                                <th></th>
                                <th className="loginInput"> <input type="submit" value="Change" /> </th>
                            </tr>
                        </tbody></table>
                    </form>
                </div>

                <h1>Solved Challenges:</h1>
                <ChallengeCardGrid solves={this.props.userinfo ? this.props.userinfo.solves : []} />
            </div>
        );
    }
}
