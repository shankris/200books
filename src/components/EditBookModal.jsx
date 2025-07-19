import { useState, useEffect } from "react";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/useAuth";
import styles from "./EditBookModal.module.css";

export default function EditBookModal({ book, onClose, onSave }) {
  const [form, setForm] = useState({});
  const { user } = useAuth();

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
        subGenre: Array.isArray(clone.subGenre) ? clone.subGenre.join(", ") : clone.subGenre || "",
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
      genre: form.genre ? form.genre.split(",").map((g) => g.trim()) : [],
      subGenre: form.subGenre ? form.subGenre.split(",").map((g) => g.trim()) : [],
      tags: form.tags ? form.tags.split(",").map((t) => t.trim()) : [],
      pageCount: parseInt(form.pageCount || "0", 10),
      addDate: form.addDate || new Date().toISOString().slice(0, 10).replace(/-/g, ""),
      addedBy: user?.displayName || "Unknown User",
      addedEmail: user?.email || "unknown@example.com",
      slug:
        form.slug ||
        (form.title || "")
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]+/g, ""),
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
      onSave();
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

        {["title", "author", "shortDescription", "description", "genre", "subGenre", "thumbnail", "highResImage"].map((field) => (
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
