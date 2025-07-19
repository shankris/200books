import { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import styles from "./EditBookModal.module.css";

export default function EditBookModal({ book, onClose, onSave }) {
  const [form, setForm] = useState({ title: "", author: "", category: "" });

  useEffect(() => {
    if (book) {
      setForm({
        title: book.title || "",
        author: Array.isArray(book.author) ? book.author.join(", ") : book.author || "",
        category: book.category || "",
      });
    }
  }, [book]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const ref = doc(db, "books", book.id);
      await updateDoc(ref, {
        title: form.title,
        author: form.author.split(",").map((a) => a.trim()),
        category: form.category,
      });
      onSave();
      onClose();
    } catch (error) {
      console.error("Error saving book:", error);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>Edit Book</h3>
        <input
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder='Title'
          className={styles.input}
        />
        <input
          value={form.author}
          onChange={(e) => handleChange("author", e.target.value)}
          placeholder='Authors (comma-separated)'
          className={styles.input}
        />
        <input
          value={form.category}
          onChange={(e) => handleChange("category", e.target.value)}
          placeholder='Category'
          className={styles.input}
        />
        <div className={styles.actions}>
          <button
            onClick={onClose}
            className={styles.button}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className={styles.button}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
