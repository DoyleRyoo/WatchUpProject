import { create } from "zustand";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "../services/firebase";

const useAuthStore = create((set) => ({
  user: null,
  nickname: null,
  loading: false,

  signup: async (email, password, nickname) => {
    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const uid = credential.user.uid;

    await setDoc(doc(db, "users", uid), {
      profile: {
        nickname,
        email,
        createdAt: serverTimestamp(),
      },
    });

    set({
      user: credential.user,
      nickname,
    });
  },

  login: async (email, password) => {
    const credential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const uid = credential.user.uid;

    const snapshot = await getDoc(
      doc(db, "users", uid)
    );

    const data = snapshot.data();

    set({
      user: credential.user,
      nickname: data?.profile?.nickname ?? "",
    });
    return credential.user;
  },

  logout: async () => {
    await signOut(auth);

    set({
      user: null,
      nickname: null,
    });
  },
}));

export default useAuthStore;