import React from 'react';

function PageLogin(props) {

    let doLogin = e => {
        e.preventDefault();
        window.open("//ctfapi.devstuff.site/login/discord", '_blank', 'menubar=0');
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
