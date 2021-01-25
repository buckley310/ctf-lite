import React from 'react';

function PageHome(props) {
    return (
        <div className="capWidth">
            <h1>Home</h1>
            <h4>Welcome{props.userinfo ? (' ' + props.userinfo.username) : ''}!</h4>
        </div>
    );
}

export default PageHome;
