import React from 'react';
import { Api, loadingError } from '../lib/api.js';
import styles from './PageScoreboard.module.css';

export default class PageScoreboard extends React.Component {
    state = { scoreboard: [] };
    viewProfile = id => {
        alert(`TODO: ${id}`);
    };
    render() {
        return (
            <div className="capWidth">
                <h1>scoreboard - top 10</h1>
                <table className={styles.scoreboard}>
                    <thead>
                        <tr>
                            <th width='1'></th>
                            <th>username</th>
                            <th>points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.scoreboard.map(entry => (
                            <tr key={entry.username} onClick={() => this.viewProfile(entry._id)}>
                                <td></td>
                                <td>{entry.username}</td>
                                <td>{entry.score}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
    componentDidMount = () => Api('scoreboard').then(x => this.setState({ scoreboard: x })).catch(loadingError);
}
