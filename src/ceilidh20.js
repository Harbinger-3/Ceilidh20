// ceilidh20.js
function Mash() {
    var t = 4022871197;
    return {
        hashFunction: function ($) {
            var e = null,
                r = 0;
            do (t += $.charCodeAt(r++)), (t = (e = 0.02519603282416938 * t) >>> 0), (e -= t), (e *= t), (t = e >>> 0), (e -= t), (t += 4294967296 * e);
            while (r < $.length);
            return (t >>> 0) * 23283064365386963e-26;
        },
    };
}
function Alea(t) {
    var $ = new Date(),
        e = Mash(),
        r = t || 1,
        _ = 1,
        n = e.hashFunction(" "),
        o = e.hashFunction(" "),
        i = e.hashFunction(" ");
    return (
        (n -= e.hashFunction($.getTime() + r + "")) < 0 && n++,
        (o -= e.hashFunction($.getTime() + r + "")) < 0 && o++,
        (i -= e.hashFunction($.getTime() + r + "")) < 0 && i++,
        (e = null),
        {
            random: function () {
                var t = 2091639 * n + 23283064365386963e-26 * _;
                return (n = o), (o = i), (_ = t), (i = t - (0 | _));
            },
        }
    );
}
var Sha256 = {
    majority: function (t, $, e) {
        return (t & $) ^ (t & e) ^ ($ & e);
    },
    ROTR: function (t, $) {
        return ($ >>> t) | ($ << (32 - t));
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
    choice: function (t, $, e) {
        return (t & $) ^ (~t & e);
    },
    toHexStr: function (t) {
        for (var $ = "", e = 7; e >= 0; e--) $ += ((t >>> (4 * e)) & 15).toString(16);
        return $;
    },
    utf8Encode: function (t) {
        for (var $ = "", e = 0; e < t.length; e++) {
            var r = t.charCodeAt(e);
            r < 128
                ? ($ += String.fromCharCode(r))
                : r < 2048
                ? (($ += String.fromCharCode((r >> 6) | 192)), ($ += String.fromCharCode((63 & r) | 128)))
                : (($ += String.fromCharCode((r >> 12) | 224)), ($ += String.fromCharCode(((r >> 6) & 63) | 128)), ($ += String.fromCharCode((63 & r) | 128)));
        }
        return $;
    },
    hash: function (t) {
        try {
            var $ = crypto.createHash("sha256");
            return $.update(t), $.digest("hex");
        } catch (e) {
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
            for (var f = _[0], u = _[1], s = _[2], c = _[3], g = _[4], d = _[5], y = _[6], m = _[7], l = 0; l < 64; l++) {
                var v = m + this.sigma1(g) + this.choice(g, d, y) + r[l] + h[l],
                    C = this.sigma0(f) + this.majority(f, u, s);
                (m = y), (y = d), (d = g), (c = s), (s = u), (u = f), (g = (c + v) & 4294967295), (f = (v + C) & 4294967295);
            }
            (_[0] = (_[0] + f) & 4294967295),
                (_[1] = (_[1] + u) & 4294967295),
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
    for (var $ = [], e = 0; e < t.length; e++) {
        if ("number" == typeof t[e]) return t;
        $[e] = t.charCodeAt(e);
    }
    return $;
}
function uintArray(t, $) {
    var e = [],
        r = null,
        _ = 0;
    if ($)
        try {
            if ("undefined" != typeof window && void 0 !== window.crypto) return (r = new Uint8Array(t)), window.crypto.getRandomValues(r), r;
            return crypto.randomBytes(t);
        } catch (n) {
            for (; _ < t; _++) (r = Alea(_ + 1)), (e[_] = Math.floor(256 * r.random()));
        }
    else for (; _ < t; _++) e[_] = 0;
    return e;
}
function arraySlice(t, $, e) {
    ($ = void 0 === $ ? 0 : $ < 0 ? t.length + $ : $), (e = void 0 === e ? t.length : e < 0 ? t.length + e : e);
    try {
        return t.slice($, e);
    } catch (r) {
        for (var _ = [], n = $; n < e && n < t.length && n >= 0; n++) _.push(t[n]);
        return _;
    }
}
function hexToBytes(t) {
    for (var $ = [], e = 0; e < t.length; e += 2) $.push(parseInt(t.substr(e, 2), 16));
    return $;
}
function toChars(t) {
    if ("string" == typeof t) return t;
    for (var $ = "", e = 0; e < t.length; e++) $ += String.fromCharCode(t[e]);
    return $;
}
function get32(t, $) {
    return t[$++] ^ (t[$++] << 8) ^ (t[$++] << 16) ^ (t[$] << 24);
}
function rotl(t, $) {
    return (t << $) | (t >>> (32 - $));
}
function Ceilidh20_main(t, $, e, r, _, n) {
    var o = [1634760805, 857760878, 0, 0, 0, 0, 2036477234, 0, 0, 0, 0, 1797285236, 0, 0, 0, 0, 0, 0],
        i = [],
        a = [],
        h = 0,
        l = 0,
        f = 0;
    if (t) {
        var u = Buffer.alloc(64);
        i = Buffer.alloc(r.length);
    } else var u = uintArray(64, !1);
    (o[2] = get32(e.key, 0)),
        (o[3] = get32(e.key, 4)),
        (o[4] = get32(e.key, 8)),
        (o[5] = get32(e.key, 12)),
        (o[6] = get32(e.nonce, 0)),
        (o[7] = get32(e.nonce, 4)),
        (o[8] = get32(e.nonce, 8)),
        (o[9] = get32(e.key, 16)),
        (o[10] = get32(e.key, 20)),
        (o[11] = get32(e.key, 24)),
        (o[12] = get32(e.key, 28)),
        (o[13] = get32(e.nonce, 12)),
        (o[14] = get32(e.nonce, 16)),
        (o[15] = get32(e.nonce, 20)),
        (o[16] = get32(e.nonce, 24));
    for (var s = 0; s < r.length; s++) {
        if (0 == l || 64 == l) {
            for (h = 0, a = a.concat(o); h < 20; h += 2)
                (a[4] = (a[4] ^ rotl(a[0] + a[12], $[0])) >>> 0),
                    (a[8] = (a[8] ^ rotl(a[4] + a[0], $[1])) >>> 0),
                    (a[12] = (a[12] ^ rotl(a[8] + a[4], $[2])) >>> 0),
                    (a[0] = (a[0] ^ rotl(a[12] + a[8], $[3])) >>> 0),
                    (a[9] = (a[9] ^ rotl(a[5] + a[1], $[0])) >>> 0),
                    (a[13] = (a[13] ^ rotl(a[9] + a[5], $[1])) >>> 0),
                    (a[1] = (a[1] ^ rotl(a[13] + a[9], $[2])) >>> 0),
                    (a[5] = (a[5] ^ rotl(a[1] + a[13], $[3])) >>> 0),
                    (a[14] = (a[14] ^ rotl(a[10] + a[6], $[0])) >>> 0),
                    (a[2] = (a[2] ^ rotl(a[14] + a[10], $[1])) >>> 0),
                    (a[6] = (a[6] ^ rotl(a[2] + a[14], $[2])) >>> 0),
                    (a[10] = (a[10] ^ rotl(a[6] + a[2], $[3])) >>> 0),
                    (a[3] = (a[3] ^ rotl(a[15] + a[11], $[0])) >>> 0),
                    (a[7] = (a[7] ^ rotl(a[3] + a[15], $[1])) >>> 0),
                    (a[11] = (a[11] ^ rotl(a[7] + a[3], $[2])) >>> 0),
                    (a[15] = (a[15] ^ rotl(a[11] + a[7], $[3])) >>> 0),
                    (a[1] = (a[1] ^ rotl(a[0] + a[3], $[0])) >>> 0),
                    (a[2] = (a[2] ^ rotl(a[1] + a[0], $[1])) >>> 0),
                    (a[3] = (a[3] ^ rotl(a[2] + a[1], $[2])) >>> 0),
                    (a[0] = (a[0] ^ rotl(a[3] + a[2], $[3])) >>> 0),
                    (a[6] = (a[6] ^ rotl(a[5] + a[4], $[0])) >>> 0),
                    (a[7] = (a[7] ^ rotl(a[6] + a[5], $[1])) >>> 0),
                    (a[4] = (a[4] ^ rotl(a[7] + a[6], $[2])) >>> 0),
                    (a[5] = (a[5] ^ rotl(a[4] + a[7], $[3])) >>> 0),
                    (a[11] = (a[11] ^ rotl(a[10] + a[9], $[0])) >>> 0),
                    (a[8] = (a[8] ^ rotl(a[11] + a[10], $[1])) >>> 0),
                    (a[9] = (a[9] ^ rotl(a[8] + a[11], $[2])) >>> 0),
                    (a[10] = (a[10] ^ rotl(a[9] + a[8], $[3])) >>> 0),
                    (a[12] = (a[12] ^ rotl(a[15] + a[14], $[0])) >>> 0),
                    (a[13] = (a[13] ^ rotl(a[12] + a[15], $[1])) >>> 0),
                    (a[14] = (a[14] ^ rotl(a[13] + a[12], $[2])) >>> 0),
                    (a[15] = (a[15] ^ rotl(a[14] + a[13], $[3])) >>> 0);
            for (h = 0; h < 16; h++) (a[h] = a[h] + o[h]), (u[f++] = 255 & a[h]), (u[f++] = (a[h] >>> 8) & 255), (u[f++] = (a[h] >>> 16) & 255), (u[f++] = (a[h] >>> 24) & 255);
            (a = []), (f = 0), (l = 0), (o[8] = (o[8] + 1) >>> 0), (o[9] = 0 == o[8] ? (o[9] + 1) >>> 0 : o[9]);
        }
        n ? (i[s] = r[s] ^ u[l++] ^ (_[s % _.length] + s) % 256) : (i[s] = r[s] ^ u[l++]);
    }
    return (o = null), i;
}
function Ceilidh20(t, $) {
    if (!$.key || 32 != $.key.length) throw "The key must be defined and 32 bytes long.";
    if (!$.nonce || 24 != $.nonce.length) throw "The nonce must be defined and 24 bytes long.";
    if (!$.iv) throw "The IV must be defined.";
    $.genIVLen = "number" != typeof $.genIVLen || 0 >= Math.floor($.genIVLen) ? 32 : Math.floor($.genIVLen);
    var e = $.stateVariant && 4 == $.stateVariant.length ? $.stateVariant : [7, 12, 8, 16],
        r = "undefined" != typeof Buffer,
        _ = toBytes(t),
        n = null;
    if ((r && (($.key = Buffer.isBuffer($.key) ? $.key : Buffer.from($.key)), ($.nonce = Buffer.isBuffer($.nonce) ? $.nonce : Buffer.from($.nonce)), (e = Buffer.from(e))), $.isEncrypt)) {
        var o = uintArray($.genIVLen, !0),
            i = hexToBytes(Sha256.hash(toChars(o) + toChars($.iv)));
        r && (i = Buffer.isBuffer(i) ? i : Buffer.from(i));
        var a = Ceilidh20_main(r, e, $, _, i, 1),
            h = Ceilidh20_main(r, e, $, o, null, 0);
        n = r ? Buffer.concat([a, h]) : a.concat(h);
    } else {
        if (r) var l = _.slice(_.length - $.genIVLen);
        else var l = arraySlice(_, -$.genIVLen);
        var o = Ceilidh20_main(r, e, $, l, null, 0),
            i = hexToBytes(Sha256.hash(toChars(o) + toChars($.iv)));
        r ? ((i = Buffer.isBuffer(i) ? i : Buffer.from(i)), (_ = _.slice(0, _.length - $.genIVLen))) : (_ = arraySlice(_, 0, -$.genIVLen)), (n = Ceilidh20_main(r, e, $, _, i, 1));
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
