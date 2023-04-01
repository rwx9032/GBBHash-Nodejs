const crypto = require('crypto');
const fs = require('fs');
const debug = false;


function toUTF32(str) {
    str = str.toString('utf8');
    let result = Buffer.alloc(str.length * 4);
    for (let i = 0; i < str.length; i++) {
        result.writeUInt32LE(str.charCodeAt(i), i * 4);
    }
    return result;
}



function obfuscateString(input, seed) {
    let data = `${seed}${input}`;
    let buffer = toUTF32(data);
    buffer = crypto.createHash('sha1').update(buffer).digest();
    return sha1ToBeeStr(buffer);
}


function sha1ToBeeStr(hash) {
    let stringBuilder = [];
    let num2 = 4;
    let num3 = 0;

    for (let i = 0; i < 6; i++) {
        let num4 = hash[i];
        let j = 8;

        while (j > 0) {
            if (num2 === 0) {
                stringBuilder.push(getChar(65 + num3));
                num3 = 0;
                num2 = 4;
            }

            let num5 = Math.min(j, num2);
            let num6 = Math.pow(2, num5);
            num3 += num4 % num6;
            num2 -= num5;
            num3 <<= num2;
            j -= num5;
            num4 >>= num5;
        }
    }

    return stringBuilder.join('');
}

function getChar(value) {
    let num = 0;

    const charSet = [33, 35, 36, 37, 38, 47, 92, 95, 46, 0];
    for (const num2 of charSet) {
        if (value + num >= num2 && 65 <= num2) {
            num++;
        }
    }

    return String.fromCharCode(value + num);
}


if (debug) {
    let result = obfuscateString('_', '69f38d77aa560f61');
    console.log(result);
    console.log(result == 'FDOMDBBNIDH');
}
else if (process.argv.length < 4) {
    console.log('A obfuscator to obfuscate string with seed.');
    console.log('Usage: node obf.js <string> <seed>');
    process.exit(1);
}
else {
    console.log(obfuscateString(process.argv[2], process.argv[3]));
}
