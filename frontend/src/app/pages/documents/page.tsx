"use client";

import { useEffect, useState } from "react";
import "@/app/styles/documents.css";

type DocumentFile = {
  id: string;
  filename: string;
  size: number;
  content_type: string;
  created_at: string;
};

type DocumentResponse = {
  media: DocumentFile[];
  notes: DocumentFile[];
};

const imageExtensions = new Set([
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "bmp",
  "svg",
  "avif",
  "ico",
]);

export default function DocumentsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DocumentResponse>({
    media: [],
    notes: [],
  });

  useEffect(() => {
    fetchDocuments();
  }, []);

  async function fetchDocuments() {
    try {
      const response = await fetch("/api/documents");

      if (!response.ok) {
        throw new Error("Failed to fetch documents");
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function isValidImage(filename: string) {
    const ext = filename.split(".").pop()?.toLowerCase();
    return ext ? imageExtensions.has(ext) : false;
  }

  function formatBytes(bytes: number) {
    if (bytes === 0) return "0 B";

    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

  function formatDate(date: string) {
    return new Intl.DateTimeFormat("en-SG", {
      timeZone: "Asia/Singapore",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(date));
  }

  if (loading) {
    return (
      <main className="documents">
        <div className="loading-state">
          <h2>Loading documents...</h2>
        </div>
      </main>
    );
  }

  return (
    <main className="documents">
      <section className="hero">
        <h1>📄 Documents</h1>
        <p>Browse, preview and download your uploaded study materials.</p>
      </section>

      <section className="stats-grid">
        <div className="stat-card">
          <h2>{data.media.length}</h2>
          <p>Media Files</p>
        </div>

        <div className="stat-card">
          <h2>{data.notes.length}</h2>
          <p>Notes</p>
        </div>

        <div className="stat-card">
          <h2>{data.media.length + data.notes.length}</h2>
          <p>Total Documents</p>
        </div>
      </section>

      <section className="document-section">
        <div className="section-header">
          <h2>🖼 Media</h2>
          <span>{data.media.length} files</span>
        </div>

        {data.media.length === 0 ? (
          <div className="empty-state">
            <h3>No media uploaded</h3>
            <p>Your uploaded images will appear here.</p>
          </div>
        ) : (
          <div className="document-grid">
            {data.media
              .filter((file) => file.filename)
              .map((file) => (
                <div className="document-card" key={file.id}>
                  <div className="preview">
                    {isValidImage(file.filename) ? (
                      <img
                        src={`/api/documents/${file.id}`}
                        alt={file.filename}
                      />
                    ) : (
                      <div className="file-icon">📄</div>
                    )}
                  </div>

                  <div className="document-info">
                    <h3>{file.filename}</h3>

                    <div className="meta">
                      <span>{formatBytes(file.size)}</span>
                      <span>•</span>
                      <span>{formatDate(file.created_at)}</span>
                    </div>
                  </div>

                  <a
                    href={`/api/documents/${file.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="open-button"
                  >
                    Open →
                  </a>
                </div>
              ))}
          </div>
        )}
      </section>

      <section className="document-section">
        <div className="section-header">
          <h2>📝 Notes</h2>
          <span>{data.notes.length} files</span>
        </div>

        {data.notes.length === 0 ? (
          <div className="empty-state">
            <h3>No notes uploaded</h3>
            <p>Your PDFs and notes will appear here.</p>
          </div>
        ) : (
          <div className="document-grid">
            {data.notes
              .filter((file) => file.filename)
              .map((file) => (
                <div className="document-card" key={file.id}>
                  <div className="preview">
                    <div className="file-icon">📄</div>
                  </div>

                  <div className="document-info">
                    <h3>{file.filename}</h3>

                    <div className="meta">
                      <span>{formatBytes(file.size)}</span>
                      <span>•</span>
                      <span>{formatDate(file.created_at)}</span>
                    </div>
                  </div>

                  <a
                    href={`/api/documents/${file.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="open-button"
                  >
                    Open →
                  </a>
                </div>
              ))}
          </div>
        )}
      </section>
    </main>
  );
}