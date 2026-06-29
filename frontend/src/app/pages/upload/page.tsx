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
                if (e.target.files) {
                    setFile(e.target.files[0]);
                }
            }} />
            <button onClick={handleUpload}>Upload</button>
        </main>
    );
}