"use client";

import { useState } from "react";

import SelectedBook from "./SelectedBook";

import { Search, X } from "lucide-react";
import styles from "./FreeTextSearch.module.css";

export default function FreeTextSearch({ onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchSource, setSearchSource] = useState("openlibrary");

  const handleSearch = async () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setLoading(true);
    setResults([]);

    try {
      // Run both fetches in parallel
      const [openLibraryRes, googleBooksRes] = await Promise.all([fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(trimmed)}`), fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(trimmed)}`)]);

      const openLibraryData = await openLibraryRes.json();
      const googleBooksData = await googleBooksRes.json();

      // Normalize Open Library books
      const openLibraryBooks = (openLibraryData.docs || []).slice(0, 5).map((item) => {
        const coverId = item.cover_i;
        return {
          id: item.key,
          source: "openlibrary",
          title: item.title,
          authors: item.author_name || [],
          thumbnail: coverId ? `https://covers.openlibrary.org/b/id/${coverId}-S.jpg` : "",
          highResImage: coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : "",
          genre: item.subject ? item.subject.slice(0, 3) : [],
          description: `Published in ${item.first_publish_year || "unknown year"}`,
        };
      });

      // Normalize Google Books results
      const googleBooks = (googleBooksData.items || []).slice(0, 5).map((item) => {
        const volume = item.volumeInfo;
        return {
          id: item.id,
          source: "googlebooks",
          title: volume.title || "Untitled",
          authors: volume.authors || [],
          thumbnail: volume.imageLinks?.thumbnail || "",
          highResImage: volume.imageLinks?.large || volume.imageLinks?.medium || "",
          genre: volume.categories || [],
          description: volume.description || volume.subtitle || "No description.",
        };
      });

      // Combine both sources
      setResults([...openLibraryBooks, ...googleBooks]);
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
    if (book.source === "openlibrary") {
      try {
        const res = await fetch(`https://openlibrary.org${book.id}.json`);
        const data = await res.json();

        const description = typeof data.description === "string" ? data.description : data.description?.value || book.description;

        const genre = data.subjects?.slice(0, 5) || book.genre;

        setSelectedBook({
          ...book,
          description,
          genre,
        });
      } catch (err) {
        console.error("Failed to fetch Open Library details", err);
        setSelectedBook(book);
      }
    } else {
      // Google Books: use what we already have
      setSelectedBook(book);
    }
  };

  return (
    <div className={styles.search}>
      <div className={styles.searchBox}>
        <div className={styles.inputWrapper}>
          <form
            className={styles.inputWrapper}
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
          >
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

            {/* <select
              value={searchSource}
              onChange={(e) => setSearchSource(e.target.value)}
              className={styles.sourceSelector}
            >
              <option value='openlibrary'>Open Library</option>
              <option value='googlebooks'>Google Books</option>
            </select> */}

            <button
              type='submit'
              className={styles.searchButton}
            >
              Search
            </button>
            {loading && <p className={styles.status}>Searching...</p>}
          </form>
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.resultsBox}>
          {results.length > 0 && (
            <ul className={styles.list}>
              {results.map((book) => (
                <li
                  key={book.id}
                  className={styles.item}
                  onClick={() => handleSelect(book)}
                >
                  {book.thumbnail && (
                    <img
                      src={book.thumbnail}
                      alt={book.title}
                      className={styles.thumb}
                    />
                  )}
                  <div>
                    <div className={styles.searchResultTitle}>{book.title}</div>

                    <div className={styles.meta}>
                      {book.authors.join(", ")}
                      <br />
                      <small>{book.genre.join(", ")}</small>
                      <br />
                      <span className={styles.sourceTag}>{book.source === "googlebooks" ? "Google Books" : "Open Library"}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={styles.selectedBook}>{selectedBook && <SelectedBook book={selectedBook} />}</div>
      </div>
    </div>
  );
}
