"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import "@/app/styles/upload.css";

const MAX_FILE_SIZE_MB = 20;

export default function UploadPage() {
    const { getToken } = useAuth();

    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [notesFile, setNotesFile] = useState<File | null>(null);

    const [uploadingMedia, setUploadingMedia] = useState(false);
    const [uploadingNotes, setUploadingNotes] = useState(false);

    const [message, setMessage] = useState("");

    async function upload(file: File, type: "media" | "notes") {
        if (!file) return;

        if (type === "media") {
            setUploadingMedia(true);
        } else {
            setUploadingNotes(true);
        }

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

            setMessage(
                `${type === "media" ? "Media" : "Notes"} uploaded successfully!\nFile ID: ${data.file_id}`
            );
        } catch (err) {
            if (err instanceof Error) {
                setMessage(err.message);
            } else {
                setMessage("Upload failed.");
            }
        } finally {
            if (type === "media") {
                setUploadingMedia(false);
            } else {
                setUploadingNotes(false);
            }
        }
    }

    function validateFile(
        e: React.ChangeEvent<HTMLInputElement>,
        setter: (file: File | null) => void
    ) {
        if (!e.target.files) return;

        const selected = e.target.files[0];

        if (selected.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            alert(`File size exceeds ${MAX_FILE_SIZE_MB}MB.`);
            return;
        }

        setter(selected);
        setMessage("");
    }

    return (
        <main className="upload-page">
            <section className="upload-hero">
                <h1>Upload Learning Materials</h1>
                <p>
                    Upload your media and notes for processing. Maximum file size:
                    {" "}
                    {MAX_FILE_SIZE_MB}MB.
                </p>
            </section>

            <section className="upload-grid">
                {/* ================= MEDIA ================= */}
                <div className="upload-card">
                    <div className="upload-card-header">
                        <div className="upload-icon">📹</div>

                        <div>
                            <h2>Media</h2>
                            <p>
                                Videos, audio recordings, images, presentations and
                                other learning resources.
                            </p>
                        </div>
                    </div>

                    <input
                        id="media-upload"
                        type="file"
                        className="hidden-file-input"
                        onChange={(e) => {
                            if (!e.target.files) return;

                            const selectedFile = e.target.files[0];

                            if (
                                selectedFile.size >
                                MAX_FILE_SIZE_MB * 1024 * 1024
                            ) {
                                alert(
                                    `File size exceeds ${MAX_FILE_SIZE_MB}MB.`
                                );
                                return;
                            }

                            setMediaFile(selectedFile);
                            setMessage("");
                        }}
                    />

                    <label
                        htmlFor="media-upload"
                        className="upload-dropzone"
                    >
                        <span className="upload-dropzone-icon">📁</span>
                        <strong>Select Media</strong>
                        <small>Click to browse your device</small>
                    </label>

                    <div className="upload-file-display">
                        {mediaFile ? (
                            <>
                                <strong>{mediaFile.name}</strong>

                                <span>
                                    {(mediaFile.size / 1024 / 1024).toFixed(2)} MB
                                </span>
                            </>
                        ) : (
                            <span>No file selected</span>
                        )}
                    </div>

                    <button
                        className="upload-button"
                        onClick={() =>
                            mediaFile && upload(mediaFile, "media")
                        }
                        disabled={!mediaFile || uploadingMedia}
                    >
                        {uploadingMedia
                            ? "Uploading..."
                            : "Upload Media"}
                    </button>
                </div>

                {/* ================= NOTES ================= */}

                <div className="upload-card">
                    <div className="upload-card-header">
                        <div className="upload-icon">📝</div>

                        <div>
                            <h2>Notes</h2>
                            <p>
                                Lecture notes, PDFs, handwritten notes and study
                                materials.
                            </p>
                        </div>
                    </div>

                    <input
                        id="notes-upload"
                        type="file"
                        className="hidden-file-input"
                        onChange={(e) =>
                            validateFile(e, setNotesFile)
                        }
                    />

                    <label
                        htmlFor="notes-upload"
                        className="upload-dropzone"
                    >
                        <span className="upload-dropzone-icon">📝</span>
                        <strong>Select Notes</strong>
                        <small>Click to browse your device</small>
                    </label>

                    <div className="upload-file-display">
                        {notesFile ? (
                            <>
                                <strong>{notesFile.name}</strong>

                                <span>
                                    {(notesFile.size / 1024 / 1024).toFixed(2)} MB
                                </span>
                            </>
                        ) : (
                            <span>No file selected</span>
                        )}
                    </div>

                    <button
                        className="upload-button"
                        onClick={() =>
                            notesFile && upload(notesFile, "notes")
                        }
                        disabled={!notesFile || uploadingNotes}
                    >
                        {uploadingNotes
                            ? "Uploading..."
                            : "Upload Notes"}
                    </button>
                </div>
            </section>

            {message && (
                <section className="upload-message">
                    {message}
                </section>
            )}
        </main>
    );
}