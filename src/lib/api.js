// let userinfo;

let apiEndpoint = 'http://localhost:5000';
if (window.location.host.match(/^ctf/))
    apiEndpoint = window.location.host.replace(/^ctf\./, "https://ctfapi.");

function loadingError(e) {
    console.error(e);
    let txt = document.querySelector('#errorText');
    if (txt) txt.textContent = 'An error was encountered accessing the API';
}

function Api(path, args = false) {
    document.getElementById('errorText').textContent = null;

    let headers = {};

    let st = window.localStorage.getItem('sessionToken');
    if (st)
        headers['X-Sesid'] = st;

    if (args)
        headers['Content-Type'] = 'application/json';

    return fetch(apiEndpoint + '/' + path, {
        cache: "no-cache",
        method: args ? 'POST' : 'GET',
        body: args ? JSON.stringify(args) : null,
        headers: headers
    }).then(x => x.json());
}

export { Api, loadingError, apiEndpoint };
