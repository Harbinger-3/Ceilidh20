// Retrieves a 32-bit integer from the buffer by combining 4 consecutive bytes, 
// with each byte being shifted according to its position.
function get32(buffer, index) {
    return (buffer[index++] ^ (buffer[index++] << 8) ^ (buffer[index++] << 16) ^ (buffer[index] << 24));
}

// Rotates a 32-bit value to the left by the specified number of bits (shift).
function rotl(value, shift) {
    return ((value << shift) | (value >>> (32 - shift)));
}

/**** Ceilidh20 MAIN ****/
function Ceilidh20_main(useBuffer, stateVector, constants, blockData, newIV, withIVEncryption) {
    var state = [1634760805, 857760878, 0, 0, 0, 0, 2036477234, 0, 0, 0, 0, 1797285236, 0, 0, 0, 0, 0, 0];
    var outputBuffer = [];
    var tempArray = [];
    var stateIndex = 0;
    var jIndex = 0;
    var ii = 0;

    // Attempt to use Buffer, if available
    if (useBuffer) {
        var output = Buffer.alloc(64);
        outputBuffer = Buffer.alloc(blockData.length);
    } else {
        // Fill with zeroes
        var output = uintArray(64, false);
    }

    state[2] = get32(constants.key, 0);
    state[3] = get32(constants.key, 4);
    state[4] = get32(constants.key, 8);
    state[5] = get32(constants.key, 12);
    state[6] = get32(constants.nonce, 0);
    state[7] = get32(constants.nonce, 4);
    state[8] = get32(constants.nonce, 8);
    state[9] = get32(constants.key, 16);
    state[10] = get32(constants.key, 20);
    state[11] = get32(constants.key, 24);
    state[12] = get32(constants.key, 28);
    state[13] = get32(constants.nonce, 12);
    state[14] = get32(constants.nonce, 16);
    state[15] = get32(constants.nonce, 20);
    state[16] = get32(constants.nonce, 24);

    for (var dataIndex = 0; dataIndex < blockData.length; dataIndex++) {
        if (jIndex == 0 || jIndex == 64) {
            tempArray = tempArray.concat(state);

            for (stateIndex = 0; stateIndex < 20; stateIndex += 2) {
                tempArray[4] = (tempArray[4] ^ rotl(tempArray[0] + tempArray[12], stateVector[0])) >>> 0;
                tempArray[8] = (tempArray[8] ^ rotl(tempArray[4] + tempArray[0], stateVector[1])) >>> 0;
                tempArray[12] = (tempArray[12] ^ rotl(tempArray[8] + tempArray[4], stateVector[2])) >>> 0;
                tempArray[0] = (tempArray[0] ^ rotl(tempArray[12] + tempArray[8], stateVector[3])) >>> 0;
                tempArray[9] = (tempArray[9] ^ rotl(tempArray[5] + tempArray[1], stateVector[0])) >>> 0;
                tempArray[13] = (tempArray[13] ^ rotl(tempArray[9] + tempArray[5], stateVector[1])) >>> 0;
                tempArray[1] = (tempArray[1] ^ rotl(tempArray[13] + tempArray[9], stateVector[2])) >>> 0;
                tempArray[5] = (tempArray[5] ^ rotl(tempArray[1] + tempArray[13], stateVector[3])) >>> 0;
                tempArray[14] = (tempArray[14] ^ rotl(tempArray[10] + tempArray[6], stateVector[0])) >>> 0;
                tempArray[2] = (tempArray[2] ^ rotl(tempArray[14] + tempArray[10], stateVector[1])) >>> 0;
                tempArray[6] = (tempArray[6] ^ rotl(tempArray[2] + tempArray[14], stateVector[2])) >>> 0;
                tempArray[10] = (tempArray[10] ^ rotl(tempArray[6] + tempArray[2], stateVector[3])) >>> 0;
                tempArray[3] = (tempArray[3] ^ rotl(tempArray[15] + tempArray[11], stateVector[0])) >>> 0;
                tempArray[7] = (tempArray[7] ^ rotl(tempArray[3] + tempArray[15], stateVector[1])) >>> 0;
                tempArray[11] = (tempArray[11] ^ rotl(tempArray[7] + tempArray[3], stateVector[2])) >>> 0;
                tempArray[15] = (tempArray[15] ^ rotl(tempArray[11] + tempArray[7], stateVector[3])) >>> 0;
                tempArray[1] = (tempArray[1] ^ rotl(tempArray[0] + tempArray[3], stateVector[0])) >>> 0;
                tempArray[2] = (tempArray[2] ^ rotl(tempArray[1] + tempArray[0], stateVector[1])) >>> 0;
                tempArray[3] = (tempArray[3] ^ rotl(tempArray[2] + tempArray[1], stateVector[2])) >>> 0;
                tempArray[0] = (tempArray[0] ^ rotl(tempArray[3] + tempArray[2], stateVector[3])) >>> 0;
                tempArray[6] = (tempArray[6] ^ rotl(tempArray[5] + tempArray[4], stateVector[0])) >>> 0;
                tempArray[7] = (tempArray[7] ^ rotl(tempArray[6] + tempArray[5], stateVector[1])) >>> 0;
                tempArray[4] = (tempArray[4] ^ rotl(tempArray[7] + tempArray[6], stateVector[2])) >>> 0;
                tempArray[5] = (tempArray[5] ^ rotl(tempArray[4] + tempArray[7], stateVector[3])) >>> 0;
                tempArray[11] = (tempArray[11] ^ rotl(tempArray[10] + tempArray[9], stateVector[0])) >>> 0;
                tempArray[8] = (tempArray[8] ^ rotl(tempArray[11] + tempArray[10], stateVector[1])) >>> 0;
                tempArray[9] = (tempArray[9] ^ rotl(tempArray[8] + tempArray[11], stateVector[2])) >>> 0;
                tempArray[10] = (tempArray[10] ^ rotl(tempArray[9] + tempArray[8], stateVector[3])) >>> 0;
                tempArray[12] = (tempArray[12] ^ rotl(tempArray[15] + tempArray[14], stateVector[0])) >>> 0;
                tempArray[13] = (tempArray[13] ^ rotl(tempArray[12] + tempArray[15], stateVector[1])) >>> 0;
                tempArray[14] = (tempArray[14] ^ rotl(tempArray[13] + tempArray[12], stateVector[2])) >>> 0;
                tempArray[15] = (tempArray[15] ^ rotl(tempArray[14] + tempArray[13], stateVector[3])) >>> 0;
            }

            for (stateIndex = 0; stateIndex < 16; stateIndex++) {
                tempArray[stateIndex] = tempArray[stateIndex] + state[stateIndex];
                output[ii++] = tempArray[stateIndex] & 255;
                output[ii++] = (tempArray[stateIndex] >>> 8) & 255;
                output[ii++] = (tempArray[stateIndex] >>> 16) & 255;
                output[ii++] = (tempArray[stateIndex] >>> 24) & 255;
            }

            tempArray = [];
            ii = 0;
            jIndex = 0;
            state[8] = (state[8] + 1) >>> 0;
            state[9] = (state[8] == 0) ? ((state[9] + 1) >>> 0) : state[9];
        }

        // XOR to plaintext
        if (withIVEncryption) {
            outputBuffer[dataIndex] = (blockData[dataIndex] ^ output[jIndex++]) ^ ((newIV[dataIndex % newIV.length] + dataIndex) % 256);
        } else {
            outputBuffer[dataIndex] = blockData[dataIndex] ^ output[jIndex++];
        }
    }
    state = null;
    return outputBuffer;
}

/**** Ceilidh20 Implementation ****/
function Ceilidh20(data, config) {
    if (!config.key || config.key.length != 32) {
        throw "The key must be defined and 32 bytes long.";
    }
    if (!config.nonce || config.nonce.length != 24) {
        throw "The nonce must be defined and 24 bytes long.";
    }
    if (!config.iv) {
        throw "The IV must be defined.";
    }

    // Ensure the generated IV length is a positive integer. If not, default to 32.
    config.genIVLen = (typeof (config.genIVLen) != "number" || Math.floor(config.genIVLen) <= 0) ? 32 : Math.floor(config.genIVLen);
    // state vector variant handling
    var stateVector = (config.stateVariant && config.stateVariant.length == 4) ? config.stateVariant : [7, 12, 8, 16];
    // Check for support of Buffer.
    var isBufferSupported = (typeof Buffer != "undefined");
    var dataBytes = toBytes(data); // Convert plaintext to bytes (array/buffer)
    var encryptedData = null;

    // attempt to use Buffer, if available
    if (isBufferSupported) {
        config.key = (Buffer.isBuffer(config.key) ? config.key : Buffer.from(config.key));
        config.nonce = (Buffer.isBuffer(config.nonce) ? config.nonce : Buffer.from(config.nonce));
        stateVector = Buffer.from(stateVector);
    }

    if (config.isEncrypt) { // Encryption
        // generate random IV pair
        var generatedIV = uintArray(config.genIVLen, true);
        // Hash user-specified IV with generated IV to form a new IV
        var newIV = hexToBytes(Sha256.hash(toChars(generatedIV) + toChars(config.iv)));

        // Ensure new IV is a Buffer if Buffer support is available
        if (isBufferSupported) {
            newIV = Buffer.isBuffer(newIV) ? newIV : Buffer.from(newIV);
        }

        // encrypt plaintext with key, nonce, and new IV
        var encryptedPart1 = Ceilidh20_main(isBufferSupported, stateVector, config, dataBytes, newIV, 1);
        // encrypt generated IV pair with key and nonce
        var encryptedPart2 = Ceilidh20_main(isBufferSupported, stateVector, config, generatedIV, null, 0);

        // concat two parts: ciphertext and encrypted IV pair
        if (isBufferSupported) {
            encryptedData = Buffer.concat([encryptedPart1, encryptedPart2]); // buffer
        } else {
            encryptedData = encryptedPart1.concat(encryptedPart2); // regular array
        }
    } else { // Decryption
        // Obtain the c2, that's encrypted IV pair we need
        if (isBufferSupported) {
            var ciphertext2 = dataBytes.slice(dataBytes.length - config.genIVLen); // buffer
        } else {
            var ciphertext2 = arraySlice(dataBytes, -config.genIVLen); // regular array
        }

        // decrypt that c2 with key and nonce
        var generatedIV = Ceilidh20_main(isBufferSupported, stateVector, config, ciphertext2, null, 0);
        // Hash user-specified IV with generated IV to form a new IV
        var newIV = hexToBytes(Sha256.hash(toChars(generatedIV) + toChars(config.iv)));

        // Remove the encrypted IV pair from the ciphertext
        if (isBufferSupported) {
            // Ensure new IV is a Buffer if Buffer support is available
            newIV = Buffer.isBuffer(newIV) ? newIV : Buffer.from(newIV);
            dataBytes = dataBytes.slice(0, dataBytes.length - config.genIVLen); // buffer
        } else {
            dataBytes = arraySlice(dataBytes, 0, -config.genIVLen); // regular array
        }

        // decrypt ciphertext with key, nonce, and new IV
        encryptedData = Ceilidh20_main(isBufferSupported, stateVector, config, dataBytes, newIV, 1);
    }

    newIV = null;
    data = null;
    return encryptedData;
}
