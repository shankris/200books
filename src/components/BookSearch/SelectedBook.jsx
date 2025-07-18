import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { useAuth } from "@/lib/useAuth"; // <-- or however you access the user
import styles from "./SelectedBook.module.css";

export default function SelectedBook({ book }) {
  const [isHighResLoaded, setIsHighResLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { user } = useAuth(); // Assuming you expose user via context or hook

  useEffect(() => {
    setIsHighResLoaded(false);
    setSaved(false);
  }, [book?.id]);

  if (!book) return null;

  const { title, thumbnail, highResImage, authors = [], genre = [], description, source } = book;

  const handleSave = async () => {
    if (!user) {
      alert("Please log in to save books.");
      return;
    }

    setSaving(true);

    try {
      const userBooksRef = collection(db, "users", user.uid, "books");

      // 1. Check for duplicate
      const q = query(userBooksRef, where("title", "==", title), where("author", "==", authors));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        setSaved(true);
        alert("This book is already saved.");
        return;
      }

      // 2. Save to user subcollection
      await addDoc(userBooksRef, {
        title,
        author: authors,
        cover: highResImage || thumbnail,
        category: genre,
        description,
        source,
        public: false,
        createdAt: new Date().toISOString(),
      });

      setSaved(true);
    } catch (err) {
      console.error("Error saving book:", err);
      alert("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        {!isHighResLoaded && thumbnail && (
          <div className={styles.lowResWrapper}>
            <img
              src={thumbnail}
              alt={title}
              className={styles.lowRes}
            />
            <div className={styles.overlay}>Cover Loading...</div>
          </div>
        )}

        {highResImage && (
          <img
            src={highResImage}
            alt={title}
            className={`${styles.highRes} ${isHighResLoaded ? styles.visible : styles.hidden}`}
            onLoad={() => setIsHighResLoaded(true)}
          />
        )}
      </div>

      <div className={styles.info}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.authors}>
          <strong>Author(s):</strong> {authors.join(", ") || "Unknown"}
        </p>
        <p className={styles.genres}>
          <strong>Genre(s):</strong> {genre.join(", ") || "N/A"}
        </p>
        <p className={styles.description}>
          <strong>Description:</strong>
          <br />
          {description || "No description available."}
        </p>

        <button
          className={styles.saveButton}
          onClick={handleSave}
          disabled={saving || saved}
        >
          {saved ? "✅ Saved!" : saving ? "Saving..." : "Save to 200Books"}
        </button>
      </div>
    </div>
  );
}
