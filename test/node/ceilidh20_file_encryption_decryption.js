const fs = require('fs');
const crypto = require('crypto');
const { Mash, Alea, Sha256, toBytes, toChars, uintArray, arraySlice, hexToBytes, get32, rotl, Ceilidh20_main, Ceilidh20 } = require('./src/ceilidh20');

// Generate random key, IV, and nonce
const key = crypto.randomBytes(32); // 32 bytes key
const iv = crypto.randomBytes(32);  // 32 bytes IV
const nonce = crypto.randomBytes(24); // 24 bytes nonce
const genIVLen = 32;

// Display the key, IV, and nonce
console.log("Key:", key.toString('hex'));
console.log("IV:", iv.toString('hex'));
console.log("Nonce:", nonce.toString('hex'));

// Read the file data
const fileData = fs.readFileSync("sample.png");

// Encrypt the data
console.time("Encryption Time");
const encryptedOutput = Ceilidh20(fileData, {
    key: key,           // 32-byte key
    iv: iv,             // initialization vector
    nonce: nonce,       // 24-byte nonce
    genIVLen: genIVLen, // generated IV pair length
    isEncrypt: true     // Encrypt binary
});
console.timeEnd("Encryption Time");

// Write encrypted file
fs.writeFileSync("sample.png.encrypted", encryptedOutput);

// Read encrypted file data
const encryptedFileData = fs.readFileSync("sample.png.encrypted");

// Decrypt the data
console.time("Decryption Time");
const decryptedOutput = Ceilidh20(encryptedFileData, {
    key: key,           // 32-byte key
    iv: iv,             // initialization vector
    nonce: nonce,       // 24-byte nonce
    genIVLen: genIVLen, // generated IV pair length
    isEncrypt: false    // Decrypt binary
});
console.timeEnd("Decryption Time");

// Write decrypted file
fs.writeFileSync("sample.png.decrypted", decryptedOutput);
