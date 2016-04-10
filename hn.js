(function() {
	const URL = 'https://hacker-news.firebaseio.com/v0/';
	var max = parseInt(localStorage.getItem('hnMax'), 10) || 30;
	var objects;

	function load() {
		objects = JSON.parse(localStorage.getItem('hn')) || [];
		fetch(URL + 'topstories.json')
			.then(response => {
				if (response.ok) {
					return response.json();
				}
			})
			.then(ids => {
				// get ids not stored in localStorage
				ids = ids.splice(0, max)
					.filter(id =>
						objects.filter(object => object.id === id).length === 0
					);
				return Promise.all(ids.map(id =>
					fetch(URL + 'item/' + id + '.json')
						.then(response => {
							if (response.ok) {
								return response.json();
							}
						})
						.catch(console.error)));
			})
			.then(result => {
				// console.log(result);
				var list = document.querySelector('ol');
				// merge objects and display them
				objects = result.concat(objects.slice(0, max - result.length))
					.map(item => {
						// console.log(item.id, item.title);
						var link = document.createElement('a');
						link.href = item.url;
						link.title = item.title;
						link.innerHTML = item.title + ' (' + item.score + ')';
						var li = document.createElement('li');
						li.appendChild(link);
						list.appendChild(li);
						return item;
					});
				localStorage.setItem('hn', JSON.stringify(objects));
			}).catch(console.error.bind(console));
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
}());
