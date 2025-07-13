"use client";

import React from "react";
import Link from "next/link";
import styles from "./Sidebar.module.css";

const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <nav className={styles.navLinks}>
        <h3>📚 Books</h3>
        <ul>
          <li>
            <Link href='/upload'>📤 Upload Books</Link>
          </li>
          <li>
            <Link href='/books'>🔎 View Books</Link>
          </li>
        </ul>
      </nav>

      <div className={styles.filters}>
        <h3>Filter Books</h3>
        <ul>
          <li>
            <label>
              <input type='checkbox' /> Fiction
            </label>
          </li>
          <li>
            <label>
              <input type='checkbox' /> Non-fiction
            </label>
          </li>
          <li>
            <label>
              <input type='checkbox' /> Biography
            </label>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
