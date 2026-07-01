"use client";

import { useState } from "react";

export default function upload() {  
    
    const [file, setFile] = useState<File | null>(null);

    async function handleUpload() {
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Upload successful:", data);
        } else {
            console.error("Upload failed");
        }
    }

    return (
        <main>
            <h1>Upload</h1>
            <input type="file" onChange={(e) => {
                if (!e.target.files) return;
                const selectedFile = e.target.files[0];
                
                if (selectedFile.size > 20 * 1024 * 1024) { // 10MB limit
                    alert("File size exceeds 20MB limit.");
                    return;
                }
                setFile(selectedFile);
            }} />
            <button onClick={handleUpload}>Upload</button>
        </main>
    );
}