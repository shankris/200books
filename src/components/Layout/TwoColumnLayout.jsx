import React from "react";
import styles from "./TwoColumnLayout.module.css";
import Sidebar from "./Sidebar";

const TwoColumnLayout = ({ children }) => {
  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <Sidebar />
      </aside>
      <section className={styles.content}>{children}</section>
    </div>
  );
};

export default TwoColumnLayout;
