// ceilidh20.js
function Mash() {
    var e = 4022871197;
    return {
        hashFunction: function ($) {
            var t = null,
                n = 0;
            do (e += $.charCodeAt(n++)), (e = (t = 0.02519603282416938 * e) >>> 0), (t -= e), (t *= e), (e = t >>> 0), (t -= e), (e += 4294967296 * t);
            while (n < $.length);
            return (e >>> 0) * 23283064365386963e-26;
        },
    };
}
function Alea(e) {
    var $ = new Date(),
        t = Mash(),
        n = e || 1,
        r = 1,
        o = t.hashFunction(" "),
        l = t.hashFunction(" "),
        _ = t.hashFunction(" ");
    return (
        (o -= t.hashFunction($.getTime() + n + "")) < 0 && o++,
        (l -= t.hashFunction($.getTime() + n + "")) < 0 && l++,
        (_ -= t.hashFunction($.getTime() + n + "")) < 0 && _++,
        (t = null),
        {
            random: function () {
                var e = 2091639 * o + 23283064365386963e-26 * r;
                return (o = l), (l = _), (r = e), (_ = e - (0 | r));
            },
        }
    );
}
function toBytes(e) {
    if ("undefined" != typeof Buffer) return Buffer.isBuffer(e) ? e : Buffer.from(e);
    for (var $ = [], t = 0; t < e.length; t++) {
        if ("number" == typeof e[t]) return e;
        $[t] = e.charCodeAt(t);
    }
    return $;
}
function uintArray(e, $) {
    var t = [],
        n = null,
        r = 0;
    if ($)
        try {
            if ("undefined" != typeof window && void 0 !== window.crypto) return (n = new Uint8Array(e)), window.crypto.getRandomValues(n), n;
            return crypto.randomBytes(e);
        } catch (o) {
            for (; r < e; r++) (n = Alea(r + 1)), (t[r] = Math.floor(256 * n.random()));
        }
    else for (; r < e; r++) t[r] = 0;
    return t;
}
function arraySlice(e, $, t) {
    ($ = void 0 === $ ? 0 : $ < 0 ? e.length + $ : $), (t = void 0 === t ? e.length : t < 0 ? e.length + t : t);
    try {
        return e.slice($, t);
    } catch (n) {
        for (var r = [], o = $; o < t && o < e.length && o >= 0; o++) r.push(e[o]);
        return r;
    }
}
function get32(e, $) {
    return e[$++] ^ (e[$++] << 8) ^ (e[$++] << 16) ^ (e[$] << 24);
}
function rotl(e, $) {
    return (e << $) | (e >>> (32 - $));
}
function Ceilidh20_main(e, $, t, n, r, o, l) {
    var _ = [1634760805, 857760878, 0, 0, 0, 0, 2036477234, 0, 0, 0, 0, 1797285236, 0, 0, 0, 0, 0, 0],
        i = null,
        a = [],
        f = [],
        u = [],
        c = 0,
        h = 0,
        g = 0,
        y = 0,
        s = 0,
        v = 0;
    if ($) {
        var d = Buffer.alloc(64);
        (a = Buffer.alloc(256)), (f = Buffer.alloc(r.length));
    } else var d = uintArray(64, !1);
    if (l) {
        for (var m = 0; m < 256; m++) a[m] = m;
        for (var m = 0; m < 256; m++) (h = (h + a[m] + o[m % o.length]) % 256), (i = a[m]), (a[m] = a[h]), (a[h] = i);
    }
    e && (_ = new Uint32Array(_)),
        (_[2] = get32(n.key, 0)),
        (_[3] = get32(n.key, 4)),
        (_[4] = get32(n.key, 8)),
        (_[5] = get32(n.key, 12)),
        (_[6] = get32(n.nonce, 0)),
        (_[7] = get32(n.nonce, 4)),
        (_[8] = get32(n.nonce, 8)),
        (_[9] = get32(n.key, 16)),
        (_[10] = get32(n.key, 20)),
        (_[11] = get32(n.key, 24)),
        (_[12] = get32(n.key, 28)),
        (_[13] = get32(n.nonce, 12)),
        (_[14] = get32(n.nonce, 16)),
        (_[15] = get32(n.nonce, 20)),
        (_[16] = get32(n.nonce, 24));
    for (var k = 0; k < r.length; k++) {
        if ((l && ((y = (y + a[(g = (g + 1) % 256)]) % 256), (i = a[g]), (a[g] = a[y]), (a[y] = i)), 0 == s || 64 == s)) {
            for (c = 0, u = e ? _.slice() : u.concat(_); c < 20; c += 2)
                (u[4] = (u[4] ^ rotl(u[0] + u[12], t[0])) >>> 0),
                    (u[8] = (u[8] ^ rotl(u[4] + u[0], t[1])) >>> 0),
                    (u[12] = (u[12] ^ rotl(u[8] + u[4], t[2])) >>> 0),
                    (u[0] = (u[0] ^ rotl(u[12] + u[8], t[3])) >>> 0),
                    (u[9] = (u[9] ^ rotl(u[5] + u[1], t[0])) >>> 0),
                    (u[13] = (u[13] ^ rotl(u[9] + u[5], t[1])) >>> 0),
                    (u[1] = (u[1] ^ rotl(u[13] + u[9], t[2])) >>> 0),
                    (u[5] = (u[5] ^ rotl(u[1] + u[13], t[3])) >>> 0),
                    (u[14] = (u[14] ^ rotl(u[10] + u[6], t[0])) >>> 0),
                    (u[2] = (u[2] ^ rotl(u[14] + u[10], t[1])) >>> 0),
                    (u[6] = (u[6] ^ rotl(u[2] + u[14], t[2])) >>> 0),
                    (u[10] = (u[10] ^ rotl(u[6] + u[2], t[3])) >>> 0),
                    (u[3] = (u[3] ^ rotl(u[15] + u[11], t[0])) >>> 0),
                    (u[7] = (u[7] ^ rotl(u[3] + u[15], t[1])) >>> 0),
                    (u[11] = (u[11] ^ rotl(u[7] + u[3], t[2])) >>> 0),
                    (u[15] = (u[15] ^ rotl(u[11] + u[7], t[3])) >>> 0),
                    (u[1] = (u[1] ^ rotl(u[0] + u[3], t[0])) >>> 0),
                    (u[2] = (u[2] ^ rotl(u[1] + u[0], t[1])) >>> 0),
                    (u[3] = (u[3] ^ rotl(u[2] + u[1], t[2])) >>> 0),
                    (u[0] = (u[0] ^ rotl(u[3] + u[2], t[3])) >>> 0),
                    (u[6] = (u[6] ^ rotl(u[5] + u[4], t[0])) >>> 0),
                    (u[7] = (u[7] ^ rotl(u[6] + u[5], t[1])) >>> 0),
                    (u[4] = (u[4] ^ rotl(u[7] + u[6], t[2])) >>> 0),
                    (u[5] = (u[5] ^ rotl(u[4] + u[7], t[3])) >>> 0),
                    (u[11] = (u[11] ^ rotl(u[10] + u[9], t[0])) >>> 0),
                    (u[8] = (u[8] ^ rotl(u[11] + u[10], t[1])) >>> 0),
                    (u[9] = (u[9] ^ rotl(u[8] + u[11], t[2])) >>> 0),
                    (u[10] = (u[10] ^ rotl(u[9] + u[8], t[3])) >>> 0),
                    (u[12] = (u[12] ^ rotl(u[15] + u[14], t[0])) >>> 0),
                    (u[13] = (u[13] ^ rotl(u[12] + u[15], t[1])) >>> 0),
                    (u[14] = (u[14] ^ rotl(u[13] + u[12], t[2])) >>> 0),
                    (u[15] = (u[15] ^ rotl(u[14] + u[13], t[3])) >>> 0);
            for (c = 0; c < 16; c++) (u[c] = u[c] + _[c]), (d[v++] = 255 & u[c]), (d[v++] = (u[c] >>> 8) & 255), (d[v++] = (u[c] >>> 16) & 255), (d[v++] = (u[c] >>> 24) & 255);
            (u = []), (v = 0), (s = 0), (_[8] = (_[8] + 1) >>> 0), (_[9] = 0 == _[8] ? (_[9] + 1) >>> 0 : _[9]);
        }
        f[k] = l ? r[k] ^ a[(a[g] + a[y]) % 256] ^ d[s++] : r[k] ^ d[s++];
    }
    return (_ = null), f;
}
function Ceilidh20(e, $) {
    if (!$.key || 32 != $.key.length) throw "The key must be defined and 32 bytes long.";
    if (!$.iv || 32 != $.iv.length) throw "The IV must be defined and 32 bytes long.";
    if (!$.nonce || 24 != $.nonce.length) throw "The nonce must be defined and 24 bytes long.";
    var t = $.stateVariant && 4 == $.stateVariant.length ? $.stateVariant : [7, 12, 8, 16],
        n = "undefined" != typeof Buffer,
        r = "undefined" != typeof Uint32Array,
        o = toBytes(e),
        l = [],
        _ = uintArray($.iv.length, !0),
        i = null;
    if (
        (n &&
            (($.key = Buffer.isBuffer($.key) ? $.key : Buffer.from($.key)),
            ($.iv = Buffer.isBuffer($.iv) ? $.iv : Buffer.from($.iv)),
            ($.nonce = Buffer.isBuffer($.nonce) ? $.nonce : Buffer.from($.nonce)),
            (l = Buffer.alloc($.iv.length)),
            (t = Buffer.from(t))),
        $.isEncrypt)
    ) {
        for (var a = 0; a < $.iv.length; a++) l[a] = _[a] ^ $.iv[a];
        var f = Ceilidh20_main(r, n, t, $, o, l, 1),
            u = Ceilidh20_main(r, n, t, $, _, null, 0);
        i = n ? Buffer.concat([f, u]) : f.concat(u);
    } else {
        if (n) var c = o.slice(o.length - 32);
        else var c = arraySlice(o, -32);
        _ = Ceilidh20_main(r, n, t, $, c, null, 0);
        for (var a = 0; a < $.iv.length; a++) l[a] = _[a] ^ $.iv[a];
        (o = n ? o.slice(0, o.length - 32) : arraySlice(o, 0, -32)), (i = Ceilidh20_main(r, n, t, $, o, l, 1));
    }
    return n && l.fill(0), (e = null), i;
}