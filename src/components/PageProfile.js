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

    componentDidUpdate = () => {
        let otherUser = this.props.path[1];
        if (otherUser) {
            if (Number.isInteger(parseInt(otherUser))) {
                if (parseInt(otherUser) !== this.state.fetchedUser) {
                    this.setState({ fetchedUser: parseInt(otherUser), userinfo: this.blankuser });
                    Api('userinfo?uid=' + otherUser)
                        .then(x => { if (x.ok) this.setState({ fetchedUser: x.data._id, userinfo: x.data }) })
                        .catch(loadingError);
                }
            } else if (this.state.userinfo !== this.blankuser) {
                this.setState({ fetchedUser: null, userinfo: this.blankuser });
            }
        } else if (this.props.userinfo && this.props.userinfo !== this.state.userinfo) {
            this.setState({ userinfo: this.props.userinfo, fetchedUser: null });
        }
    };
    componentDidMount = this.componentDidUpdate;

    render() {
        let personalStuff = Boolean(this.props.path[1]) ? { display: 'none' } : {};
        return (
            <div className="capWidth">
                <h1>Profile</h1>
                <div>username: {this.state.userinfo.username}</div>
                <div>score: {this.state.userinfo.score}</div>
                <div style={personalStuff}>
                    <div>email: {this.state.userinfo.email}</div>
                </div>
                <h1>Solved Challenges:</h1>
                <ChallengeCardGrid solves={this.state.userinfo ? this.state.userinfo.solves : []} />
            </div>
        );
    }
    blankuser = {
        _id: null,
        username: null,
        email: null,
        score: null,
        solves: []
    };
    state = {
        fetchedUser: null,
        userinfo: this.blankuser
    };
}
