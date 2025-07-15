import { useState } from "react";
import styles from "./SelectedBook.module.css";

export default function SelectedBook({ book }) {
  const [isHighResLoaded, setIsHighResLoaded] = useState(false);

  if (!book) return null;

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        {!isHighResLoaded && book.thumbnail && (
          <img
            src={book.thumbnail}
            alt={book.title}
            className={styles.lowRes}
          />
        )}

        {book.highResImage && (
          <img
            src={book.highResImage}
            alt={book.title}
            className={`${styles.highRes} ${isHighResLoaded ? styles.visible : ""}`}
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
          {book.description || "No description available."}
        </p>
      </div>
    </div>
  );
}
