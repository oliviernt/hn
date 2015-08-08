var url = 'https://hacker-news.firebaseio.com/v0/',
    max = 30;
fetch(url + 'topstories.json').then(function (response) {
    if (response.ok) {
        return response.json();
    }
}).then(function (ids) {
    var objects = JSON.parse(localStorage.getItem('hn')) || [];
    ids = ids.splice(0, max).filter(function (id) {
        return objects.filter(function (object) {
            return object.id === id;
        }).length === 0;
    });
    Promise.all(ids.map(function (id, index) {
        console.log('fetching', id);
        return fetch(url + 'item/' + id + '.json').then(function (response) {
            if (response.ok) {
                return response.json();
            }
        }).catch(console.errror);
    })).then(function (result) {
        var sec = document.querySelector('section');
        objects = result.concat(objects.slice(0, max - result.length)).map(function (item, index) {
            console.log(index, item.id, item.title);
            var link = document.createElement('a');
            link.href = item.url;
            link.title = item.title;
            link.innerHTML = item.title;
            var p = document.createElement('p');
            p.appendChild(link);
            sec.appendChild(p);
            return item;
        });
        localStorage.setItem('hn', JSON.stringify(objects));
    });
}).catch(console.error);
