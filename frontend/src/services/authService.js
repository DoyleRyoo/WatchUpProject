import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import {
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

import { auth, db } from "./firebase";

export const signup = async (
  email,
  password,
  nickname
) => {
  const userCredential =
    await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

  const uid = userCredential.user.uid;

  await setDoc(
    doc(db, "users", uid),
    {
      nickname,
      email,
      createdAt: Date.now(),
    }
  );

  return userCredential.user;
};

export const login = async (
  email,
  password
) => {
  const userCredential =
    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

  return userCredential.user;
};

export const logout = async () => {
  await signOut(auth);
};

export const getProfile = async (
  uid
) => {
  const snapshot =
    await getDoc(doc(db, "users", uid));

  return snapshot.data();
};