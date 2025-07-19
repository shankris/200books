import { useEffect } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import styles from "./LoginModal.module.css";

export default function LoginModal({ onClose }) {
  const provider = new GoogleAuthProvider();

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      onClose(); // Close modal after login
    } catch (error) {
      console.error("Google sign-in failed:", error);
    }
  };

  // Close modal on ESC key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <>
      <div
        className={styles.backdrop}
        onClick={onClose}
      />
      <div className={styles.modal}>
        <button onClick={handleLogin}>Sign in with Google</button>
        <button
          onClick={onClose}
          className={styles.cancel}
        >
          Cancel
        </button>
      </div>
    </>
  );
}
