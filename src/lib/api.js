// let userinfo;

function loadingError(e) {
    console.error(e);
    document.getElementById('errorText').textContent = 'An error was encountered accessing the API';
}

function Api(path, args = false) {

    let headers = {};

    let st = window.localStorage.getItem('sessionToken');
    if (st)
        headers['X-Sesid'] = st;

    if (args)
        headers['Content-Type'] = 'application/json';

    return fetch('http://127.0.0.1:5000/' + path, {
        cache: "no-cache",
        method: args ? 'POST' : 'GET',
        body: args ? JSON.stringify(args) : null,
        headers: headers
    }).then(x => x.json());
}

export { Api, loadingError };
