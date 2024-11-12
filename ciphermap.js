function cipherMapEncryptChar(char, map) {
    const charIndex = map.indexOf(char.toUpperCase());
    if (charIndex !== -1) {
        return map[charIndex];
    }
    return char;  // Giữ nguyên nếu không tìm thấy trong bản đồ
}

function cipherMapEncryptText(text, map) {
    return text.split("").map(char => cipherMapEncryptChar(char, map)).join("");
}
function cipherMapDecryptChar(char, map) {
    const charIndex = map.indexOf(char.toUpperCase());
    if (charIndex !== -1) {
        return String.fromCharCode(charIndex + 65);  // Giả sử chữ cái A-Z
    }
    return char;  // Giữ nguyên nếu không tìm thấy trong bản đồ
}

function cipherMapDecryptText(text, map) {
    return text.split("").map(char => cipherMapDecryptChar(char, map)).join("");
}
