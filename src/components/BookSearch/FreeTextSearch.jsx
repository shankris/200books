"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import styles from "./FreeTextSearch.module.css";
import listStyles from "./AutoSuggestList.module.css";

export default function FreeTextSearch({ onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setLoading(true);
    setResults([]);

    try {
      const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(trimmed)}`);
      const data = await res.json();

      const books = (data.docs || []).slice(0, 10).map((item) => {
        const coverId = item.cover_i;
        return {
          id: item.key,
          title: item.title,
          authors: item.author_name || [],
          thumbnail: coverId ? `https://covers.openlibrary.org/b/id/${coverId}-S.jpg` : "",
          highResImage: coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : "",
          genre: item.subject ? item.subject.slice(0, 3) : [],
          description: `Published in ${item.first_publish_year || "unknown year"}`,
        };
      });

      setResults(books);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
  };

  const handleSelect = async (book) => {
    try {
      const res = await fetch(`https://openlibrary.org${book.id}.json`);
      const data = await res.json();

      const description = typeof data.description === "string" ? data.description : data.description?.value || book.description;

      const genre = data.subjects?.slice(0, 5) || book.genre;

      onSelect({
        ...book,
        description,
        genre,
      });
    } catch (err) {
      console.error("Failed to fetch detailed info", err);
      onSelect(book); // fallback
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.inputWrapper}>
        <Search
          size={18}
          className={styles.searchIcon}
        />
        <input
          type='text'
          placeholder='Search books ...'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={styles.input}
        />
        {query && (
          <X
            size={18}
            className={styles.clearButton}
            onClick={handleClear}
          />
        )}
        <button
          className={styles.searchButton}
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      {loading && <p className={styles.status}>Searching...</p>}

      {results.length > 0 && (
        <ul className={listStyles.list}>
          {results.map((book) => (
            <li
              key={book.id}
              className={listStyles.item}
              onClick={() => handleSelect(book)}
            >
              {book.thumbnail && (
                <img
                  src={book.thumbnail}
                  alt={book.title}
                  className={listStyles.thumb}
                />
              )}
              <div>
                <strong>{book.title}</strong>
                <div className={listStyles.meta}>
                  {book.authors.join(", ")}
                  <br />
                  <small>{book.genre.join(", ")}</small>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
