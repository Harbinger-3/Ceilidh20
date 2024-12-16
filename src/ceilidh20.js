// ceilidh20.js
function Mash() {
    var t = 4022871197;
    return {
        hashFunction: function (e) {
            var $ = null,
                r = 0;
            do (t += e.charCodeAt(r++)), (t = ($ = 0.02519603282416938 * t) >>> 0), ($ -= t), ($ *= t), (t = $ >>> 0), ($ -= t), (t += 4294967296 * $);
            while (r < e.length);
            return (t >>> 0) * 23283064365386963e-26;
        },
    };
}
function Alea(t) {
    var e = new Date(),
        $ = Mash(),
        r = t || 1,
        _ = 1,
        n = $.hashFunction(" "),
        o = $.hashFunction(" "),
        i = $.hashFunction(" ");
    return (
        (n -= $.hashFunction(e.getTime() + r + "")) < 0 && n++,
        (o -= $.hashFunction(e.getTime() + r + "")) < 0 && o++,
        (i -= $.hashFunction(e.getTime() + r + "")) < 0 && i++,
        ($ = null),
        {
            random: function () {
                var t = 2091639 * n + 23283064365386963e-26 * _;
                return (n = o), (o = i), (_ = t), (i = t - (0 | _));
            },
        }
    );
}
var Sha256 = {
    majority: function (t, e, $) {
        return (t & e) ^ (t & $) ^ (e & $);
    },
    ROTR: function (t, e) {
        return (e >>> t) | (e << (32 - t));
    },
    sigma0: function (t) {
        return this.ROTR(2, t) ^ this.ROTR(13, t) ^ this.ROTR(22, t);
    },
    sigma1: function (t) {
        return this.ROTR(6, t) ^ this.ROTR(11, t) ^ this.ROTR(25, t);
    },
    choice0: function (t) {
        return this.ROTR(7, t) ^ this.ROTR(18, t) ^ (t >>> 3);
    },
    choice1: function (t) {
        return this.ROTR(17, t) ^ this.ROTR(19, t) ^ (t >>> 10);
    },
    choice: function (t, e, $) {
        return (t & e) ^ (~t & $);
    },
    toHexStr: function (t) {
        for (var e = "", $ = 7; $ >= 0; $--) e += ((t >>> (4 * $)) & 15).toString(16);
        return e;
    },
    utf8Encode: function (t) {
        for (var e = "", $ = 0; $ < t.length; $++) {
            var r = t.charCodeAt($);
            r < 128
                ? (e += String.fromCharCode(r))
                : r < 2048
                ? ((e += String.fromCharCode((r >> 6) | 192)), (e += String.fromCharCode((63 & r) | 128)))
                : ((e += String.fromCharCode((r >> 12) | 224)), (e += String.fromCharCode(((r >> 6) & 63) | 128)), (e += String.fromCharCode((63 & r) | 128)));
        }
        return e;
    },
    hash: function (t) {
        try {
            var e = crypto.createHash("sha256");
            return e.update(t), e.digest("hex");
        } catch ($) {
            t = this.utf8Encode(t);
        }
        for (
            var r = [
                    1116352408,
                    1899447441,
                    3049323471,
                    3921009573,
                    961987163,
                    1508970993,
                    2453635748,
                    2870763221,
                    3624381080,
                    310598401,
                    607225278,
                    1426881987,
                    1925078388,
                    2162078206,
                    2614888103,
                    3248222580,
                    3835390401,
                    4022224774,
                    264347078,
                    604807628,
                    770255983,
                    1249150122,
                    1555081692,
                    1996064986,
                    2554220882,
                    2821834349,
                    2952996808,
                    3210313671,
                    3336571891,
                    3584528711,
                    113926993,
                    338241895,
                    666307205,
                    773529912,
                    1294757372,
                    1396182291,
                    1695183700,
                    1986661051,
                    2177026350,
                    2456956037,
                    2730485921,
                    2820302411,
                    3259730800,
                    3345764771,
                    3516065817,
                    3600352804,
                    4094571909,
                    275423344,
                    430227734,
                    506948616,
                    659060556,
                    883997877,
                    958139571,
                    1322822218,
                    1537002063,
                    1747873779,
                    1955562222,
                    2024104815,
                    2227730452,
                    2361852424,
                    2428436474,
                    2756734187,
                    3204031479,
                    3329325298,
                ],
                _ = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225],
                n = Math.ceil(((t += "\x80").length / 4 + 2) / 16),
                o = Array(n),
                i = 0;
            i < n;
            i++
        ) {
            o[i] = Array(16);
            for (var a = 0; a < 16; a++) o[i][a] = (t.charCodeAt(64 * i + 4 * a) << 24) | (t.charCodeAt(64 * i + 4 * a + 1) << 16) | (t.charCodeAt(64 * i + 4 * a + 2) << 8) | t.charCodeAt(64 * i + 4 * a + 3);
        }
        (o[n - 1][14] = ((t.length - 1) * 8) / 4294967296), (o[n - 1][14] = Math.floor(o[n - 1][14])), (o[n - 1][15] = ((t.length - 1) * 8) & 4294967295);
        for (var h = [], i = 0; i < n; i++) {
            for (var l = 0; l < 16; l++) h[l] = o[i][l];
            for (var l = 16; l < 64; l++) h[l] = (this.sigma1(h[l - 2]) + h[l - 7] + this.sigma0(h[l - 15]) + h[l - 16]) & 4294967295;
            for (var u = _[0], f = _[1], s = _[2], c = _[3], g = _[4], d = _[5], y = _[6], m = _[7], l = 0; l < 64; l++) {
                var v = m + this.sigma1(g) + this.choice(g, d, y) + r[l] + h[l],
                    C = this.sigma0(u) + this.majority(u, f, s);
                (m = y), (y = d), (d = g), (c = s), (s = f), (f = u), (g = (c + v) & 4294967295), (u = (v + C) & 4294967295);
            }
            (_[0] = (_[0] + u) & 4294967295),
                (_[1] = (_[1] + f) & 4294967295),
                (_[2] = (_[2] + s) & 4294967295),
                (_[3] = (_[3] + c) & 4294967295),
                (_[4] = (_[4] + g) & 4294967295),
                (_[5] = (_[5] + d) & 4294967295),
                (_[6] = (_[6] + y) & 4294967295),
                (_[7] = (_[7] + m) & 4294967295);
        }
        return this.toHexStr(_[0]) + this.toHexStr(_[1]) + this.toHexStr(_[2]) + this.toHexStr(_[3]) + this.toHexStr(_[4]) + this.toHexStr(_[5]) + this.toHexStr(_[6]) + this.toHexStr(_[7]);
    },
};
function toBytes(t) {
    if ("undefined" != typeof Buffer) return Buffer.isBuffer(t) ? t : Buffer.from(t);
    for (var e = [], $ = 0; $ < t.length; $++) {
        if ("number" == typeof t[$]) return t;
        e[$] = t.charCodeAt($);
    }
    return e;
}
function uintArray(t, e) {
    var $ = [],
        r = null,
        _ = 0;
    if (e)
        try {
            if ("undefined" != typeof window && void 0 !== window.crypto) return (r = new Uint8Array(t)), window.crypto.getRandomValues(r), r;
            return crypto.randomBytes(t);
        } catch (n) {
            for (; _ < t; _++) (r = Alea(_ + 1)), ($[_] = Math.floor(256 * r.random()));
        }
    else for (; _ < t; _++) $[_] = 0;
    return $;
}
function arraySlice(t, e, $) {
    (e = void 0 === e ? 0 : e < 0 ? t.length + e : e), ($ = void 0 === $ ? t.length : $ < 0 ? t.length + $ : $);
    try {
        return t.slice(e, $);
    } catch (r) {
        for (var _ = [], n = e; n < $ && n < t.length && n >= 0; n++) _.push(t[n]);
        return _;
    }
}
function hexToBytes(t) {
    for (var e = [], $ = 0; $ < t.length; $ += 2) e.push(parseInt(t.substr($, 2), 16));
    return e;
}
function toChars(t) {
    if ("string" == typeof t) return t;
    for (var e = "", $ = 0; $ < t.length; $++) e += String.fromCharCode(t[$]);
    return e;
}
function get32(t, e) {
    return t[e++] ^ (t[e++] << 8) ^ (t[e++] << 16) ^ (t[e] << 24);
}
function rotl(t, e) {
    return (t << e) | (t >>> (32 - e));
}
function Ceilidh20_main(t, e, $, r, _, n) {
    var o = [1634760805, 857760878, 0, 0, 0, 0, 2036477234, 0, 0, 0, 0, 1797285236, 0, 0, 0, 0, 0, 0],
        i = [],
        a = [],
        h = 0,
        l = 0,
        u = 0;
    if (t) {
        var f = Buffer.alloc(64);
        i = Buffer.alloc(r.length);
    } else var f = uintArray(64, !1);
    (o[2] = get32($.key, 0)),
        (o[3] = get32($.key, 4)),
        (o[4] = get32($.key, 8)),
        (o[5] = get32($.key, 12)),
        (o[6] = get32($.nonce, 0)),
        (o[7] = get32($.nonce, 4)),
        (o[8] = get32($.nonce, 8)),
        (o[9] = get32($.key, 16)),
        (o[10] = get32($.key, 20)),
        (o[11] = get32($.key, 24)),
        (o[12] = get32($.key, 28)),
        (o[13] = get32($.nonce, 12)),
        (o[14] = get32($.nonce, 16)),
        (o[15] = get32($.nonce, 20)),
        (o[16] = get32($.nonce, 24));
    for (var s = 0; s < r.length; s++) {
        if (0 == l || 64 == l) {
            for (h = 0, a = a.concat(o); h < 20; h += 2)
                (a[4] = (a[4] ^ rotl(a[0] + a[12], e[0])) >>> 0),
                    (a[8] = (a[8] ^ rotl(a[4] + a[0], e[1])) >>> 0),
                    (a[12] = (a[12] ^ rotl(a[8] + a[4], e[2])) >>> 0),
                    (a[0] = (a[0] ^ rotl(a[12] + a[8], e[3])) >>> 0),
                    (a[9] = (a[9] ^ rotl(a[5] + a[1], e[0])) >>> 0),
                    (a[13] = (a[13] ^ rotl(a[9] + a[5], e[1])) >>> 0),
                    (a[1] = (a[1] ^ rotl(a[13] + a[9], e[2])) >>> 0),
                    (a[5] = (a[5] ^ rotl(a[1] + a[13], e[3])) >>> 0),
                    (a[14] = (a[14] ^ rotl(a[10] + a[6], e[0])) >>> 0),
                    (a[2] = (a[2] ^ rotl(a[14] + a[10], e[1])) >>> 0),
                    (a[6] = (a[6] ^ rotl(a[2] + a[14], e[2])) >>> 0),
                    (a[10] = (a[10] ^ rotl(a[6] + a[2], e[3])) >>> 0),
                    (a[3] = (a[3] ^ rotl(a[15] + a[11], e[0])) >>> 0),
                    (a[7] = (a[7] ^ rotl(a[3] + a[15], e[1])) >>> 0),
                    (a[11] = (a[11] ^ rotl(a[7] + a[3], e[2])) >>> 0),
                    (a[15] = (a[15] ^ rotl(a[11] + a[7], e[3])) >>> 0),
                    (a[1] = (a[1] ^ rotl(a[0] + a[3], e[0])) >>> 0),
                    (a[2] = (a[2] ^ rotl(a[1] + a[0], e[1])) >>> 0),
                    (a[3] = (a[3] ^ rotl(a[2] + a[1], e[2])) >>> 0),
                    (a[0] = (a[0] ^ rotl(a[3] + a[2], e[3])) >>> 0),
                    (a[6] = (a[6] ^ rotl(a[5] + a[4], e[0])) >>> 0),
                    (a[7] = (a[7] ^ rotl(a[6] + a[5], e[1])) >>> 0),
                    (a[4] = (a[4] ^ rotl(a[7] + a[6], e[2])) >>> 0),
                    (a[5] = (a[5] ^ rotl(a[4] + a[7], e[3])) >>> 0),
                    (a[11] = (a[11] ^ rotl(a[10] + a[9], e[0])) >>> 0),
                    (a[8] = (a[8] ^ rotl(a[11] + a[10], e[1])) >>> 0),
                    (a[9] = (a[9] ^ rotl(a[8] + a[11], e[2])) >>> 0),
                    (a[10] = (a[10] ^ rotl(a[9] + a[8], e[3])) >>> 0),
                    (a[12] = (a[12] ^ rotl(a[15] + a[14], e[0])) >>> 0),
                    (a[13] = (a[13] ^ rotl(a[12] + a[15], e[1])) >>> 0),
                    (a[14] = (a[14] ^ rotl(a[13] + a[12], e[2])) >>> 0),
                    (a[15] = (a[15] ^ rotl(a[14] + a[13], e[3])) >>> 0);
            for (h = 0; h < 16; h++) (a[h] = a[h] + o[h]), (f[u++] = 255 & a[h]), (f[u++] = (a[h] >>> 8) & 255), (f[u++] = (a[h] >>> 16) & 255), (f[u++] = (a[h] >>> 24) & 255);
            (a = []), (u = 0), (l = 0), (o[8] = (o[8] + 1) >>> 0), (o[9] = 0 == o[8] ? (o[9] + 1) >>> 0 : o[9]);
        }
        n ? (i[s] = r[s] ^ f[l++] ^ (_[s % _.length] + s) % 256) : (i[s] = r[s] ^ f[l++]);
    }
    return (o = null), i;
}
function Ceilidh20(t, e) {
    if (!e.key || 32 != e.key.length) throw "The key must be defined and 32 bytes long.";
    if (!e.nonce || 24 != e.nonce.length) throw "The nonce must be defined and 24 bytes long.";
    if (!e.iv) throw "The IV must be defined.";
    if ("number" != typeof e.genIVLen) throw "The generate IV pair length must be defined and be a number.";
    var $ = e.stateVariant && 4 == e.stateVariant.length ? e.stateVariant : [7, 12, 8, 16],
        r = "undefined" != typeof Buffer,
        _ = toBytes(t),
        n = null;
    if ((r && ((e.key = Buffer.isBuffer(e.key) ? e.key : Buffer.from(e.key)), (e.nonce = Buffer.isBuffer(e.nonce) ? e.nonce : Buffer.from(e.nonce)), ($ = Buffer.from($))), e.isEncrypt)) {
        var o = uintArray(e.genIVLen, !0),
            i = hexToBytes(Sha256.hash(toChars(o) + toChars(e.iv))),
            a = Ceilidh20_main(r, $, e, _, i, 1),
            h = Ceilidh20_main(r, $, e, o, null, 0);
        n = r ? Buffer.concat([a, h]) : a.concat(h);
    } else {
        if (r) var l = _.slice(_.length - e.genIVLen);
        else var l = arraySlice(_, -e.genIVLen);
        var u = Ceilidh20_main(r, $, e, l, null, 0),
            i = hexToBytes(Sha256.hash(toChars(u) + toChars(e.iv)));
        (_ = r ? _.slice(0, _.length - e.genIVLen) : arraySlice(_, 0, -e.genIVLen)), (n = Ceilidh20_main(r, $, e, _, i, 1));
    }
    return (i = null), (t = null), n;
}
if ("undefined" != typeof module && module.exports) {
    module.exports = {
        Mash,
        Alea,
        Sha256,
        toBytes,
        toChars,
        uintArray,
        arraySlice,
        hexToBytes,
        get32,
        rotl,
        Ceilidh20_main,
        Ceilidh20
    };
}
