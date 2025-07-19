// lib/useIsAdmin.js
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/lib/useAuth";
import { db } from "@/lib/firebase";

export function useIsAdmin() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  console.log("Current user:", user?.email);
  // console.log("Admin doc exists:", snap.exists());
  // console.log("Admin role:", snap.data());

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user?.email) return setIsAdmin(false);

      const ref = doc(db, "admins", user.email);
      const snap = await getDoc(ref);

      if (snap.exists() && snap.data()?.role === "admin") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    };

    checkAdmin();
  }, [user]);

  return isAdmin;
}
