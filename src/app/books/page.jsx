"use client";

import { useEffect, useState } from "react";

import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/useAuth"; // if not already there
import { collection, getDocs } from "firebase/firestore";

import styles from "./BooksPage.module.css";
import EditBookModal from "@/components/EditBookModal";

// Temp remove this later
import { useIsAdmin } from "@/lib/useIsAdmin";

import { doc, getDoc } from "firebase/firestore";

async function testReadAccess() {
  //  <---- Temp
  const ref = doc(db, "admins", "shankris100@gmail.com");
  try {
    const snap = await getDoc(ref);
    if (snap.exists()) {
      console.log("✅ Read success:", snap.data());
    } else {
      console.log("⚠️ Document does not exist.");
    }
  } catch (err) {
    console.error("❌ Read failed:", err.message);
  }
}

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const isAdmin = useIsAdmin(); // ✅

  const [editingBook, setEditingBook] = useState(null); // holds book to edit
  const [editForm, setEditForm] = useState({ title: "", author: "", category: "" });
  const [showModal, setShowModal] = useState(false);

  console.log("Logged in user:", user?.email);

  useEffect(() => {
    //  <-- Temp
    testReadAccess();
  }, []);

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
      <p>Is Admin: {isAdmin ? "✅ Yes" : "❌ No"}</p> {/* ← Debug */}
      <ul className={styles.bookList}>
        {books.map((book) => (
          <li
            key={book.id}
            className={styles.bookCard}
          >
            {/* Book Cover */}
            <div className={styles.coverWrapper}>
              {book.thumbnail ? (
                <img
                  src={book.thumbnail}
                  alt={book.title}
                  className={styles.bookCover}
                />
              ) : (
                <div className={styles.bookPlaceholder}>Image coming soon</div>
              )}
            </div>

            {/* Book Info (stacked vertically) */}
            <div className={styles.bookDetails}>
              <strong className={styles.bookTitle}>{book.title || "Untitled"}</strong>
              <div className={styles.bookAuthor}>{Array.isArray(book.author) ? book.author.join(", ") : book.author || "Unknown Author"}</div>

              {isAdmin && (
                <button
                  className={styles.editButton}
                  onClick={() => {
                    setEditingBook(book);
                    setShowModal(true);
                  }}
                >
                  Admin Edit
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
      {/* Modal Code */}
      {showModal && editingBook && (
        <EditBookModal
          book={editingBook}
          onClose={() => {
            setShowModal(false);
            setEditingBook(null);
          }}
          onSave={() => {
            // Optionally refresh list here
            location.reload(); // or re-fetch books
          }}
        />
      )}
    </div>
  );
}
