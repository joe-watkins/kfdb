import { db } from '../firebase/config';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  getDocs,
  query,
  where,
  deleteDoc,
  orderBy
} from '@firebase/firestore';
import type { Session } from '../types';

type SessionData = Omit<Session, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Saves a session to Firestore. Creates a new session if no id is provided,
 * otherwise updates the existing one.
 * @param data - The session data to save.
 * @param id - The optional ID of the session to update.
 * @returns The ID of the saved session.
 */
export const saveSession = async (data: SessionData, id: string | null): Promise<string> => {
  if (id) {
    // Update existing session
    const sessionRef = doc(db, 'sessions', id);
    await updateDoc(sessionRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return id;
  } else {
    // Create new session
    const sessionsCollection = collection(db, 'sessions');
    const newDocRef = await addDoc(sessionsCollection, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return newDocRef.id;
  }
};

/**
 * Fetches all sessions for a given user.
 * @param userId - The ID of the user.
 * @returns A promise that resolves to an array of sessions.
 */
export const getUserSessions = async (userId: string): Promise<Session[]> => {
    const sessionsCollection = collection(db, 'sessions');
    const q = query(
        sessionsCollection, 
        where('userId', '==', userId),
        orderBy('updatedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as Session[];
};


/**
 * Deletes a session from Firestore.
 * @param id - The ID of the session to delete.
 */
export const deleteSession = async (id: string): Promise<void> => {
    const sessionRef = doc(db, 'sessions', id);
    await deleteDoc(sessionRef);
};