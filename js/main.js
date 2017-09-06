import SimplexNoise from 'simplex-noise';
import vec4 from './vendor/vec4';
import util from './vendor/util';

import lazysizes from 'lazysizes';

const scrollHelper = {
	easeInOut: function(currentTime, start, change, duration) {
		currentTime /= duration / 2;
		if (currentTime < 1) {
			return change / 2 * currentTime * currentTime + start;
		}
		currentTime -= 1;
		return -change / 2 * (currentTime * (currentTime - 2) - 1) + start;
	},

	scrollTo: function(to, duration) {
		const start = window.pageYOffset,
			change = to - start,
			increment = 20;

		if (duration === 0) {
			window.scrollTo(0, to);
			return;
		}

		const animateScroll = function(elapsedTime) {
			elapsedTime += increment;
			const position = scrollHelper.easeInOut(elapsedTime, start, change, duration);
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

String.prototype.allReplace = function(obj) {
	var retStr = this;
	for (var x in obj) {
		retStr = retStr.replace(new RegExp(x, 'g'), obj[x]);
	}
	return retStr;
};

const _s = function(selector, context) {
	const d = context || document;
	return Array.apply(null, d.querySelectorAll(selector));
};

const _si = function(selector, context, returnNull) {
	const d = context || document;
	const tmp = d.querySelector(selector);
	return tmp ? tmp : returnNull ? null : document.createElement('div');
};

const _ael = function(selector, ev, callback) {
	const elm = typeof selector === 'string' ? _si(selector) : selector;
	elm.addEventListener(ev, callback);
};

const _ajax = function(url, callback) {
	const request = new XMLHttpRequest();
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

const loadJSONP = (function(){
	let unique = 0;
	return function(url, callback, context) {
		// INIT
		const name = "_jsonp_" + unique++;
		if (url.match(/\?/)) url += "&callback="+name;
		else url += "?callback="+name;

		// Create script
		let script = document.createElement('script');
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
	let oldScrollTop = 0,
		scrollTop = window.pageYOffset,
		lowFpsCount = 0,
		stupidWordContainers = [],
		currentStupidWords = [],
		stupidWordTimeouts = [],
		modalIsOpen = false;
	const html = _si('html'),
		sections = _s('[data-link-url]'),
		sectionTops = [],
		phoneMenu = window.innerWidth < 635,
		menuHeight = phoneMenu ? 0 : 70,
		sizes = {
			showMenu: 635
		},
		window_width = window.innerWidth,
		window_height = window.innerHeight,
		logo = _si('.logo'),
		logoTop = window.isMainPage ? logo.getBoundingClientRect().top + scrollTop : 0,
		startup = Date.now(),
		speakerCard = _si('.speakerCard'),
		stupidWords = [
			'cat',
			'bench',
			'hat',
			'cod',
			'cabin',
			'werewolf',
			"thing",
			"grail",
			"business",
			"point",
			"thread",
			"token",
			"trifle",
			"trivia",
			"triviality",
			"terra firma",
			"part",
			"wall",
			"peculiarity",
			"vehicle",
			"portion",
			"vagabond",
			"prop",
			"property",
			"rarity",
			"relic",
			"ribbon",
			"shiner",
			"small beer",
			"snake",
			"soil",
			"souvenir",
			"unit",
			"charm",
			"commemorative",
			"curiosity",
			"filler",
			"film",
			"finding",
			"floater",
			"fomite",
			"formation",
			"geological formation",
			"good luck charm",
			"ground",
			"growth",
			"hail",
			"head",
			"hoodoo",
			"keepsake",
			"land",
			"location",
			"lot",
			"whole",
			"makeweight",
			"web",
			"moon",
			"neighbor",
			"neighbour",
			"catch",
			"paring",
			"chicane",
			"carp",
			"challenge",
			"remonstrate",
			"cavil",
			"demur",
			"mind",
			"prepositional object",
			"direct object",
			"retained object",
			"passion",
			"love",
			"centre of attention",
			"hallucination",
			"center",
			"hobgoblin",
			"centre",
			"bugbear"];

	function render() {
		if (!window.isMainPage) { return; }
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

			let lis = _s('nav li');
			for (let i = sectionTops.length; i--;) {
				if (scrollTop > sectionTops[i]) {
					let li = lis[i];
					if (li && !li.classList.contains('active')) {
						_si('nav li.active').classList.remove('active');
						li.classList.add('active');
						let url = _si('a', li).href;
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

	if (location.hash.length > 2 && location.hash.indexOf('favs=') !== -1) {
		let favs = location.hash.substr(location.hash.indexOf('favs=') + 5);
		favs.split('|').forEach(id => {
			localStorage.setItem('fav-' + id, true);
		});
	}

	_ael(document, 'scroll', function(e) {
		scrollTop = window.pageYOffset;
	});

	_ael('.menu_toggle', 'click', function() {
		html.classList.toggle('show--menu');
	});

	_ael('nav', 'click', function(e) {
		let li = e.target.closest('li');
		if (li) {
			let url = _si('a', li).href;
			url = url.substr(url.indexOf('#') + 1);
			let section = _si('[data-link-url="' + url + '"]');
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


	function getRandom(arr, n) {
		var result = new Array(n),
			len = arr.length,
			taken = new Array(len);

		if (n > len) { throw new RangeError("getRandom: more elements taken than available"); }

		while (n--) {
			var x = Math.floor(Math.random() * len);
			result[n] = arr[x in taken ? taken[x] : x];
			taken[x] = --len;
		}
		return result;
	}

	_ajax('https://api.trondheimdc.no/events/tdc2017/sessions', function(data) {
		const sessions = JSON.parse(data.responseText);
		if (window.location.href.indexOf('workshops') !== -1) {
			loadWorkshops(sessions);
		} else if (location.href.indexOf('program') !== -1) {
			loadProgram(sessions);
		} else {
			const speakers = sessions
				.reduce((acc, curr) => {
					const names = acc.map(f => f.navn);
					let tmp = curr.foredragsholdere.filter(f => names.indexOf(f.navn) === -1);
					tmp.forEach((s) => {
						s.tittel = curr.tittel;
					});
					return acc.concat(curr.foredragsholdere
						.filter(f => names.indexOf(f.navn) === -1));
				}, []);
			loadSpeakers(getRandom(speakers, 10));
		}
	});

	function addSizeParam(imageUrl) {
		const param = imageUrl.indexOf('gravatar') !== -1 ? '?s=240&d=retro' : '?size=240';
		return `${imageUrl}${param}`.replace('http:', 'https:');
	}

	function loadSpeakers(speakers) {
		const fallbackImg = '//placehold.it/360x240/117fe8/fff';
		_si('.block--speakers ul').innerHTML = speakers.reduce((acc, speaker) => {
			const img = speaker.bildeUri || fallbackImg;
			const name = speaker.navn;

			return `${acc}
					<li>
						<img src="${addSizeParam(img)}">
						<div>
							<h5>${speaker.navn}</h5>
							<h6>${speaker.tittel}</h6>
						</div>
					</li>`;
		}, '');
	}

	function cleanTitle(title) {
		return title.replace('#', '')
			.replace(' ', '')
			.substr(0, 10)
	}

	function loadWorkshops(sessions){
		const workshops = sessions.filter(p => p.format === 'workshop');
		_si('#workshopsdetails').outerHTML = workshops
			.reduce((acc, workshop) => {
				const green = acc.length === 0 ? '' : 'green';

				return `${acc}
					<a name="${cleanTitle(workshop.tittel)}"/>
					<section class="block block--workshopsinfo ${green}" data-workshopid="${workshop.tittel}">
						<div class="text-content">
							<h4>${workshop.tittel}</h4>
							<div id="${cleanTitle(workshop.tittel)}beskrivelse"></div>
						</div>
					</section>`;
			}, '');

		workshops.forEach(workshop => {
			const detaljer = workshop.links.find(l => l.rel === 'detaljer').href;
			_ajax(detaljer, function(data) {
				const workshopDetaljer = JSON.parse(data.responseText);
				const {tittel, beskrivelse} = workshopDetaljer;
				const foredragholder = workshopDetaljer.foredragsholdere[0];
				_si(`#${cleanTitle(tittel)}beskrivelse`).innerHTML = `<p>${beskrivelse.replace(/\n+/g, '<br/>')}</p>
				<div class="foredragsholder">
					<h4>${foredragholder.navn}</h4>
					<p>${foredragholder.bio}</p>
				</div> `;
			});
		});

	}

	function writeStupidWord(pos, which) {
		if (stupidWordContainers.length === 0) { return; }

		if (pos === 0) {
			let newWord = '';
			do {
				newWord = stupidWords[Math.floor(Math.random() * stupidWords.length)];
			} while (newWord === currentStupidWords[which]);
			currentStupidWords[which] = newWord;
		}

		if (pos > currentStupidWords[which].length) {
			stupidWordContainers[which].innerHTML = currentStupidWords[which] + '?';
			pos = -1;
		} else {
			stupidWordContainers[which].innerHTML = currentStupidWords[which].substr(0, pos);
		}

		const howLong = pos < currentStupidWords[which].length ? Math.random() * 200 + 200 : 3000

		stupidWordTimeouts[which] = setTimeout(function() {
			writeStupidWord(pos + 1, which);
		}, howLong);
	}

	function loadProgram(sessions) {
		let slots = [],
			slotTimes = [];
		sessions.forEach(sesh => {
			if (sesh.format === 'workshop') { return; }
			const start = new Date(sesh.starter);
			let h = start.getHours();
			h = (h < 10 ? '0' : '') + h;
			let m = start.getMinutes();
			m = (m < 10 ? '0' : '') + m;
			const format = h + ':' + m;
			if (!slots[format]) {
				slots[format] = [];
				slotTimes.push(format);
			}
			slots[format].push(sesh);
		});
		//breaks
		slotTimes.push('10:45');
		slotTimes.push('12:15');
		slotTimes.push('15:30');
		slotTimes.push('18:15');

		slotTimes.sort();
		let content = '<section class="roomsColumns">';
		for (let i = 1; i < 6; i++) { content += `<div>Sal <span>${i}</span></div>`; }
		content += '</section>';
		slotTimes.forEach(time => {
			if (!slots[time]) {
				const isLunch = time === '12:15';
				const isParty = time === '18:15';
				const type = isLunch ? 'lunch' : isParty ? 'party' : 'refreshments';
				const extra = isLunch ? ' title="<b>BartJS Podcast Live</b>"' : isParty ? ' style="content: \'<b>free</b>\';"' : '';
				content += `<section class="break ${type}">&lt;br class="<b>${type}</b>" data-time="<b>${time}</b>"${extra}&gt;</section>`
				return;
			}
			if (slots[time].length < 5) {
				let roomCheck = [false, false, false, false, false];
				slots[time].forEach(sesh => {
					const rom = sesh.rom.replace('Sal ', '');
					roomCheck[rom-1] = true;
				});

				for (let i = 0; i < 5; i++) {
					if (!roomCheck[i]) {
						slots[time].push({
							rom: 'Sal ' + (i + 1),
							format: 'fake'
						});
					}
				}
			}

			slots[time].sort((a, b) => {
				return a.rom.replace('Sal ', '') - b.rom.replace('Sal ', '');
			});

			content += `<section class="slot ${time}" data-time="${time}">`;
			slots[time].forEach(sesh => {
				const rom = sesh.rom.replace('Sal ', '');
				if (sesh.format === 'fake') {
					content += `<div class="sesh fake"></div>`
				} else {
					const names = sesh.foredragsholdere.reduce((acc, person) => {
						return acc + (acc ? ' & ' : '') + `<span>${person.navn}</span>`;
					}, '');

					const id = time + '-' + rom,
						fav = localStorage.getItem("fav-" + id) === 'true',
						url = sesh.links.length ? sesh.links[0].href : '';
					content += `<div class="sesh${fav ? ' is-fav' : ''}" data-id=${id}>
									<aside>
										<time>${time}</time>
										<span class="room"><span>Sal</span> ${rom}</span>
									</aside>
									<section data-href="${url}">
										<h4>${sesh.tittel}</h4>
										<h5>${names}</h5>
									</section>
									<div class="fav-toggle">
										<div>
											fav
											<span class="yes">y</span>/<span class="no">n</span>
										</div>
									</div>
								</div>`;
				}
			});
			content += '</section>';
		});

		_si('.block--program').innerHTML = content;

		document.addEventListener('click', e => {
			var that = e.target.closest('.sesh section');
			if (that) {
				speakerCard.style.display = 'none';
				speakerCard.classList.remove('show');
				const url = that.getAttribute('data-href');
				if (!url) { return; }
				const box = that.getBoundingClientRect();
				const isFav = that.parentNode.classList.contains('is-fav');
				const id = that.parentNode.getAttribute('data-id');
				_ajax(url, data => {
					const sesh = JSON.parse(data.responseText);
					const names = sesh.foredragsholdere.reduce((acc, person) => {
						return acc + (acc ? ' & ' : '') + `<span>${person.navn}</span>`;
					}, '');
					const rom = sesh.rom.replace('Sal ', 'Sal <span>') + '</span>';
					const realTime = new Date(sesh.starter);
					const date = sesh.starter.substr(0, sesh.starter.indexOf('T') + 1);
					let tid = sesh.starter;
					tid = tid.substr(tid.indexOf('T') + 3, 6);
					tid = (realTime.getHours() < 10 ? '0' : '') + realTime.getHours() + tid;
					tid = date + `<span>${tid}</span>`;

					let speakerContent = '';
					let speakerAbout = '';
					sesh.foredragsholdere.forEach(speaker => {
						const hover = speaker.navn.allReplace({'æ': 'a', 'å': 'a', 'ø': 'o', ' ': '-', '[\.]': ''}).toLowerCase();
						const addName = sesh.foredragsholdere.length > 1 ? `<strong class="name">${speaker.navn}</strong>` : '';
						speakerContent += `<figure>
							<img src="${addSizeParam(speaker.bildeUri)}">
							<div class="deepdream"><img src="/img/deep/${hover}.jpg"></div>
							<figcaption>${addName}<strong>Image description</strong>This looks like a ... <span></span></figcaption>
						</figure>`;

						speakerAbout += `<strong>About ${speaker.navn}</strong>
						<p>${speaker.bio}</p>`;
					});

					let content =
						`<span class="close">close</span>
						<article class="speakers-${sesh.foredragsholdere.length}">
							<div class="fake">
								${that.innerHTML}
							</div>
							<header>
								<h2>${sesh.tittel}</h2>
								<div>
									<hgroup>
										<dl>
											<dt>Name:</dt>
											<dd class="name">${names}</dd>
											<dt>Time:</dt>
											<dd>${tid}</dd>
											<dt>Room:</dt>
											<dd>${rom}</dd>
											<dt>Favourite</dt>
											<dd><a class="fav-toggle"><span class="yes">y</span>/<span class="no">n</span></a></dd>
										</dl>
									</hgroup>
									${speakerContent}
								</div>
							</header>
							<section>
								<strong>Talk:</strong>
								<p>${sesh.beskrivelse}</p>
								<strong>Audience</strong>
								<p>${sesh.tiltenktPublikum}</p>
								${speakerAbout}
							</section>
						</article>`;


					if (isFav) {
						speakerCard.classList.add('is-fav');
					} else {
						speakerCard.classList.remove('is-fav');
					}
					speakerCard.style.width = box.width + 'px';
					speakerCard.style.left = box.left + 'px';
					speakerCard.style.top = (box.top + scrollTop) + 'px';
					speakerCard.style.height = box.height + 'px';
					speakerCard.innerHTML = content;
					speakerCard.style.display = 'block';
					speakerCard.setAttribute('data-id', that.parentNode.getAttribute('data-id'));
					html.classList.add('show--speakerCard');
					location.hash = id;
					modalIsOpen = true;
					setTimeout(() => {
						speakerCard.classList.add('show');
						const width = Math.min(window_width * 0.8, 700);
						speakerCard.style.top = (window_height * 0.1 + scrollTop) + 'px';
						speakerCard.style.height = (window_height * 0.8) + 'px';
						speakerCard.style.left = ((window_width - width) / 2) + 'px';
						speakerCard.style.width = width + 'px';
					}, 50);
					stupidWordTimeouts[0] = setTimeout(() => {
						stupidWordContainers.push(_si('.speakerCard figcaption span'));
						writeStupidWord(0, 0);
						if (sesh.foredragsholdere.length > 1) {
							stupidWordTimeouts[1] = setTimeout(() => {
								stupidWordContainers.push(_si('.speakerCard figure:nth-child(3) figcaption span'));
								writeStupidWord(0, 1);
							}, 1);
						}
					}, 6000);
				});
			}
		});

		if (location.hash.length > 2) {
			const id = location.hash.replace('#', '');
			const sesh = _si('.sesh[data-id="' + id + '"] section', document, true);
			if (sesh) {
				sesh.click();
			}
		}

		document.addEventListener('click', e => {
			var that = e.target.closest('.speakerCard .close');
			if (that) {
				speakerCard.style.opacity = 0;
				stupidWordContainers = [];
				clearTimeout(stupidWordTimeouts[0]);
				clearTimeout(stupidWordTimeouts[1]);
				modalIsOpen = false;
				//TODO: Check if this works

				setTimeout(() => {
					speakerCard.removeAttribute('style');
					html.classList.remove('show--speakerCard');
					speakerCard.classList.remove('show');
					location.hash = "#!";
				}, 400);
			}
		});

		document.addEventListener('click', e => {
			if (modalIsOpen && !e.target.closest('.speakerCard')) {
				_si('.close', speakerCard).click();
			}
		});

		document.addEventListener('click', e => {
			var that = e.target.closest('.fav-toggle');
			if (that) {
				let sesh = that.closest('.sesh'),
					id = '',
					inModal = false;
				if (!sesh) {
					sesh = that.closest('.speakerCard');
					inModal = true;
				}
				id = sesh.getAttribute('data-id');
				sesh.classList.toggle('is-fav');
				localStorage.setItem("fav-" + id, sesh.classList.contains('is-fav'));

				ga('send', 'event', 'fav', _si('h4', sesh).innerText, sesh.classList.contains('is-fav') ? 'on' : 'off');

				if (inModal) {
					_si('.sesh[data-id="' + id + '"]').classList.toggle('is-fav');
				}
			}
		});

		document.addEventListener('keydown', e => {
			if (e.keyCode === 27 && modalIsOpen) {
				_si('.close', speakerCard).click();
			}
		});

		var clipboard = new Clipboard('.exp-fav', {
			text: function() {
				let ids = [];
				_s('.sesh.is-fav').forEach(elm => {
					ids.push(elm.getAttribute('data-id'));
				});
				return location.origin + location.pathname + '#favs=' + ids.join('|');
			}
		});

		clipboard.on('success', function(e) {
			_si('.exp-success').style.display = 'block';
		});

		clipboard.on('error', function(e) {
			console.error('clipboard failed', e);
			let ids = [];
			_s('.sesh.is-fav').forEach(elm => {
				ids.push(elm.getAttribute('data-id'));
			});
			prompt('Here, copy this URL', location.href + '#favs=' + ids.join('|'));
		});
	}

	if(window.isMainPage) {
		loadJSONP('https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=00622ccfe6e4d518ca49b0b5105abb54&per_page=20&user_id=trondheimdc&tags=Approved&page=2&extras=o_dims&format=json');
	}

	function Mouse(element, callback) {
		this.callback = callback;
		this.element = element;
		this.handler = this.handler.bind(this);
		this.L = this.M = this.R = this.X = this.Y = 0;
		window.addEventListener('mousedown', this.handler);
		window.addEventListener('mouseup', this.handler);
		window.addEventListener('mousemove', this.handler);
	}

	Mouse.prototype.map = { 0: 'L', 1: 'M', 2: 'R' };

	Mouse.prototype.handler = function(e) {
		const b = this.element.getBoundingClientRect();
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

		const x = 0.00550 * this.p[0];
		const y = 0.00550 * this.p[1];
		const z = 0.0001 * this.field.now;
		const r = Math.random() * 0.5;
		const t = Math.random() * Math.PI * 2;

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
		for(let i = Math.round(1e4 / 1.5) - this.particles.length; i--;)
			this.particles.push(new Particle(this));
	};

	Field.prototype.resize = function() {
		const w = this.canvas.clientWidth;
		const h = this.canvas.clientHeight;
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

		for(let p, i = 0; p = this.particles[i++];) if(p.update()) {
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
		this.resize();
		this.spawn();
		this.render();
	};

	Field.prototype.loop = function() {
		this.now = Date.now();
		if (this.now - startup < 5000) {
			let fps = util.fps(true);
			if (fps < 20) {
				lowFpsCount++;
				if (lowFpsCount > 60) {
					html.classList.add('lowfps');
					setTimeout(function() {
						document.body.removeChild(_si('canvas'));
					}, 500);
					return;
				}
			} else {
				lowFpsCount = 0;
			}
		}
		requestAnimationFrame(this.loop);
		this.update();
	};

	window.addEventListener('load', function () {
		if (window_width > 600 && location.href.indexOf('program') === -1) {
			new Field(document.body);
		}
	}, false);

	html.classList.remove('no-js');
	if ('ontouchstart' in document) {
		html.classList.add('touch');
	} else {
		html.classList.add('no-touch');
	}

})();
