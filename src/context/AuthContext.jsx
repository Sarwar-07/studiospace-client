'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
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
      if (res.ok) {
        const data = await res.json();
        if (data?.token && typeof window !== 'undefined') {
          localStorage.setItem('access-token', data.token);
        }
        return data;
      }
      return res;
    } catch (err) {
      console.warn('Failed to issue JWT cookie/token (server may be offline or starting up):', err);
    }
  }, [API_URL]);

  const clearJwtCookie = async () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access-token');
      }
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

  const loginWithGoogle = async () => {
    // Zero state setters before signInWithPopup
    try {
      return await signInWithPopup(auth, googleProvider);
    } catch (error) {
      if (error?.code === 'auth/popup-blocked' || error?.code === 'auth/cancelled-popup-request') {
        console.warn('Popup blocked; falling back to signInWithRedirect');
        return await signInWithRedirect(auth, googleProvider);
      }
      throw error;
    }
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
    let isMounted = true;

    // 1. Process Google redirect return
    getRedirectResult(auth)
      .then(async (result) => {
        if (result && result.user && isMounted) {
          const redirectUser = result.user;
          // Issue backend JWT cookie
          try {
            const res = await fetch(`${API_URL}/api/auth/jwt`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: redirectUser.email,
                name: redirectUser.displayName,
                photoURL: redirectUser.photoURL,
              }),
              credentials: 'include',
            });
            if (res.ok) {
              const data = await res.json();
              if (data?.token && typeof window !== 'undefined') {
                localStorage.setItem('access-token', data.token);
              }
            }
          } catch (jwtErr) {
            console.warn('Redirect JWT issuance warning:', jwtErr);
          }
        }
      })
      .catch((error) => {
        console.error('Error handling redirect result:', error);
      });

    // 2. Track auth state
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (isMounted) {
        setUser(currentUser);
        if (currentUser?.email) {
          await issueJwtToken(currentUser.email);
        } else {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('access-token');
          }
        }
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [API_URL, issueJwtToken]);

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
