import { createContext, useEffect, useState, type ReactNode } from "react";
import { auth } from "../services/firebaseConnection";
import { onAuthStateChanged } from "firebase/auth";

interface AuthProviderProps {
    children: ReactNode;
}

type AuthContextData = {
    signed: boolean;
    loadingAuth: boolean;
    user: UserProviderProps | null
}

interface UserProviderProps {
    uid: string;
    name: string | null;
    email: string | null
}

export const AuthContext = createContext({} as AuthContextData)

function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<UserProviderProps | null>(null)
    const [loadingAuth, setLoadingAuth] = useState(true)

    useEffect(() => {

        const unsub = onAuthStateChanged(auth, (user) => {
            if(user) {
                setUser({
                    uid: user.uid,
                    name: user?.displayName,
                    email: user?.email
                })
                setLoadingAuth(false)
            }else {
                setUser(null)
                setLoadingAuth(false)
            }
        })

        return () => {
            unsub()
        }

    }, [])

    return(
        <AuthContext.Provider value={{signed: !!user, loadingAuth, user}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider