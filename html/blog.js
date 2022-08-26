config = {
    locateFile: filename => `/dist/${filename}`
}

initSqlJs(config).then(function(SQL){

    const req = new XMLHttpRequest();
    req.open("GET", "blog.sqlite3", true);
    req.responseType = "arraybuffer";

    req.onload = _ => {
        if (req.response) {
            loadDb(SQL, new Uint8Array(req.response))
        }
    };

    req.send();
});

function loadDb(SQL, buf) {

    const db = new SQL.Database(new Uint8Array(buf))
    const statement = db.prepare("SELECT * FROM toc");

    var tocElm = document.getElementById('toc'); // table of contents

    var tblElem = document.createElement('table');
    var bodyElem = document.createElement('tbody');
    tblElem.appendChild(bodyElem);
    tocElm.appendChild(tblElem);

    while(statement.step()) {
        const row = statement.getAsObject();
        console.log('found post ' + JSON.stringify(row));

        var rowElem = document.createElement('tr');
        var dateCell = document.createElement('td');
        var titleCell = document.createElement('td');
        var link = document.createElement('a');
        var span = document.createElement('span');
        var linkText = document.createTextNode(`${row['title']}`);

        bodyElem.appendChild(rowElem);
        rowElem.appendChild(dateCell);
        rowElem.appendChild(titleCell);
        titleCell.appendChild(link);

        dateCell.textContent = row['date'];

        span.appendChild(linkText);
        link.appendChild(span);
        link.title = `${row['title']}`;
        link.href = `${row['href']}`;
    }
}