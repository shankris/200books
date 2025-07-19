import { useAuth } from "@/lib/useAuth";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import LoginModal from "../LoginModal";
import styles from "./SelectedBook.module.css";

export default function SelectedBook({ book }) {
  const { user } = useAuth();
  const [isHighResLoaded, setIsHighResLoaded] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setIsHighResLoaded(false);
  }, [book?.id]);

  const handleSave = async () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    try {
      setSaving(true);
      await addDoc(collection(db, "books"), {
        title: book.title,
        authors: book.authors,
        genre: book.genre,
        description: book.description,
        thumbnail: book.thumbnail,
        userId: user.uid,
        createdAt: new Date(),
      });
      alert("✅ Book saved to 200Books!");
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  };

  if (!book) return null;

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        {!isHighResLoaded && book.thumbnail && (
          <div className={styles.lowResWrapper}>
            <img
              src={book.thumbnail}
              alt={book.title}
              className={styles.lowRes}
            />
            <div className={styles.overlay}>Cover Loading...</div>
          </div>
        )}
        {book.highResImage && (
          <img
            src={book.highResImage}
            alt={book.title}
            className={`${styles.highRes} ${isHighResLoaded ? styles.visible : styles.hidden}`}
            onLoad={() => setIsHighResLoaded(true)}
          />
        )}
      </div>

      <div className={styles.info}>
        <h2 className={styles.title}>{book.title}</h2>
        <p className={styles.authors}>
          <strong>Author(s):</strong> {book.authors.join(", ")}
        </p>
        <p className={styles.genres}>
          <strong>Genre(s):</strong> {book.genre.join(", ")}
        </p>
        <p className={styles.description}>
          <strong>Description:</strong>
          <br />
          {book.description}
        </p>

        <button
          onClick={handleSave}
          className={styles.saveButton}
          disabled={saving}
        >
          {saving ? "Saving..." : user ? "Save to 200Books" : "Login to Save to 200Books"}
        </button>
      </div>

      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </div>
  );
}
