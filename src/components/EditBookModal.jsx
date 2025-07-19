// This is a new enhanced version of the EditBookModal with:
// - Three-step form (with "Next" and "Back")
// - Thumbnail preview on the left (visible in all steps)
// - Textareas for long fields
// - ISBN10, ISBN13, Language, etc. added

import { useState, useEffect } from "react";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/useAuth";
import styles from "./EditBookModal.module.css";

export default function EditBookModal({ book, onClose, onSave }) {
  const { user } = useAuth();
  const [form, setForm] = useState({});
  const [step, setStep] = useState(0);

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
        isbn10: clone.isbn10 || "",
        isbn13: clone.isbn13 || "",
        language: clone.language || "",
        pageCount: clone.pageCount || 0,
        format: clone.format || "",
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
      pageCount: parseInt(form.pageCount || "0", 10),
      addDate: book.addDate || new Date().toISOString().slice(0, 10).replace(/-/g, ""),
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
      onSave({ id: book.id, ...updatedData }); // ✅ Send updated data back
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

  const steps = [
    ["title", "author", "shortDescription", "description"],
    ["genre", "subGenre", "thumbnail", "highResImage"],
    ["isbn10", "isbn13", "language", "pageCount", "format"],
  ];

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    // Expected format: YYYYMMDD
    const year = dateStr.slice(0, 4);
    const month = dateStr.slice(4, 6);
    const day = dateStr.slice(6, 8);
    return `${year}-${month}-${day}`;
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3 className={styles.head3}>Edit Book</h3>
        <div className={styles.splitModal}>
          <div className={styles.previewArea}>
            {form.thumbnail ? (
              <img
                src={form.thumbnail}
                alt='Book Thumbnail'
                className={styles.thumbnailPreview}
              />
            ) : (
              <div className={styles.bookPlaceholder}>Image coming soon</div>
            )}

            <div className={styles.metaInfo}>
              <div>
                <strong>Added By:</strong> {form.addedBy || "—"}
              </div>
              <div>
                <strong>Date:</strong> {formatDate(form.addDate)}
              </div>
              <div>
                <button
                  className={styles.deleteButton}
                  onClick={handleDelete}
                >
                  Remove Book
                </button>
              </div>
            </div>
          </div>
          <div className={styles.formArea}>
            {steps[step].map((field) => (
              <label
                key={field}
                className={styles.labelGroup}
              >
                <span className={styles.label}>{formatLabel(field)}</span>
                {field === "description" || field === "shortDescription" ? (
                  <textarea
                    className={styles.textarea}
                    rows={4}
                    value={form[field] || ""}
                    onChange={(e) => handleChange(field, e.target.value)}
                  />
                ) : (
                  <input
                    value={form[field] || ""}
                    onChange={(e) => handleChange(field, e.target.value)}
                    placeholder={formatLabel(field)}
                    className={styles.input}
                  />
                )}
              </label>
            ))}

            <div className={styles.actions}>
              {step > 0 && (
                <button
                  className={styles.button}
                  onClick={() => setStep(step - 1)}
                >
                  Back
                </button>
              )}
              {step < steps.length - 1 ? (
                <button
                  className={styles.buttonPrimary}
                  onClick={() => setStep(step + 1)}
                >
                  Next
                </button>
              ) : (
                <button
                  className={styles.buttonPrimary}
                  onClick={handleSave}
                >
                  Save
                </button>
              )}
              <button
                className={styles.button}
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
