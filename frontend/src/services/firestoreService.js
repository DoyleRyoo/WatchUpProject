import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../services/firebase";

export const getHoldings = async (uid) => {
  const ref = collection(db, "users", uid, "holdings");

  const snapshot = await getDocs(ref);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const addHolding = async (uid, data) => {
  const ref = collection(db, "users", uid, "holdings");

  return addDoc(ref, {
    ...data,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
};

export const updateHolding = async (uid, holdingId, data) => {
  const ref = doc(
    db,
    "users",
    uid,
    "holdings",
    holdingId
  );

  return updateDoc(ref, {
    ...data,
    updatedAt: Date.now(),
  });
};

export const deleteHolding = async (uid, holdingId) => {
  const ref = doc(
    db,
    "users",
    uid,
    "holdings",
    holdingId
  );

  return deleteDoc(ref);
};

export const createTransaction = async (uid, data) => {
  const ref = collection(
    db,
    "users",
    uid,
    "transactions"
  );

  await addDoc(ref, {
    ...data,
    createdAt: serverTimestamp(),
  });
};

export const useStockStore = create((set) => ({
  holdings: [],

  setHoldings: (holdings) =>
    set({ holdings }),

  addHolding: (holding) =>
    set((state) => ({
      holdings: [
        ...state.holdings,
        holding,
      ],
    })),

  removeHolding: (id) =>
    set((state) => ({
      holdings: state.holdings.filter(
        (holding) => holding.id !== id
      ),
    })),
}));