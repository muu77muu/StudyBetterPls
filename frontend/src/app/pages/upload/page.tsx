"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import "@/app/styles/upload.css";

const MAX_FILE_SIZE_MB = 20;

const ALLOWED_NOTES = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
    "text/plain",
    "text/markdown",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.ms-powerpoint",
    "text/csv",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

const ALLOWED_MEDIA = [
    "audio/mp4",
    "audio/wav",
    "audio/ogg",
    "image/jpeg",
    "image/png",
    "image/webp",
];

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
            formData.append("type", type);

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
    type: "media" | "notes",
    setter: (file: File | null) => void
) {
    const selected = e.target.files?.[0];

    if (!selected) return;

    const allowed = type === "media" ? ALLOWED_MEDIA : ALLOWED_NOTES;

    if (!allowed.includes(selected.type)) {
        alert("Unsupported file type.");
        e.target.value = "";
        return;
    }

    if (selected.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        alert(`File size exceeds ${MAX_FILE_SIZE_MB}MB.`);
        e.target.value = "";
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
                <div className="upload-card">
                    <div className="upload-card-header">
                        <div className="upload-icon">📹</div>
                        <div>
                            <h2>Media</h2>
                            <p>Audio recordings, images, and voice notes.
                            </p>
                        </div>
                    </div>

                    <input
                        id="media-upload"
                        type="file"
                        className="hidden-file-input"
                        accept="
                            audio/mpeg,
                            audio/mp4,
                            audio/wav,
                            audio/ogg,
                            image/jpeg,
                            image/png,
                            image/webp
                        "
                        onChange={(e) => {
                            validateFile(e, "media", setMediaFile)
                        }}
                    />

                    <p><i>Files format accepted: .jpg, .jpeg, .png, .webp, .wav, .ogg, .mp3, .mp4 (audio only)</i></p>
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

                <div className="upload-card">
                    <div className="upload-card-header">
                        <div className="upload-icon">📝</div>
                        <div>
                            <h2>Notes</h2>
                            <p>Lecture notes, powerpoints, sheets, and study materials.</p>
                        </div>
                    </div>

                    <input
                        id="notes-upload"
                        type="file"
                        className="hidden-file-input"
                        accept="
                            .pdf,
                            .doc,
                            .docx,
                            .txt,
                            .md,
                            .ppt,
                            .pptx,
                            .csv,
                            .xlsx
                        "
                        onChange={(e) =>
                            validateFile(e, "notes", setNotesFile)
                        }
                    />

                    <p><i>Files format accepted: .pdf, .docx, .doc, .txt, .md, .pptx, .ppt, .csv, .xlsx</i></p>
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