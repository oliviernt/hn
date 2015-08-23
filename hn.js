(function() {
	var url = 'https://hacker-news.firebaseio.com/v0/',
	max = parseInt(localStorage.getItem('hnMax'), 10) || 30;

	function load() {
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
				return fetch(url + 'item/' + id + '.json').then(function (response) {
					if (response.ok) {
						return response.json();
					}
				}).catch(console.errror);
			})).then(function (result) {
				console.log(result);
				var list = document.querySelector('ol');
				objects = result.concat(objects.slice(0, max - result.length)).map(function (item, index) {
					console.log(index, item.id, item.title);
					var link = document.createElement('a');
					link.href = item.url;
					link.title = item.title;
					link.innerHTML = item.title;// + hostname(item.url);
					var li = document.createElement('li');
					li.appendChild(link);
					list.appendChild(li);
					return item;
				});
				localStorage.setItem('hn', JSON.stringify(objects));
			});
		}).catch(console.error);
	}
	load();

	var maxInpt = document.querySelector('input[type=number');
	maxInpt.value = max;
	maxInpt.onchange = function () {
		max = maxInpt.value;
		localStorage.setItem('hnMax', maxInpt.value);
		localStorage.setItem('hn', JSON.stringify([]));
		document.querySelector('ol').remove();
		document.querySelector('section').appendChild(document.createElement('ol'));
		load();
	}

	function hostname(url) {
		var hostname = url;
		return hostname;
	}
}());
