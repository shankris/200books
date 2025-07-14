import styles from "./AutoSuggestList.module.css";

export default function AutoSuggestList({ results, activeIndex, onSelect }) {
  return (
    <ul className={styles.dropdown}>
      {results.map((book, idx) => (
        <li
          key={book.id}
          className={`${styles.item} ${idx === activeIndex ? styles.active : ""}`}
          onClick={() => onSelect(book)}
        >
          {book.thumbnail && (
            <img
              src={book.thumbnail}
              alt={book.title}
              className={styles.thumb}
            />
          )}
          <div>
            <strong>{book.title}</strong>
            <div className={styles.meta}>
              {book.authors.join(", ")}
              <br />
              <small>{book.genre.join(", ")}</small>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
