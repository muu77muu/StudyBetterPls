"use client";

import { useEffect, useState } from "react";

type File = {
    key: string;
    name: string;
    size: number;
    last_modified: string;
}

type DocumentResponse = {
    media: File[];
    notes: File[];
}

const tableStyle = {
  borderCollapse: "collapse" as const,
};

const cellStyle = {
  border: "1px solid black",
  padding: "8px",
};

const imageExtensions = new Set(["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg", "avif", "ico"]);


export default function documents() {  
    
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<DocumentResponse | null>(null);


    useEffect(() => {
        handleDocuments();
    }, []);

    async function handleDocuments() {
        try {
            const response = await fetch("/api/documents", {
                method: "GET",
            });
            const res = await response.json();
            setData(res);
        } catch (error) {
            console.error("Error fetching documents:", error);
        } finally {
            setLoading(false);
        }
    }

    function isValidImage(filename: string) {
        const ext = filename.split(".").pop()?.toLowerCase();
        return ext ? imageExtensions.has(ext) : false;
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <main>
            <h1>Documents</h1>
            <h3>Media</h3>
            <table border={1} cellPadding={8} style={tableStyle}> 
                <thead>
                    <tr>
                        <th style={cellStyle}>Name</th>
                        <th style={cellStyle}>Preview</th>
                        <th style={cellStyle}>Size (bytes)</th>
                        <th style={cellStyle}>Last Modified</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.media.filter((file) => file.name).map((file) => (
                        <tr key={file.key}>
                            <td style={cellStyle}>{file.name}</td>
                            <td style={cellStyle}>
                                {isValidImage(file.name) && (
                                    <img src={`/api/upload/media/${file.key}`} 
                                    alt={file.name} style={{ maxWidth: "100px", maxHeight: "100px" }} />
                                )}
                            </td>
                            <td style={cellStyle}>{file.size}</td>
                            <td style={cellStyle}>{file.last_modified}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3>Notes</h3>
            <table border={3} cellPadding={8} style={tableStyle}>
                <thead>
                    <tr>
                        <th style={cellStyle}>Name</th>
                        <th style={cellStyle}>Size (bytes)</th>
                        <th style={cellStyle}>Last Modified</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.notes.filter((file) => file.name).map((file) => (
                        <tr key={file.key}>
                            <td style={cellStyle}>{file.name}</td>
                            <td style={cellStyle}>{file.size}</td>
                            <td style={cellStyle}>{file.last_modified}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    );
}