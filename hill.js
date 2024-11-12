function hillCipherEncrypt(key, text) {
    const matrixSize = key.length === 9 ? 3 : 2;
    const matrixKey = createMatrix(key);
    console.log(`Key Matrix: ${JSON.stringify(matrixKey)}`);
    const matrixText = createTextMatrix(text, matrixSize);
    console.log(`Text Matrix: ${JSON.stringify(matrixText)}`);
    const encryptedMatrix = multiplyMatrices( matrixKey,matrixText);
    const encryptedText = matrixToText(encryptedMatrix);
    
    return encryptedText;  
}
function hillCipherDecrypt(key, text) {  
    const matrixSize = key.length === 9 ? 3 : 2;
    const matrixKey = createMatrix(key);  
    console.log(`Key Matrix: ${JSON.stringify(matrixKey)}`);
    const matrixText = createTextMatrix(text, matrixSize);   
    console.log(`Text Matrix: ${JSON.stringify(matrixText)}`);
    const inverseKey = inverseMatrix(matrixKey,26); 
    console.log(`Inverse Key Matrix: ${JSON.stringify(inverseKey)}`);
    const decryptedMatrix = multiplyMatrices(inverseKey, matrixText);  
    console.log(`Decrypted Matrix: ${JSON.stringify(decryptedMatrix)}`);
    const decryptedText = matrixToText(decryptedMatrix);  

    return decryptedText;  
}

function createMatrix(key) {  
    const keyNumbers = key.split('').map(char => {
        const code = char.toUpperCase().charCodeAt(0) - 65;
        return (code >= 0 && code < 26) ? code : 0; 
    });

    const size = Math.ceil(Math.sqrt(keyNumbers.length)); 

    const matrix = Array.from({ length: size }, (_, i) => 
        Array.from({ length: size }, (_, j) => keyNumbers[i * size + j] || 0)
    );

    return matrix;  
}

function createTextMatrix(text, size) {
    console.log(size);
    const textNumbers = text.toUpperCase().split('').map(char => {
        const code = char.charCodeAt(0) - 65; 
        return (code >= 0 && code < 26) ? code : null; 
    }).filter(num => num !== null);  
    
    
    while (textNumbers.length % size !== 0) {
        textNumbers.push(0); 
    }

    const matrix = [];
    const rows = textNumbers.length / size; 
   
    for (let i = 0; i < size; i++) {
        matrix.push(textNumbers.slice(i * rows, i * rows + rows)); 
    }

    return matrix;
}


function multiplyMatrices(a, b) {
    const aRows = a.length;
    const aCols = a[0].length;
    const bRows = b.length;
    const bCols = b[0].length;

    console.log(aCols, bRows);
    
    if (aCols !== bRows) {
        throw new Error("Số cột của ma trận a phải bằng số hàng của ma trận b.");
    }
    console.log(`Kích thước ma trận kết quả: ${aCols} x ${bRows}`);
    console.log(`ma tran a :${JSON.stringify(a)}`);
    console.log(`ma tran a :${JSON.stringify(b)}`);
    
   
    const result = Array.from({ length: aRows }, () => new Array(bCols).fill(0));

    
    for (let i = 0; i < aRows; i++) {
        for (let j = 0; j < bCols; j++) {
            for (let k = 0; k < aCols; k++) {
                result[i][j] += a[i][k] * b[k][j];
            }
            console.log(`Giá trị trước modulo tại result[${i}][${j}]: ${result[i][j]}`);
            
            result[i][j] = (result[i][j] % 26 + 26) % 26;   
            
            console.log(`Giá trị sau modulo tại result[${i}][${j}]: ${result[i][j]}`);
        }
    }

    return result;
}


function matrixToText(matrix) {  
    return matrix.flat().map(num => {
        const char = String.fromCharCode(num + 65);
        console.log(`Chuyển đổi số ${num} thành ký tự: ${char}`);
        return char;
    }).join('');  
}

function inverseMatrix(matrix, m) {
    const n = matrix.length;
    if (n !== matrix[0].length) throw new Error("Matrix must be square");

    if (n === 2) {
        // Tính định thức
        const det = (matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]) % m;
        const detInv = modInverse(det, m); // Nghịch đảo của định thức

        return [
            [(detInv * matrix[1][1]) % m, (-detInv * matrix[0][1]) % m],
            [(-detInv * matrix[1][0]) % m, (detInv * matrix[0][0]) % m]
        ].map(row => row.map(val => (val + m) % m)); // Đảm bảo giá trị dương
    } else if (n === 3) {
        // Tính định thức
        const det =
            (matrix[0][0] * (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1]) -
             matrix[0][1] * (matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]) +
             matrix[0][2] * (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0])) % m;
        const detInv = modInverse(det, m); // Nghịch đảo của định thức

        // Tạo ma trận phụ hợp (adjugate)
        const adjugate = [
            [
                (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1]) % m,
                -(matrix[0][1] * matrix[2][2] - matrix[0][2] * matrix[2][1]) % m,
                (matrix[0][1] * matrix[1][2] - matrix[0][2] * matrix[1][1]) % m
            ],
            [
                -(matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]) % m,
                (matrix[0][0] * matrix[2][2] - matrix[0][2] * matrix[2][0]) % m,
                -(matrix[0][0] * matrix[1][2] - matrix[0][2] * matrix[1][0]) % m
            ],
            [
                (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0]) % m,
                -(matrix[0][0] * matrix[2][1] - matrix[0][1] * matrix[2][0]) % m,
                (matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]) % m
            ]
        ];

        // Tạo ma trận nghịch đảo
        return adjugate.map(row => row.map(val => (detInv * val % m + m) % m));
    } else {
        throw new Error("Only 2x2 and 3x3 matrices are supported");
    }
}
function modInverse(a, m) {  
    a = (a + m) % m;  
    for (let x = 1; x < m; x++)  
        if ((a * x) % m === 1)  
            return x;  
    return -1;  
}  
function checkMatrixInvertibility(matrix) {
    let det;

    if (matrix.length === 2) {
        det = (matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]) % 26;
    } else if (matrix.length === 3) {
        det = (
            matrix[0][0] * (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1]) -
            matrix[0][1] * (matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]) +
            matrix[0][2] * (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0])
        ) % 26;
    } else {
        throw new Error("Matrix must be 2x2 or 3x3");
    }

    det = (det + 26) % 26; 
    const inverseDet = modInverse(det, 26);
    console.log(`Định thức: ${det}`);
    return inverseDet !== 0;
}

