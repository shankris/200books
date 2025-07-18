import { useState } from "react";
import styles from "./SelectedBook.module.css";

export default function SelectedBook({ book }) {
  const [isHighResLoaded, setIsHighResLoaded] = useState(false);

  if (!book) return null;

  const { title, thumbnail, highResImage, authors = [], genre = [], description } = book;

  console.log("Selected book image URLs", { thumbnail, highResImage });

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        {/* Show low-res thumbnail first */}
        {thumbnail && !isHighResLoaded && (
          <img
            src={thumbnail}
            alt={title}
            className={styles.lowRes}
          />
        )}

        {/* Load high-res image */}
        {highResImage && (
          <img
            src={highResImage}
            alt={title}
            className={`${styles.highRes} ${isHighResLoaded ? styles.visible : ""}`}
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
      </div>
    </div>
  );
}
