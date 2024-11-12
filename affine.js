function modInverse(a, m) {
    for (let i = 1; i < m; i++) {
        if ((a * i) % m === 1) {
            return i;
        }
    }
    return -1; 
}
function affineEncryptChar(char, a, b) {
    let charCode = char.charCodeAt(0);
    let base = 65;  // ASCII của 'A'

    // Kiểm tra nếu ký tự là chữ cái in hoa
    if (charCode >= 65 && charCode <= 90) {
        charCode -= base;
    }
    // Kiểm tra nếu ký tự là chữ cái in thường
    else if (charCode >= 97 && charCode <= 122) {
        base = 97;  // ASCII của 'a'
        charCode -= base;
    } else {
        return char;  // Nếu không phải là chữ cái, giữ nguyên
    }

    // Mã hóa
    const encryptedCode = (a * charCode + b) % 26;
    return String.fromCharCode(encryptedCode + base);
}




function affineDecryptChar(char, a, b, mod) {
    const aInverse = modInverse(a, mod);
    let charCode = char.charCodeAt(0);
    let base = 65;  // ASCII của 'A'

    // Kiểm tra nếu ký tự là chữ cái in hoa
    if (charCode >= 65 && charCode <= 90) {
        charCode -= base;
    }
    // Kiểm tra nếu ký tự là chữ cái in thường
    else if (charCode >= 97 && charCode <= 122) {
        base = 97;  // ASCII của 'a'
        charCode -= base;
    } else {
        return char;  // Nếu không phải là chữ cái, giữ nguyên
    }

    // Giải mã
    const decryptedCode = (aInverse * (charCode - b + mod)) % mod;
    return String.fromCharCode(decryptedCode + base);
}