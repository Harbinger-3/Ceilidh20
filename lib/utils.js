// Converts a string to a byte array.
// In Node.js, it uses the Buffer class to handle conversion.
// If the argument is already a byte array, it returns it as-is.
// Otherwise, it converts each character of the string to its byte (char code) equivalent.
function toBytes(string) {
    // Node.js Buffer
    if (typeof Buffer != "undefined") {
        return (Buffer.isBuffer(string) ? string : Buffer.from(string));
    }
    var byteArray = [];
    for (var index = 0; index < string.length; index++) {
        // return if the argument passed was array of bytes
        if (typeof (string[index]) == "number") {
            return string;
        }
        byteArray[index] = string.charCodeAt(index);
    }
    return byteArray;
}

// A flexible random number generator suitable for both browser and Node.js. Defaults to Alea 
// if secure random generators are unavailable. If randomization is disabled, it will set values to zero 
// for compatibility with legacy systems.
function uintArray(len, randomize) {
    var array = [];
    var generator = null;
    var index = 0;
    if (randomize) {
        try {
            // Using `window.crypto.getRandomValues` for modern browsers
            if ((typeof window != "undefined") && (typeof (window.crypto) != "undefined")) {
                generator = new Uint8Array(len);
                window.crypto.getRandomValues(generator);
                return generator;
            }
            // Using `crypto.randomBytes` for Node.js
            return crypto.randomBytes(len);
        } catch (e) {
            // Using Alea prng
            for (; index < len; index++) {
                generator = Alea(index + 1);
                array[index] = Math.floor(generator.random() * 256);
            }
        }
    } else {
        // Fill array with zeroes
        for (; index < len; index++) {
            array[index] = 0;
        }
    }
    return array;
}

// Ensures compatibility with legacy environments where `Array.prototype.slice()` may not exist.
function arraySlice(array, start, end) {
    start = (typeof start == "undefined") ? 0 : (start < 0 ? array.length + start : start);
    end = (typeof end == "undefined") ? array.length : (end < 0 ? array.length + end : end);
    try {
        return array.slice(start, end);
    } catch (e) {
        var result = [];
        for (var index = start; (index < end) && (index < array.length) && (index >= 0); index++) {
            result.push(array[index]);
        }
        return result;
    }
}