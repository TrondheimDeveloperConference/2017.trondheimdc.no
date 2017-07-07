import SimplexNoise from 'simplex-noise';
import vec4 from './vendor/vec4';
import util from './vendor/util';

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
    let oldScrollTop = 0;
    let scrollTop = window.pageYOffset;
    let lowFpsCount = 0;
    const html = _si('html'),
        sections = _s('[data-link-url]'),
        sectionTops = [],
        phoneMenu = window.innerWidth < 635,
        menuHeight = phoneMenu ? 0 : 70,
        sizes = {
            showMenu: 635
        },
        window_width = window.innerWidth,
        logo = _si('.logo'),
        logoTop = logo.getBoundingClientRect().top + scrollTop,
        startup = Date.now();

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

    const fakeSpeakers = [
        {
            "tittel": "",
            "foredragsholdere": [
                {
                    "navn": "Martha Eike",
                    "bildeUri": "https://static.trondheimdc.no/2017/Martha_Eike-Portrett.jpg"
                }
            ]
        }, {
            "tittel": "",
            "foredragsholdere": [
                {
                    "navn": "Tarjei Vassbotn Sigve Tjora",
                    "bildeUri": "https://static.trondheimdc.no/2017/tarjei-vassbotn.jpg"
                }
            ]
        }, {
            "tittel": "",
            "foredragsholdere": [
                {
                    "navn": "Brian Christian",
                    "bildeUri": "https://static.trondheimdc.no/2017/brian-christian.jpg"
                }
            ]
        }, {
            "tittel": "",
            "foredragsholdere": [
                {
                    "navn": "Preethi Kasireddy",
                    "bildeUri": "https://static.trondheimdc.no/2017/Preethi_Kasireddy.jpg"
                }
            ]
        }, {
            "tittel": "",
            "foredragsholdere": [
                {
                    "navn": "Jonas Follesø",
                    "bildeUri": "https://static.trondheimdc.no/2017/Jonas_Folleso.jpg"
                }
            ]
        }, {
            "tittel": "",
            "foredragsholdere": [
                {
                    "navn": "Erik Engheim",
                    "bildeUri": "https://static.trondheimdc.no/2017/Erik_Engheim.jpg"
                }
            ]
        }, {
            "tittel": "",
            "foredragsholdere": [
                {
                    "navn": "Robert Virding",
                    "bildeUri": "https://static.trondheimdc.no/2017/Robert_Virding.jpg"
                }
            ]
        }
    ];

    _ajax('https://api.trondheimdc.no/events/tdc2017/sessions', function(data) {
        const speakers = JSON.parse(data.responseText)
            .concat(fakeSpeakers)
            .reduce((acc, curr) => acc.concat(curr.foredragsholdere), []);
        loadSpeakers(speakers);
    });

    function addSizeParam(imageUrl) {
        const param = imageUrl.includes('gravatar') ? '?s=240&d=retro' : '?size=240';
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
                            <h5>${name}</h5>
                        </div>
					</li>`;
        }, '');
    }

    loadJSONP('https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=00622ccfe6e4d518ca49b0b5105abb54&per_page=20&user_id=trondheimdc&tags=Approved&page=2&extras=o_dims&format=json');

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
        if (window_width > 600) {
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
