import React from 'react';
import styles from './App.module.css';
import NavBar from './components/NavBar';
import Page from './components/Page';
import { Api, loadingError } from './lib/api.js';

export default class App extends React.Component {
    websiteName = 'example.org';
    render() {
        return (
            <div>
                <NavBar path={this.state.path} userinfo={this.state.userinfo} checkSession={this.checkSession} websiteName={this.websiteName} />
                <h2 id="errorText" className={styles.errorText}> </h2>
                <Page path={this.state.path} userinfo={this.state.userinfo} checkSession={this.checkSession} />
                <footer className={styles.footer}>
                    <div className="capWidth">
                        <span className="text-muted">copyright {new Date().getFullYear()} - {this.websiteName}</span>
                    </div>
                </footer>
            </div>
        );
    }

    getPath = () => {
        let path = window.location.hash.split('/').slice(1, Infinity);

        if (!['challenges', 'scoreboard', 'profile', 'register', 'login'].includes(path[0]))
            path = [''];

        let title = this.websiteName;
        if (path[0])
            title = path[0] + ' | ' + title;

        document.querySelector('title').textContent = title;
        return path;
    };
    state = {
        userinfo: false,
        path: this.getPath()
    };
    checkSession = () => Api('myuserinfo').then(x => this.setState({ userinfo: x })).catch(loadingError);
    componentDidMount = () => {
        window.addEventListener("hashchange", this.handleHashChange, false);
        this.checkSession();
    };
    componentWillUnmount = () => window.removeEventListener("hashchange", this.handleHashChange, false);
    handleHashChange = () => this.setState({ path: this.getPath() });
}
