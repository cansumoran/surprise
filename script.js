document.getElementById("unlock-btn").addEventListener("click", function () {
    let password = document.getElementById("password-input").value;
    if (!password) {
        document.getElementById("error-message").textContent = "Oops yanlış cevap! The liste'yi kontrol ediniz.";
        return;
    }

    fetch("secret.enc")
    .then(response => response.text())
    .then(encryptedText => {
        encryptedText = encryptedText.trim();
        let decryptedText = decryptFile(encryptedText, password);

        if (decryptedText) {
            document.getElementById("password-screen").style.display = "none";
            document.getElementById("content-screen").style.display = "block";
            typewriterEffect(decryptedText);
        } else {
            document.getElementById("error-message").textContent = "Oops yanlış cevap! The liste'yi kontrol ediniz.";
        }
    })
    .catch(error => {
        console.error("Error loading encrypted file:", error);
        document.getElementById("error-message").textContent = "Error loading file.";
    });
});


function decodeBase64UTF8(base64) {
    try {
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        const decoder = new TextDecoder('utf-8');
        return decoder.decode(bytes);
    } catch (error) {
        console.error("Decoding Error:", error);
        return null;
    }
}

function decryptFile(encryptedText, password) {
    try {
        if (!encryptedText || !password) {
            throw new Error("Missing encrypted text or password");
        }
        const decrypted = CryptoJS.AES.decrypt(encryptedText.toString(), password).toString(CryptoJS.enc.Utf8);
        const decryptedText = JSON.parse(decrypted);

        if (!decryptedText) {
            console.error("Decryption failed! Check your password.");
            return;
        }
        console.log("File decrypted successfully!");

        //const decodedText = atob(decryptedText.fileData.trim());

        const decodedText = decodeBase64UTF8(decryptedText.base64Data.trim()); // Convert from Base64 back to UTF-8

        console.log(decodedText);
        return decodedText;

    } catch (error) {
        console.error("Decryption Error:", error);
        return null;
    }
}

// Typewriter effect
function typewriterEffect(text) {
    let display = document.getElementById("text-display");
    let index = 0;

    function typeNextChar() {
        if (index < text.length) {
            display.textContent += text[index];
            index++;
            setTimeout(typeNextChar, 50); // Adjust speed here
        } else {
            document.getElementById("final-gif").style.display = "block";
        }
    }

    typeNextChar();
}
