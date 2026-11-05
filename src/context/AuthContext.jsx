'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/firebase.config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const issueJwtToken = useCallback(async (email) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/jwt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email }),
      });
      return res;
    } catch (err) {
      console.warn('Failed to issue JWT cookie (server may be offline or starting up):', err);
    }
  }, [API_URL]);

  const clearJwtCookie = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (err) {
      console.warn('Failed to clear JWT cookie on logout (server may be offline or starting up):', err);
    }
  };

  const createUser = async (email, password) => {
    setLoading(true);
    try {
      return await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('[AuthContext] createUser error:', {
        code: error?.code,
        message: error?.message,
        customData: error?.customData,
        raw: error
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('[AuthContext] loginUser error:', {
        code: error?.code,
        message: error?.message,
        customData: error?.customData,
        raw: error
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = () => {
    // Initiate popup synchronously on click without any preceding state setters or microtasks
    return signInWithPopup(auth, googleProvider);
  };

  const logoutUser = async () => {
    setLoading(true);
    try {
      await clearJwtCookie();
      return await signOut(auth);
    } catch (error) {
      console.warn('[AuthContext] logoutUser error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (name, photo) => {
    try {
      return await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: photo
      });
    } catch (error) {
      console.error('[AuthContext] updateUserProfile error:', {
        code: error?.code,
        message: error?.message,
        customData: error?.customData,
        raw: error
      });
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser?.email) {
        await issueJwtToken(currentUser.email);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [issueJwtToken]);

  const authInfo = {
    user,
    loading,
    createUser,
    loginUser,
    loginWithGoogle,
    logoutUser,
    updateUserProfile,
    auth,
    googleProvider
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
