const vec4 = {};

vec4.array = Float32Array || Array;
vec4.buffer = new vec4.array(4);

vec4.get = function (a, b, c, d) {
    return vec4.set(new vec4.array(4), a, b, c, d);
};

vec4.set = function (out, a, b, c, d) {
    if(!out) out = new vec4.array(4);
    if(typeof a === 'object') {
        out[0] = -Infinity < a[0] && a[0] < Infinity ? a[0] : 0;
        out[1] = -Infinity < a[1] && a[1] < Infinity ? a[1] : 0;
        out[2] = -Infinity < a[2] && a[2] < Infinity ? a[2] : 0;
        out[3] = -Infinity < a[3] && a[3] < Infinity ? a[3] : 1;
    } else {
        out[0] = -Infinity < a && a < Infinity ? a : 0;
        out[1] = -Infinity < b && b < Infinity ? b : 0;
        out[2] = -Infinity < c && c < Infinity ? c : 0;
        out[3] = -Infinity < d && d < Infinity ? d : 1;
    }
    return out;
};

vec4.equals = function (a, b) {
    if(a === b) return true;
    return typeof b === 'object'
        ? a[0] === b[0] && a[1] === b[1] && a[2] === b[2]
        : a[0] ===    b && a[1] ===    b && a[2] ===    b;
};

vec4.add = function (a, b, out) {
    if(!out) out = new vec4.array(4);
    if(typeof b === 'object') {
        out[0] = a[0] + b[0];
        out[1] = a[1] + b[1];
        out[2] = a[2] + b[2];
    } else {
        out[0] = a[0] + b;
        out[1] = a[1] + b;
        out[2] = a[2] + b;
    }
    return out[3] = a[3], out;
};

vec4.sub = function (a, b, out) {
    if(!out) out = new vec4.array(4);
    if(typeof b === 'object') {
        out[0] = a[0] - b[0];
        out[1] = a[1] - b[1];
        out[2] = a[2] - b[2];
    } else {
        out[0] = a[0] - b;
        out[1] = a[1] - b;
        out[2] = a[2] - b;
    }
    return out[3] = a[3], out;
};

vec4.mul = function (a, b, out) {
    if(!out) out = new vec4.array(4);
    if(typeof b === 'object') {
        out[0] = a[0] * b[0];
        out[1] = a[1] * b[1];
        out[2] = a[2] * b[2];
    } else {
        out[0] = a[0] * b;
        out[1] = a[1] * b;
        out[2] = a[2] * b;
    }
    return out[3] = a[3], out;
};

vec4.div = function (a, b, out) {
    if(!out) out = new vec4.array(4);
    if(typeof b === 'object') {
        out[0] = a[0] / b[0];
        out[1] = a[1] / b[1];
        out[2] = a[2] / b[2];
    } else {
        out[0] = a[0] / b;
        out[1] = a[1] / b;
        out[2] = a[2] / b;
    }
    return out[3] = a[3], out;
};

vec4.mod = function (a, b, out) {
    if(!out) out = new vec4.array(4);
    if(typeof b === 'object') {
        out[0] = a[0] % b[0];
        out[1] = a[1] % b[1];
        out[2] = a[2] % b[2];
    } else {
        out[0] = a[0] % b;
        out[1] = a[1] % b;
        out[2] = a[2] % b;
    }
    return out[3] = a[3], out;
};

vec4.min = function (a, min, out) {
    if(typeof min === 'undefined')
        return Math.min(a[0], a[1], a[2]);
    if(!out) out = new vec4.array(4);
    if(typeof min === 'object') {
        out[0] = a[0] < min[0] ? min[0] : a[0];
        out[1] = a[1] < min[1] ? min[1] : a[1];
        out[2] = a[2] < min[2] ? min[2] : a[2];
    } else {
        out[0] = a[0] < min ? min : a[0];
        out[1] = a[1] < min ? min : a[1];
        out[2] = a[2] < min ? min : a[2];
    }
    return out[3] = a[3], out;
};

vec4.max = function (a, max, out) {
    if(typeof max === 'undefined')
        return Math.max(a[0], a[1], a[2]);
    if(!out) out = new vec4.array(4);
    if(typeof max === 'object') {
        out[0] = a[0] > max[0] ? max[0] : a[0];
        out[1] = a[1] > max[1] ? max[1] : a[1];
        out[2] = a[2] > max[2] ? max[2] : a[2];
    } else {
        out[0] = a[0] > max ? max : a[0];
        out[1] = a[1] > max ? max : a[1];
        out[2] = a[2] > max ? max : a[2];
    }
    return out[3] = a[3], out;
};

vec4.clamp = function (a, min, max, out) {
    return vec4.max(vec4.min(a, min, vec4.buffer), max, out);
};

vec4.sum = function (a) {
    return a[0] + a[1] + a[2];
};

vec4.dot = function (a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
};

vec4.cross = function (a, b, out) {
    if(!out) out = new vec4.array(4);
    out[0] = a[1] * b[2] - a[2] * b[1];
    out[1] = a[2] * b[0] - a[0] * b[2];
    out[2] = a[0] * b[1] - a[1] * b[0];
    return out[3] = 1, out;
};

vec4.unit = function (a, out) {
    var l = Math.sqrt(vec4.dot(a, a));
    return vec4.mul(a, l ? 1 / l : 0, out);
};

vec4.length = function (a, length, out) {
    var l = Math.sqrt(vec4.dot(a, a));
    if(typeof length === 'undefined') return l;
    return vec4.mul(a, l ? length / l : 0, out);
};

vec4.length2 = function (a, length, out) {
    var l = vec4.dot(a, a);
    if(typeof length === 'undefined') return l;
    return vec4.mul(a, l ? length / l : 0, out);
};

vec4.distance = function (a, b) {
    return vec4.length(vec4.sub(b, a, vec4.buffer));
};

vec4.distance2 = function (a, b) {
    return vec4.dot(vec4.sub(b, a, vec4.buffer), vec4.buffer);
};

vec4.lerp = function (a, b, t, out) {
    vec4.sub(b, a, vec4.buffer);
    vec4.mul(vec4.buffer, t, vec4.buffer);
    return vec4.add(a, vec4.buffer, out);
};

vec4.project = function (a, b, out) {
    return vec4.mul(b, vec4.dot(a, b) / vec4.dot(b, b), out);
};

vec4.mirror = function (a, normal, out) {
    vec4.mul(normal, 2 * vec4.dot(a, normal), vec4.buffer);
    return vec4.sub(vec4.buffer, a, out);
};

vec4.reflect = function (a, normal, out) {
    vec4.mul(normal, 2 * vec4.dot(a, normal), vec4.buffer);
    return vec4.sub(a, vec4.buffer, out);
};

vec4.random = function (radius, out) {
    if(!out) out = new vec4.array(4);
    if(typeof radius === 'undefined') radius = 1;
    var t = Math.acos(Math.random() * 2 - 1);
    var p = Math.random() * Math.PI * 2;
    out[0] = radius * Math.sin(t) * Math.cos(p);
    out[1] = radius * Math.sin(t) * Math.sin(p);
    out[2] = radius * Math.cos(t);
    return out[3] = 1, out;
};

vec4.each = function (a, callback, out) {
    if(!out) out = new vec4.array(4);
    out[0] = callback(a[0], 0);
    out[1] = callback(a[1], 1);
    out[2] = callback(a[2], 2);
    return out[3] = a[3], out;
};

vec4.transform = function (v, m, out) {
    if(!out) out = new vec4.array(4);
    var      a = v[ 0] , b = v[ 1] , c = v[ 2] , d = v[ 3];
    out[0] = a * m[ 0] + b * m[ 1] + c * m[ 2] + d * m[ 3];
    out[1] = a * m[ 4] + b * m[ 5] + c * m[ 6] + d * m[ 7];
    out[2] = a * m[ 8] + b * m[ 9] + c * m[10] + d * m[11];
    out[3] = a * m[12] + b * m[13] + c * m[14] + d * m[15];
    return out;
};

export default vec4;