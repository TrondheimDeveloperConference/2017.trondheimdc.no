var scrollHelper = {
	easeInOut: function(currentTime, start, change, duration) {
		currentTime /= duration / 2;
		if (currentTime < 1) {
			return change / 2 * currentTime * currentTime + start;
		}
		currentTime -= 1;
		return -change / 2 * (currentTime * (currentTime - 2) - 1) + start;
	},

	scrollTo: function(to, duration) {
		var start = window.pageYOffset,
			change = to - start,
			increment = 20;

		if (duration === 0) {
			window.scrollTo(0, to);
			return;
		}

		var animateScroll = function(elapsedTime) {
			elapsedTime += increment;
			var position = scrollHelper.easeInOut(elapsedTime, start, change, duration);
			window.scrollTo(0, position);
			if (elapsedTime < duration) {
				setTimeout(function() {
					animateScroll(elapsedTime);
				}, increment);
			}
		};

		animateScroll(0);
	}
};

var _s = function(selector, context) {
	var d = context || document;
	return Array.apply(null, d.querySelectorAll(selector));
};

var _si = function(selector, context, returnNull) {
	var d = context || document;
	var tmp = d.querySelector(selector);
	return tmp ? tmp : returnNull ? null : document.createElement('div');
};

var _ael = function(selector, ev, callback) {
	var elm = typeof selector === 'string' ? _si(selector) : selector;
	elm.addEventListener(ev, callback);
};

var _ajax = function(url, callback) {
	var request = new XMLHttpRequest();
	request.open('GET', url, true);

	request.onload = function() {
		if (request.status >= 200 && request.status < 400) {
			if (typeof callback === 'function') {
				callback(request);
			}
		} else {
			console.error('request error', request);
		}
	};

	request.onerror = function(err) {
		console.error('error', err);
	};

	request.send();
};

var loadJSONP = (function(){
	var unique = 0;
	return function(url, callback, context) {
		// INIT
		var name = "_jsonp_" + unique++;
		if (url.match(/\?/)) url += "&callback="+name;
		else url += "?callback="+name;

		// Create script
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = url;

		// Setup handler
		window[name] = function(data){
			callback.call((context || window), data);
			document.getElementsByTagName('head')[0].removeChild(script);
			script = null;
			delete window[name];
		};

		// Load JSON
		document.getElementsByTagName('head')[0].appendChild(script);
	};
})();

(function() {
	'use strict';

	var html = _si('html'),
		scrollTop = window.pageYOffset,
		oldScrollTop = 0,
		sections = _s('[data-link-url]'),
		sectionTops = [],
		phoneMenu = window.innerWidth < 635,
		menuHeight = phoneMenu ? 0 : 70,
		sizes = {
			showMenu: 635
		},
		window_width = window.innerWidth,
		logo = _si('.logo'),
		logoTop = logo.getBoundingClientRect().top + scrollTop;

	function render() {
		if (scrollTop !== oldScrollTop) {
			if (sectionTops.length === 0) {
				sections.forEach(function(s) {
					sectionTops.push(s.getBoundingClientRect().top + scrollTop - menuHeight);
				});
			}
			if (scrollTop > logoTop + 20) {
				html.classList.add('toggle--logo-in-menu');
			} else {
				html.classList.remove('toggle--logo-in-menu');
			}

			for (var i = sectionTops.length; i--;) {
				if (scrollTop > sectionTops[i]) {
					var li = _s('nav li')[i];
					if (!li.classList.contains('active')) {
						_si('nav li.active').classList.remove('active');
						li.classList.add('active');
						var url = _si('a', li).href;
						url = url.substr(url.indexOf('#'));
						location.hash = url;
					}
					break;
				}
			}
			oldScrollTop = scrollTop;
		}

		requestAnimationFrame(render);
	}

	if (window_width >= sizes.showMenu) {
		render();
	}

	_ael(document, 'scroll', function(e) {
		scrollTop = window.pageYOffset;
	});

	_ael('.menu_toggle', 'click', function() {
		html.classList.toggle('show--menu');
	});

	_ael('nav', 'click', function(e) {
		var li = e.target.closest('li');
		if (li) {
			var url = _si('a', li).href;
			url = url.substr(url.indexOf('#') + 1);
			var section = _si('[data-link-url="' + url + '"]');
			scrollHelper.scrollTo(section.getBoundingClientRect().top + scrollTop + 1, 300);
			html.classList.remove('show--menu');
		}
	});

	_ael('.logo', 'click', function(e) {
		scrollHelper.scrollTo(0, 300);
	});

	if (location.hash.length > 2) {
		_si('nav a[href*="' + location.hash + '"]').click();
	}

	loadJSONP('https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=00622ccfe6e4d518ca49b0b5105abb54&per_page=20&user_id=trondheimdc&tags=Approved&page=2&extras=o_dims&format=json');

	html.classList.remove('no-js');
	if ('ontouchstart' in document) {
		html.classList.add('touch');
	} else {
		html.classList.add('no-touch');
	}

})();

var firstPhotoWallLoaded = false;
function jsonFlickrApi(data) {
	var html = '';
	counter = 0;
	data.photos.photo.forEach(function(photo) {
		if (counter > 8 || photo.o_height - 0 > photo.o_width - 0) { return; }
		var url = 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_c.jpg';
		html += '<li><img src="data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20viewBox%3D%270%200%20400%20267%27%2F%3E" data-src="' + url + '" class="lazyload"></li>';
		counter++;
	});
	if (firstPhotoWallLoaded) {
		_s('.block--photos ul')[1].innerHTML = html;
	} else {
		firstPhotoWallLoaded = true;
		_s('.block--photos ul')[0].innerHTML = html;
		loadJSONP('https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=00622ccfe6e4d518ca49b0b5105abb54&per_page=20&user_id=trondheimdc&tags=developer&page=2&extras=o_dims&format=json');
	}
}
