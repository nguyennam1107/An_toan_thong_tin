// Generate RSA keys
function generateRSAKeys(p, q) {
    p = bigInt(p);  // Ensure p is a big integer
    q = bigInt(q);  // Ensure q is a big integer

    const n = p.multiply(q); // n = p * q
    const phi = p.minus(1).multiply(q.minus(1)); // phi = (p-1)*(q-1)

    console.log(`Generated n: ${n}, phi: ${phi}`);  // Log n and phi

    let e = bigInt(17); // We can start with a fixed e, typically 17 or 65537
    while (bigInt.gcd(e, phi).notEquals(1)) {
        e = e.add(2);
    }

    console.log(`Selected e: ${e}`);

    const d = e.modInv(phi);

    console.log(`Calculated d: ${d}`);

    return { publicKey: { e, n }, privateKey: { d, n } };
}

// RSA Encrypt Function (Using Public Key)
function rsaEncrypt(text, publicKey) {
    const { e, n } = publicKey;
    return text.split("").map(char => {
        const m = bigInt(char.charCodeAt(0));  // Convert char to ASCII code
        const c = m.modPow(e, n); // c = m^e mod n
        return c.toString();  // Convert encrypted value to string (to make it readable or storable)
    });
}

// RSA Decrypt Function (Using Private Key)
function rsaDecrypt(encryptedArray, privateKey) {
    const { d, n } = privateKey;
    return encryptedArray.map(c => {
        const m = bigInt(c);  // Convert string back to big integer
        const decryptedValue = m.modPow(d, n);  // m = c^d mod n
        return String.fromCharCode(decryptedValue.valueOf());  // Convert back to character
    }).join("");  // Join the decrypted characters into a string
}

// Example Usage
const p = 61; // Example prime p
const q = 53; // Example prime q
const { publicKey, privateKey } = generateRSAKeys(p, q);

const text = "HELLO";

// Encrypt the text
const encryptedText = rsaEncrypt(text, publicKey);
console.log("Encrypted Text:", encryptedText);

// Decrypt the text
const decryptedText = rsaDecrypt(encryptedText, privateKey);
console.log("Decrypted Text:", decryptedText);
