import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { apiEndpoint } from './lib/api.js';

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);

window.addEventListener("message", (event) => {
    if (event.origin === apiEndpoint) {
        console.log(event.data);
        localStorage.setItem('sessionToken', event.data);
        window.location.assign('#');
        window.location.reload(); // TODO: trigger profile check, dont reload
    }
});
