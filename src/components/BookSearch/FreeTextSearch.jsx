"use client";

import { useEffect, useState } from "react";
import styles from "./FreeTextSearch.module.css";
import AutoSuggestList from "./AutoSuggestList";

export default function FreeTextSearch({ onSelect }) {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

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
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(debounced)}&maxResults=5`)
      .then((res) => res.json())
      .then((data) => {
        const books = (data.items || []).map((item) => {
          const info = item.volumeInfo;
          return {
            id: item.id,
            title: info.title,
            authors: info.authors || [],
            thumbnail: info.imageLinks?.thumbnail || "",
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

  return (
    <div className={styles.wrapper}>
      <input
        type='text'
        placeholder='Search books by title, author, or topic...'
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setActiveIndex(-1);
        }}
        onKeyDown={handleKeyDown}
        className={styles.input}
      />

      {loading && <p className={styles.status}>Searching...</p>}

      {results.length > 0 && (
        <AutoSuggestList
          results={results}
          activeIndex={activeIndex}
          onSelect={(book) => {
            onSelect(book);
            setQuery("");
            setResults([]);
          }}
        />
      )}
    </div>
  );
}
