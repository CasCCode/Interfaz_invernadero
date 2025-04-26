// AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';

// Creamos el contexto
const AuthContext = createContext();

// Exportamos el proveedor
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        // Escuchar cambios en tiempo real del documento de usuario
        const unsubscribeFirestore = onSnapshot(
          doc(db, 'users', user.uid),
          (docSnap) => {
            if (docSnap.exists()) {
              setCurrentUser({
                uid: user.uid,
                email: user.email,
                ...docSnap.data(),
              });
            } else {
              // Si el documento no existe aún, mantener datos básicos
              setCurrentUser({
                uid: user.uid,
                email: user.email,
              });
            }
            setLoading(false);
          }
        );
        return unsubscribeFirestore;
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });

    return unsubscribeAuth;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Creamos y exportamos el hook para acceder al contexto
export function useAuth() {
  return useContext(AuthContext);
}