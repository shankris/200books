"use client";

import { useState } from "react";
import styles from "./UploadPage.module.css";
import FreeTextSearch from "@/components/BookSearch/FreeTextSearch";

export default function UploadPage() {
  const [selectedFreeTextBook, setSelectedFreeTextBook] = useState(null);

  return (
    <div className={styles.container}>
      <h1>Recomend Book</h1>

      <FreeTextSearch onSelect={setSelectedFreeTextBook} />

      {selectedFreeTextBook && (
        <div className={styles.preview}>
          <h3>{selectedFreeTextBook.title}</h3>
          <p>
            <strong>Author(s):</strong> {selectedFreeTextBook.authors.join(", ")}
          </p>
          <p>{selectedFreeTextBook.description?.slice(0, 200)}...</p>
        </div>

        /* 🔍 Free Text Search */
        /* 🧠 Auto Suggest Dropdown */
        /* 🔢 ISBN Search */
        /* 📘 Search Results Tabs */
        /* ⬆️ Upload Button */
      )}
    </div>
  );
}
