import React from "react";
import styles from "./Sidebar.module.css";

const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <h3>Filter Books</h3>
      {/* Add filter checkboxes or categories here */}
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
  );
};

export default Sidebar;
