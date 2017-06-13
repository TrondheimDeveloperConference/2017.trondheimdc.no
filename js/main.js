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
				requestAnimationFrame(function() {
					animateScroll(elapsedTime);
				});
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

	request.setRequestHeader('Access-Control-Allow-Origin', '*');
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

	_ael('.block--conduct .toggle-extra', 'click', function(e) {
		e.preventDefault();
		this.closest('.block').classList.toggle('open');
	});

	/* real ajax */
	_ajax('https://api.trondheimdc.no/events/tdc2017/sessions', function(data) {
		console.log(data);
	});/* */
	//fake ajax
	function loadSpeakers() {
		var data = [{"tittel":"Getting started with Java 9 modules","format":"presentation","starter":null,"stopper":null,"foredragsholdere":[{"navn":"Rafael Winterhalter","bildeUri":"https://secure.gravatar.com/avatar/bc96521f79789d75fa63cfa5c2758765"}],"sprak":"en","niva":"beginner","links":[{"rel":"detaljer","href":"https://api.trondheimdc.no/events/tdc2017/sessions/1244e93a57721890bd26a3a5f431064fb82f9d630da04b1fa077c0aeeaf47908"},{"rel":"feedback","href":"https://api.trondheimdc.no/devnull/server/events/1f876502-d3c3-44f6-8ea3-a4d0e16331dd/sessions/46f0e0fa-d811-44d1-9509-b5eebd46e02d/feedbacks"}],"rom":null,"nokkelord":["Java 9","topic:Backend","type:"]},{"tittel":"In a Nutshell: Immutable Objects in Java","format":"presentation","starter":null,"stopper":null,"foredragsholdere":[{"navn":"Marcus Biel","bildeUri":"https://secure.gravatar.com/avatar/5fada8ab2d8d053004959c1a3dc68a31"}],"sprak":"en","niva":"intermediate","links":[{"rel":"detaljer","href":"https://api.trondheimdc.no/events/tdc2017/sessions/9c220848089a278bc21682629bfac8545d90d47723616a6c70d491a5681e073c"},{"rel":"feedback","href":"https://api.trondheimdc.no/devnull/server/events/1f876502-d3c3-44f6-8ea3-a4d0e16331dd/sessions/0c1835aa-ee0c-431a-8b99-76279f2d0763/feedbacks"}],"rom":null,"nokkelord":["Paradigms","topic:Concepts / Theory","type:"]}];

		var tmpl = '<li>'+
						'<img src="{img}">'+
						'<h5>{name}</h5>'+
						'<p>{title}</p>'+
					'</li>';
		var fallbackImg = '//placehold.it/360x240/117fe8/fff';
		var listHtml = '';
		data.forEach(function(sessh) {
			var img = sessh.foredragsholdere[0].bildeUri || fallbackImg;
			var name = sessh.foredragsholdere[0].navn;
			var title = sessh.tittel;
			listHtml += tmpl.replace('{img}', img).replace('{name}', name).replace('{title}', title);
		});

		_si('.block--speakers ul').innerHTML = listHtml;
	}
	loadSpeakers();

	loadJSONP('https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=00622ccfe6e4d518ca49b0b5105abb54&per_page=20&user_id=trondheimdc&tags=Approved&page=2&extras=o_dims&format=json');

	function Mouse(element, callback) {
		this.callback = callback;
		this.element = element;
		this.handler = this.handler.bind(this);
		this.L = this.M = this.R = this.X = this.Y = 0;
		element.addEventListener('contextmenu', this.handler);
		element.addEventListener('mousedown', this.handler);
		window.addEventListener('mouseup', this.handler);
		window.addEventListener('mousemove', this.handler);
	}

	Mouse.prototype.map = { 0: 'L', 1: 'M', 2: 'R' };

	Mouse.prototype.handler = function(e) {
		var b = this.element.getBoundingClientRect();
		this.X = e.clientX - b.left;
		this.Y = e.clientY - b.top;
		switch(e.type) {
			case 'contextmenu': e.preventDefault(); break;
			case 'mousedown': this[this.map[e.button]] = 1; break;
			case 'mouseup': this[this.map[e.button]] = 0; break;
		}
		this.callback && this.callback(e);
	};

	function Particle(field, x, y) {
		this.field = field;
		this.l = vec4.get(x, y);
		this.p = vec4.get(x, y);
		this.v = vec4.get();
	}

	Particle.prototype.reset = function(x, y) {
		if(x == null || y == null) if(Math.random() < 0.5) {
			x = this.field.width  * (Math.random());
			y = this.field.height * (Math.random() + 0.5 | 0);
		} else {
			x = this.field.width  * (Math.random() + 0.5 | 0);
			y = this.field.height * (Math.random());
		}

		vec4.set(this.l, x, y);
		vec4.set(this.p, x, y);
		vec4.set(this.v);
	};

	Particle.prototype.outOfBounds = function() {
		return this.p[0] < 0 || this.p[0] > this.field.width
			|| this.p[1] < 0 || this.p[1] > this.field.height;
	};

	Particle.prototype.update = function() {
		if(this.outOfBounds()) return;

		var x = 0.00550 * this.p[0];
		var y = 0.00550 * this.p[1];
		var z = 0.0001 * this.field.now;
		var r = Math.random() * 0.5;
		var t = Math.random() * Math.PI * 2;

		vec4.set(vec4.buffer,
			r * Math.sin(t) + this.field.simplex.noise3D(x, y, +z),
			r * Math.cos(t) + this.field.simplex.noise3D(x, y, -z)
		);
		vec4.add(this.v, vec4.buffer, this.v);

		if(this.field.mouse.L) {
			vec4.set(vec4.buffer, this.field.mouse.X, this.field.mouse.Y);
			vec4.sub(vec4.buffer, this.p, vec4.buffer);
			vec4.mul(vec4.buffer, 0.0010, vec4.buffer);
			vec4.add(this.v, vec4.buffer, this.v);
		}

		vec4.mul(this.v * 0.5, 0.9500, this.v * 0.5);
		vec4.set(this.l, this.p, this.l);
		vec4.add(this.p, this.v, this.p);

		return true;
	};

	function Field(container) {
		this.loop      = this.loop.bind(this);
		this.canvas    = util.tag('canvas', null, container);
		this.info      = util.tag('code',   null, container);
		this.context   = this.canvas.getContext('2d');
		this.mouse     = new Mouse(this.canvas);
		this.simplex   = new SimplexNoise();
		this.particles = [];
		this.loop();
	}

	Field.prototype.spawn = function() {
		for(var i = 1e4 - this.particles.length; i--;)
			this.particles.push(new Particle(this));
	};

	Field.prototype.resize = function() {
		var w = this.canvas.clientWidth;
		var h = this.canvas.clientHeight;
		if(this.canvas.width  !== w
		|| this.canvas.height !== h) {
			this.width  = this.canvas.width  = w;
			this.height = this.canvas.height = h;
			this.clear();
		}
	};

	Field.prototype.clear = function() {
		this.context.fillStyle = util.color.rgba(1, 1, 1);
		this.context.fillRect(0, 0, this.width, this.height);
	};

	Field.prototype.render = function() {
		this.context.beginPath();

		for(var p, i = 0; p = this.particles[i++];) if(p.update()) {
			this.context.moveTo(p.l[0], p.l[1]);
			this.context.lineTo(p.p[0], p.p[1]);
		} else p.reset(); // this.particles.splice(--i, 1);

		this.context.globalCompositeOperation = 'lighter';
		this.context.strokeStyle = util.color.rgba(0.61, 0.76, 0.10, 0.25);
		this.context.stroke();

		this.context.globalCompositeOperation = 'source-over';
		this.context.fillStyle = util.color.rgba(0, 0, 0, 0.05);
		this.context.fillRect(0, 0, this.width, this.height);
	};

	Field.prototype.update = function() {
		this.info.textContent = util.fps(true);
		this.now = Date.now();
		this.resize();
		this.spawn();
		this.render();
	};

	Field.prototype.loop = function() {
		requestAnimationFrame(this.loop);
		this.update();
	};

	window.addEventListener('load', function () {
		new Field(document.body);
	}, false);

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
		//loadJSONP('https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=00622ccfe6e4d518ca49b0b5105abb54&per_page=20&user_id=trondheimdc&tags=developer&page=2&extras=o_dims&format=json');
	}
}
