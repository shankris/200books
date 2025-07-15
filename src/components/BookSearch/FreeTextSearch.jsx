"use client";

import { useEffect, useState, useRef } from "react";
import { X, Search } from "lucide-react";
import styles from "./FreeTextSearch.module.css";
import listStyles from "./AutoSuggestList.module.css";

export default function FreeTextSearch({ onSelect }) {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query.trim()), 500);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!debounced) {
      setResults([]);
      return;
    }

    setLoading(true);
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(debounced)}&maxResults=10`)
      .then((res) => res.json())
      .then((data) => {
        const books = (data.items || []).map((item) => {
          const info = item.volumeInfo;

          const imageLinks = info.imageLinks || {};

          // Force HTTPS if needed
          const thumbnail = imageLinks.thumbnail?.replace("http://", "https://") || "";
          const highResImage = imageLinks.medium?.replace("http://", "https://") || imageLinks.small?.replace("http://", "https://") || "";

          return {
            id: item.id,
            title: info.title,
            authors: info.authors || [],
            thumbnail: info.imageLinks?.thumbnail || "",
            highResImage: info.imageLinks?.medium || info.imageLinks?.small || "",
            genre: info.categories || [],
            description: info.description || "",
          };
        });
        setResults(books);
      })
      .catch((err) => {
        console.error("Autocomplete failed", err);
        setResults([]);
      })
      .finally(() => setLoading(false));
  }, [debounced]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setResults([]);
      }
    }

    function handleEscapeKey(e) {
      if (e.key === "Escape") {
        setResults([]);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setActiveIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === "Enter" && activeIndex >= 0) {
      onSelect(results[activeIndex]);
      setResults([]);
      setQuery("");
    }
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setActiveIndex(-1);
  };

  return (
    <div
      className={styles.wrapper}
      ref={containerRef}
    >
      <div className={styles.inputWrapper}>
        <Search
          size={18}
          className={styles.searchIcon}
        />
        <input
          type='text'
          placeholder='Search books ...'
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          className={styles.input}
        />
        {query && (
          <X
            size={18}
            className={styles.clearButton}
            onClick={handleClear}
          />
        )}
      </div>

      {loading && <p className={styles.status}>Searching...</p>}

      {results.length > 0 && (
        <ul className={listStyles.dropdown}>
          {results.map((book, idx) => (
            <li
              key={book.id}
              className={`${listStyles.item} ${idx === activeIndex ? listStyles.active : ""}`}
              onClick={() => {
                onSelect(book); // ✅ send to parent
                setQuery("");
                setResults([]);
              }}
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
