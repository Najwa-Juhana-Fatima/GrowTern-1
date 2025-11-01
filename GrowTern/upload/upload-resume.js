const uploadBox = document.getElementById("uploadBox");
const resumeInput = document.getElementById("resumeInput");
const fileDetails = document.getElementById("fileDetails");
const uploadBtn = document.getElementById("uploadBtn");

// Drag & Drop Effects
uploadBox.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadBox.style.borderColor = "#2f48c5";
});

uploadBox.addEventListener("dragleave", () => {
    uploadBox.style.borderColor = "#4361ee";
});

uploadBox.addEventListener("drop", (e) => {
    e.preventDefault();
    resumeInput.files = e.dataTransfer.files;
    handleFile();
});

// File Selection
resumeInput.addEventListener("change", handleFile);

function handleFile() {
    const file = resumeInput.files[0];
    
    if (!file) return;

    if (file.type !== "application/pdf") {
        fileDetails.innerHTML = "<span style='color:red;'>Only PDF allowed</span>";
        return;
    }

    fileDetails.innerHTML = `
        ✅ <strong>${file.name}</strong> (${(file.size / 1024).toFixed(2)} KB)
    `;

    uploadBtn.style.display = "inline-block";
}

// Upload Button Logic (Mock upload)
uploadBtn.addEventListener("click", () => {
    uploadBtn.innerText = "Uploading...";
    uploadBtn.disabled = true;

    setTimeout(() => {
        uploadBtn.innerText = "Upload Successful ✅";
        uploadBtn.style.background = "#00b894";
    }, 1500);
});
