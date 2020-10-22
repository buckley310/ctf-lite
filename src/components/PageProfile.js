import React from 'react';

export default class PageProfile extends React.Component {
    render() {
        return (
            <div className="capWidth">
                <h1> profile </h1>
                email: {this.props.userinfo.email}<br />
                username: {this.props.userinfo.username}<br />
                score: {this.props.userinfo.score}<br />

                <div id="challenges"></div>

                <form id="changePassForm" onSubmit={e => e.preventDefault()} style={{ backgroundColor: '#f0f0f0' }}>
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

                <form id="changeEmailForm" onSubmit={e => e.preventDefault()} style={{ backgroundColor: '#f0f0f0' }}>
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

                {/* <script>
                function contentInit() {
                    let hash = location.hash.replace('#', '');
                    if (hash) {
                        document.getElementById('emailLine').outerHTML = '';
                        document.getElementById('changePassForm').outerHTML = '';
                        document.getElementById('changeEmailForm').outerHTML = '';
                        api('userinfo?uid=' + hash).then(function (j) {
                            if (!j.ok) {
                                document.getElementById('errorText').textContent = j.txt;
                                return;
                            }
                            document.getElementById('username').textContent = j.data.username;
                            document.getElementById('score').textContent = j.data.score;
                            insertChallengeCards(document.getElementById('challenges'), j.data);
                        });
                        return;
                    }

                    if (!userinfo)
                        return window.location.assign('/');

                    insertChallengeCards(document.getElementById('challenges'), userinfo);

                    function changePass() {
                        let pwdold = document.getElementById('passwordOld').value;
                        let pwd1 = document.getElementById('password').value;
                        let pwd2 = document.getElementById('password2').value;

                        if (pwd1 !== pwd2)
                            return document.getElementById('errorText').textContent = "Passwords don't match.";

                        api('setpassword', { oldpass: pwdold, newpass: pwd1 })
                            .then(function (j) {
                                if (j.ok)
                                    alert('Password has been changed.');
                                else
                                    document.getElementById('errorText').textContent = j.txt;
                            }).catch(loadingError);
                    }

                    function changeEmail() {
                        let pwd = document.getElementById('epassword').value;
                        let email1 = document.getElementById('email1').value;
                        let email2 = document.getElementById('email2').value;

                        if (email1 !== email2)
                            return document.getElementById('errorText').textContent = "Emails don't match.";

                        api('setemail', { password: pwd, email: email1 })
                            .then(function (j) {
                                if (j.ok) {
                                    alert('Email has been changed.');
                                    window.location.reload();
                                } else {
                                    document.getElementById('errorText').textContent = j.txt;
                                }
                            }).catch(loadingError);
                    }

                    document.getElementById('changePassForm').addEventListener('submit', changePass);
                    document.getElementById('changeEmailForm').addEventListener('submit', changeEmail);
                }
            </script> */}
            </div>
        );
    }
}
