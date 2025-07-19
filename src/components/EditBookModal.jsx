import { useState, useEffect } from "react";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import styles from "./EditBookModal.module.css";

export default function EditBookModal({ book, onClose, onSave }) {
  const [form, setForm] = useState({});

  useEffect(() => {
    if (book) {
      const clone = { ...book };
      delete clone.id;

      const parsed = {
        title: clone.title || "",
        author: Array.isArray(clone.author) ? clone.author.join(", ") : clone.author || "",
        shortDescription: clone.shortDescription || "",
        description: clone.description || "",
        genre: Array.isArray(clone.genre) ? clone.genre.join(", ") : clone.genre || "",
        subgenre: clone.subgenre || "",
        thumbnail: clone.thumbnail || "",
        highResImage: clone.highResImage || "",
      };

      setForm(parsed);
    }
  }, [book]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const updatedData = {
      ...form,
      author: form.author.split(",").map((a) => a.trim()),
      genre: form.genre ? form.genre.split(",").map((g) => g.trim()) : undefined,
    };

    try {
      const ref = doc(db, "books", book.id);
      await updateDoc(ref, updatedData);
      onSave();
      onClose();
    } catch (error) {
      console.error("Error saving book:", error);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this book?")) return;

    try {
      const ref = doc(db, "books", book.id);
      await deleteDoc(ref);
      onSave(); // refresh the book list
      onClose();
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  const formatLabel = (field) => field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3 className={styles.head3}>Edit Book</h3>

        {["title", "author", "shortDescription", "description", "genre", "subgenre", "thumbnail", "highResImage"].map((field) => (
          <label
            key={field}
            className={styles.labelGroup}
          >
            <span className={styles.label}>{formatLabel(field)}</span>
            <input
              value={form[field] || ""}
              onChange={(e) => handleChange(field, e.target.value)}
              placeholder={formatLabel(field)}
              className={styles.input}
            />
          </label>
        ))}

        <div className={styles.actions}>
          <button
            className={styles.buttonPrimary}
            onClick={handleSave}
          >
            Save
          </button>
          <button
            className={styles.button}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={styles.deleteButton}
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
