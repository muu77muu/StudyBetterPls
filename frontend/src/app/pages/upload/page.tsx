"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";

const MAX_FILE_SIZE_MB = 20; // 20MB limit

export default function upload() {  
    const { getToken, userId } = useAuth();
    
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");

    async function handleUpload() {
        if (!file) {
            setMessage("Please select a file to upload.");
            return;
        }

        setUploading(true);
        setMessage("");

        try {
            const token = await getToken();
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || data.error || "Upload failed");
            }

            setMessage(`Uploaded successfully!\nFile ID: ${data.file_id}`);

        } catch (err) {
            if (err instanceof Error) {
                setMessage(err.message);
            } else {
                setMessage("Upload failed.");
            }
        } finally {
            setUploading(false);
        }
    }

    return (
        <main>
            <h1>Upload document</h1>
            <input type="file" onChange={(e) => {
                if (!e.target.files) return;
                const selectedFile = e.target.files[0];

                if (selectedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) { // 20MB limit
                    alert(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit.`);
                    return;
                }
                setFile(selectedFile);
                setMessage("");
            }} />

            {file &&  (
                <div className="mt-3">
                    <p>{file.name}</p>
                    <p>{(file.size / 1024 / 1024).toFixed(3)} MB</p>
                </div>
            )}

            <button onClick={handleUpload} disabled={!file || uploading}>{uploading ? "Uploading..." : "Upload here"}</button>

            {message && <p className="mt-4">{message}</p>}
        </main>
    );
}