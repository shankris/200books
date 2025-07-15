"use client";

import { useState } from "react";
import styles from "./UploadPage.module.css";
import FreeTextSearch from "@/components/BookSearch/FreeTextSearch";
import SelectedBook from "@/components/BookSearch/SelectedBook"; // ✅ Don't forget this

export default function UploadPage() {
  const [selectedFreeTextBook, setSelectedFreeTextBook] = useState(null);

  return (
    <div className={styles.container}>
      <h1 className='pageHeadding'>Recommend Your Favourite Books</h1>
      <div className='subHead'>Search books by title, author or ISBN</div>

      <FreeTextSearch onSelect={setSelectedFreeTextBook} />

      {selectedFreeTextBook && <SelectedBook book={selectedFreeTextBook} />}
    </div>
  );
}
