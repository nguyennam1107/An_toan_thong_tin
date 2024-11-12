function showSection(sectionId) {
    // Ẩn tất cả các section
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Hiển thị section được chọn
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }
}

function showAlert(message, type = "error") {
    const alertBox = document.getElementById("alertBox");
    alertBox.style.display = "block";
    alertBox.textContent = message;
    alertBox.className = type === "error" ? "alert-error" : "alert-success";
}

function clearAlert() {
    const alertBox = document.getElementById("alertBox");
    alertBox.style.display = "none";
    alertBox.textContent = "";
}
function isValidKeyLength(key) {
    console.log(key.length);
    return key.length === 4 || key.length === 9; 
}
function encrypt() {  
    clearAlert(); 
    const key = document.getElementById("key").value;  
    if (isValidKeyLength(key)) {  
        const matrixKey = createMatrix(key);
        if (checkMatrixInvertibility(matrixKey)) {
            const text = document.getElementById("text").value;  
            const result = hillCipherEncrypt(key, text);  
            document.getElementById("result").value = result;     
        }
        else {
            showAlert("Khóa không tồn tại ma trận đảo của chính nó.");
            return;
        }
    } else {
        showAlert("Khóa phải có độ dài phù hợp (4 ký tự cho ma trận 2x2 hoặc 9 ký tự cho ma trận 3x3).");
        return;
    }
}  
function validatePrimes(p, q) {
    if (p <= 1 || q <= 1 || !isPrime(p) || !isPrime(q)) {
        alert("p và q phải là các số nguyên tố hợp lệ.");
        return false;
    }
    return true;
}

function isPrime(num) {
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) {
            return false;
        }
    }
    return num > 1;
}


function decrypt() {  
    clearAlert(); 
    const key = document.getElementById("keyDecrypt").value;
    if (isValidKeyLength(key)) {  
        const matrixKey = createMatrix(key);
        if (checkMatrixInvertibility(matrixKey)) {
            const text = document.getElementById("textDecrypt").value;  
            const result = hillCipherDecrypt(key, text);  
            document.getElementById("result").value = result; 
        
        }
        else {
            showAlert("Khóa không tồn tại ma trận đảo của chính nó.");
            return;
        } 
    } else {
        showAlert("Khóa phải có độ dài phù hợp (4 ký tự cho ma trận 2x2 hoặc 9 ký tự cho ma trận 3x3).");
        return;
    }
}  
function generateAndDisplayKeys() {
    const p = document.getElementById("rsaP").value;
    const q = document.getElementById("rsaQ").value;

    if (!p || !q || isNaN(p) || isNaN(q)) {
        alert("Vui lòng nhập đầy đủ và đúng các giá trị p và q.");
        return;
    }
    if (!validatePrimes(p, q)) {
        return;
    }
    // Tạo khóa từ p và q
    const { publicKey, privateKey } = generateRSAKeys(p, q);

    // Hiển thị khóa công khai
    document.getElementById("publicKeyDisplay").innerText = `e = ${publicKey.e}, n = ${publicKey.n}`;

    // Hiển thị khóa riêng
    document.getElementById("privateKeyDisplay").innerText = `d = ${privateKey.d}, n = ${privateKey.n}`;

    // Điền vào các ô nhập liệu khóa công khai (e, n) để mã hóa
    document.getElementById("rsaPublicE").value = publicKey.e;
    document.getElementById("rsaPublicN").value = publicKey.n;

    // Điền vào các ô nhập liệu khóa riêng (d, n) để giải mã
    document.getElementById("rsaPrivateD").value = privateKey.d;
    document.getElementById("rsaPrivateN").value = privateKey.n;
}

// Hàm Mã hóa RSA
function encryptRSA() {
    const publicKey = {
        e: bigInt(document.getElementById("rsaPublicE").value),
        n: bigInt(document.getElementById("rsaPublicN").value)
    };

    const text = document.getElementById("rsaPlainText").value;

    if (!text) {
        alert("Vui lòng nhập văn bản để mã hóa.");
        return;
    }

    // Mã hóa văn bản
    const encryptedTextArray = rsaEncrypt(text, publicKey);
    console.log("Encrypted Text (as numbers):", encryptedTextArray);

    // Hiển thị kết quả
    document.getElementById("result").value = encryptedTextArray.map(num => num.toString()).join(", ");
}

// Hàm Giải mã RSA
function decryptRSA() {
    const privateKey = {
        d: bigInt(document.getElementById("rsaPrivateD").value),
        n: bigInt(document.getElementById("rsaPrivateN").value)
    };

    const encryptedText = document.getElementById("rsaCipherText").value;
    const encryptedArray = encryptedText.split(", ").map(num => bigInt(num));

    if (!encryptedText) {
        alert("Vui lòng nhập mã đã mã hóa.");
        return;
    }

    // Giải mã văn bản
    const decryptedText = rsaDecrypt(encryptedArray, privateKey);
    console.log("Decrypted Text:", decryptedText);

    // Hiển thị kết quả
    document.getElementById("result").value = decryptedText;
}
function affineEncryptText(text, a, b) {
    return text.split("").map(char => affineEncryptChar(char, a, b)).join("");
}
function encryptAffine() {
    const plaintext = document.getElementById("affinePlainText").value;
    const a = parseInt(document.getElementById("affineKeyA").value);
    const b = parseInt(document.getElementById("affineKeyB").value);
    const encryptedText = affineEncryptText(plaintext, a, b);
    document.getElementById("result").textContent = encryptedText;
}
function affineDecryptText(text, a, b, mod) {
    return text.split("").map(char => affineDecryptChar(char, a, b, mod)).join("");
}
function decryptAffine() {
    const ciphertext = document.getElementById("affineCipherText").value;
    const a = parseInt(document.getElementById("affineKeyADecrypt").value);
    const b = parseInt(document.getElementById("affineKeyBDecrypt").value);
    const mod = 26;
    const decryptedText = affineDecryptText(ciphertext, a, b, mod);
    document.getElementById("result").textContent = decryptedText;
}
function encryptCipherMap() {
    const plaintext = document.getElementById("cipherMapPlainText").value;
    const map = document.getElementById("cipherMapKey").value;
    const encryptedText = cipherMapEncryptText(plaintext, map);
    document.getElementById("result").textContent = encryptedText;
}

function decryptCipherMap() {
    const ciphertext = document.getElementById("cipherMapCipherText").value;
    const map = document.getElementById("cipherMapKeyDecrypt").value;
    const decryptedText = cipherMapDecryptText(ciphertext, map);
    document.getElementById("result").textContent = decryptedText;
}

window.onload = function() {  
    showSection('encryptSection');  
}  
