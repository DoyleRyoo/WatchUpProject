import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "./firebase";

/**
 * Get all holdings for a user
 * @param {string} uid - User ID
 * @returns {Promise<Array>} Array of holdings
 */
export const getHoldings = async (uid) => {
  const ref = collection(db, "users", uid, "holdings");
  const snapshot = await getDocs(ref);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

/**
 * Add a new holding for a user
 * @param {string} uid - User ID
 * @param {Object} data - Holding data
 * @returns {Promise<DocumentReference>}
 */
export const addHolding = async (uid, data) => {
  const ref = collection(db, "users", uid, "holdings");

  return addDoc(ref, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

/**
 * Update an existing holding
 * @param {string} uid - User ID
 * @param {string} holdingId - Holding document ID
 * @param {Object} data - Updated holding data
 * @returns {Promise<void>}
 */
export const updateHolding = async (uid, holdingId, data) => {
  const ref = doc(db, "users", uid, "holdings", holdingId);

  return updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Delete a holding
 * @param {string} uid - User ID
 * @param {string} holdingId - Holding document ID
 * @returns {Promise<void>}
 */
export const deleteHolding = async (uid, holdingId) => {
  const ref = doc(db, "users", uid, "holdings", holdingId);

  return deleteDoc(ref);
};

/**
 * Create a transaction record
 * @param {string} uid - User ID
 * @param {Object} data - Transaction data
 * @returns {Promise<void>}
 */
export const createTransaction = async (uid, data) => {
  const ref = collection(db, "users", uid, "transactions");

  await addDoc(ref, {
    ...data,
    createdAt: serverTimestamp(),
  });
};

/**
 * Get all transactions for a user
 * @param {string} uid - User ID
 * @returns {Promise<Array>} Array of transactions
 */
export const getTransactions = async (uid) => {
  const ref = collection(db, "users", uid, "transactions");
  const snapshot = await getDocs(ref);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

/**
 * Find a holding by stock code
 * @param {string} uid - User ID
 * @param {string} stockCode - Stock code to search for
 * @returns {Promise<Object|null>} Holding object or null if not found
 */
export const findHoldingByCode = async (uid, stockCode) => {
  const ref = collection(db, "users", uid, "holdings");
  const snapshot = await getDocs(ref);

  const holding = snapshot.docs.find(
    (doc) => doc.data().stockCode === stockCode
  );

  if (!holding) return null;

  return {
    id: holding.id,
    ...holding.data(),
  };
};