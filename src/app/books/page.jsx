"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import styles from "./BooksPage.module.css";

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const snapshot = await getDocs(collection(db, "books"));
        const booksData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setBooks(booksData);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) return <p style={{ padding: "1rem" }}>📚 Loading books...</p>;

  return (
    <div className={styles.container}>
      <h2>📖 All Books in Firebase</h2>
      <ul className={styles.bookList}>
        {books.map((book) => (
          <li
            key={book.id}
            className={styles.bookItem}
          >
            <strong>{book.title}</strong>
            <br />
            <span>{book.author.join(", ")}</span>
            <br />
            <em>{book.category}</em>
          </li>
        ))}
      </ul>
    </div>
  );
}
