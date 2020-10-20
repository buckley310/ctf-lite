import React from 'react';

function PageScoreboard() {
    return (
        <div className="capWidth">
            <h1>scoreboard - top 10</h1>
            <table id="scoreboard">
                <thead>
                    <tr>
                        <th width='1'>placement</th>
                        <th>username</th>
                        <th>points</th>
                    </tr>
                </thead>
                <tbody id="scoreTable">
                </tbody>
            </table>
            {/* <script>
                function contentInit() {
                    api('scoreboard').then(function (j) {
                        let stripes = true;
                        for (let i in j) {
                            let tr = document.createElement('tr');
                            tr.addEventListener('click', () => location.assign('/profile/#' + j[i]['_id']));

                            let place = document.createElement('td');
                            let name = document.createElement('td');
                            let points = document.createElement('td');

                            place.textContent = i;
                            name.textContent = j[i]['username'];
                            points.textContent = j[i]['score'];

                            tr.appendChild(place);
                            tr.appendChild(name);
                            tr.appendChild(points);

                            if (stripes)
                                tr.style.backgroundColor = "rgba(0,0,0,.05)"
                            stripes = !stripes;

                            document.getElementById('scoreTable').appendChild(tr);
                        }
                    }).catch(loadingError);
                }
            </script> */}
        </div>
    );
}

export default PageScoreboard;
