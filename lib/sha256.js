/**** SHA-256 HASHING IMPLEMENTATION ****/
// This is a custom implementation of the SHA-256 hashing algorithm, which is used to 
// generate a fixed-size (256-bit) hash value from an input message. The algorithm 
// processes the input in 512-bit chunks and applies a series of bitwise operations 
// including rotations, logical operations, and modular arithmetic to generate the hash.
// This implementation ensures compatibility with both modern and legacy environments.
var Sha256 = {
    // Returns the majority of three values
    majority: function(x, y, z) {
        return (((x & y) ^ (x & z)) ^ (y & z));
    },
    // Rotates the bits of x right by n positions (32-bit rotation)
    ROTR: function(n, x) {
        return ((x >>> n) | (x << (32 - n)));
    },
    // Applies a combination of right bitwise rotations to x
    sigma0: function(x) {
        return ((this.ROTR(2, x) ^ this.ROTR(13, x)) ^ this.ROTR(22, x));
    },
    // Applies a combination of right bitwise rotations to x
    sigma1: function(x) {
        return ((this.ROTR(6, x) ^ this.ROTR(11, x)) ^ this.ROTR(25, x));
    },
    // Performs bitwise operations to manipulate the input
    choice0: function(x) {
        return ((this.ROTR(7, x) ^ this.ROTR(18, x)) ^ (x >>> 3));
    },
    // Performs bitwise operations to manipulate the input
    choice1: function(x) {
        return ((this.ROTR(17, x) ^ this.ROTR(19, x)) ^ (x >>> 10));
    },
    // Performs bitwise operations
    choice: function(x, y, z) {
        return ((x & y) ^ (~x & z));
    },
    // Converts a 32-bit integer to a hexadecimal string
    toHexStr: function(n) {
        var hexString = "";
        for (var i = 7; i >= 0; i--) {
            var value = (n >>> (i * 4)) & 15;
            hexString += value.toString(16);
        }
        return hexString;
    },
    // Encodes a string to UTF-8 (used to handle multi-byte characters)
    utf8Encode: function(c) {
        var utf8Text = "";
        for (var i = 0; i < c.length; i++) {
            var charCode = c.charCodeAt(i);
            if (charCode < 128) {
                utf8Text += String.fromCharCode(charCode);
            } else if (charCode < 2048) {
                utf8Text += String.fromCharCode((charCode >> 6) | 192);
                utf8Text += String.fromCharCode((charCode & 63) | 128);
            } else {
                utf8Text += String.fromCharCode((charCode >> 12) | 224);
                utf8Text += String.fromCharCode(((charCode >> 6) & 63) | 128);
                utf8Text += String.fromCharCode((charCode & 63) | 128);
            }
        }
        return utf8Text;
    },
    // Main hashing function (SHA-256)
    hash: function(message) {
        try {
            // Try using Node.js's crypto library if available
            var hash = crypto.createHash('sha256');
            hash.update(message);
            return hash.digest('hex');
        } catch (e) {
            // If crypto is not available, manually encode the message as UTF-8
            message = this.utf8Encode(message);
        }
        var K = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298];
        var H = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225];
        message += String.fromCharCode(128);
        var messageLength = message.length / 4 + 2;
        var numberOfChunks = Math.ceil(messageLength / 16);
        var messageChunks = new Array(numberOfChunks);
        // Split the message into 512-bit blocks (16 words of 32 bits each)
        for (var i = 0; i < numberOfChunks; i++) {
            messageChunks[i] = new Array(16);
            for (var j = 0; j < 16; j++) {
                messageChunks[i][j] = (message.charCodeAt(i * 64 + j * 4) << 24) |
                                      (message.charCodeAt(i * 64 + j * 4 + 1) << 16) |
                                      (message.charCodeAt(i * 64 + j * 4 + 2) << 8) |
                                      (message.charCodeAt(i * 64 + j * 4 + 3));
            }
        }
        // Set the length of the original message (in bits) in the last chunk
        messageChunks[numberOfChunks - 1][14] = ((message.length - 1) * 8) / Math.pow(2, 32);
        messageChunks[numberOfChunks - 1][14] = Math.floor(messageChunks[numberOfChunks - 1][14]);
        messageChunks[numberOfChunks - 1][15] = ((message.length - 1) * 8) & 4294967295;
        var W = [];
        for (var i = 0; i < numberOfChunks; i++) {
            for (var t = 0; t < 16; t++) {
                W[t] = messageChunks[i][t];
            }
            for (var t = 16; t < 64; t++) {
                W[t] = (this.sigma1(W[t - 2]) + W[t - 7] + this.sigma0(W[t - 15]) + W[t - 16]) & 4294967295;
            }
            var a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];
            // Main loop: 64 rounds
            for (var t = 0; t < 64; t++) {
                var T1 = h + this.sigma1(e) + this.choice(e, f, g) + K[t] + W[t];
                var T2 = this.sigma0(a) + this.majority(a, b, c);
                h = g;
                g = f;
                f = e;
                d = c;
                c = b;
                b = a;
                e = (d + T1) & 4294967295;
                a = (T1 + T2) & 4294967295;
            }
            H[0] = (H[0] + a) & 4294967295;
            H[1] = (H[1] + b) & 4294967295;
            H[2] = (H[2] + c) & 4294967295;
            H[3] = (H[3] + d) & 4294967295;
            H[4] = (H[4] + e) & 4294967295;
            H[5] = (H[5] + f) & 4294967295;
            H[6] = (H[6] + g) & 4294967295;
            H[7] = (H[7] + h) & 4294967295;
        }
        // Return the final hash as a hexadecimal string
        return (this.toHexStr(H[0]) + this.toHexStr(H[1]) + this.toHexStr(H[2]) + this.toHexStr(H[3]) + this.toHexStr(H[4]) + this.toHexStr(H[5]) + this.toHexStr(H[6]) + this.toHexStr(H[7]));
    }
};
