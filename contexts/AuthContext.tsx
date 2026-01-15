import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { auth } from "../config/firebase"; // Importamos la configuración que hiciste antes

// Definimos qué tipo de datos guardará nuestra memoria
interface AuthContextType {
  user: User | null; // Puede ser un usuario o null (nadie conectado)
  loading: boolean; // ¿Estamos cargando/verificando todavía?
  logout: () => Promise<void>; // Función para cerrar sesión
}

// Creamos el contexto (la memoria vacía)
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
});

// Este componente "envuelve" a tu app para darle memoria
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 👂 ESCUCHA ACTIVA: Firebase nos avisa si el estado cambia (login o logout)
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Actualizamos el usuario
      setLoading(false); // Ya terminamos de verificar, quitamos el "cargando"
    });

    return unsubscribe; // Limpieza al cerrar
  }, []);

  // Función de logout
  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Un pequeño atajo para usar esta memoria en cualquier pantalla
export const useAuth = () => useContext(AuthContext);
