"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import book from "@/data/sampleBook.json";
import styles from "./UploadPage.module.css";

export default function UploadPage() {
  const [status, setStatus] = useState("idle");

  const handleUpload = async () => {
    try {
      setStatus("uploading");
      const ref = doc(db, "books", book.id);
      await setDoc(ref, book);
      setStatus("success");
    } catch (error) {
      console.error("Upload failed:", error);
      setStatus("error");
    }
  };

  return (
    <div className={styles.container}>
      <h2>📘 Preview Book</h2>

      <pre className={styles.preview}>{JSON.stringify(book, null, 2)}</pre>

      <button
        className={styles.button}
        onClick={handleUpload}
      >
        Upload to Firebase
      </button>

      {status === "success" && <p className={styles.statusSuccess}>✅ Upload successful!</p>}
      {status === "error" && <p className={styles.statusError}>❌ Upload failed. See console.</p>}
      {status === "uploading" && <p>⏳ Uploading...</p>}
    </div>
  );
}
