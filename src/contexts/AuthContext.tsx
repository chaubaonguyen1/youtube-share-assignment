import {createContext, useContext, useEffect, useState} from "react";
import {handleError} from "../helper/function";
import {authLogin, authLogout, authRegister} from "../services/auth";
import {UserCredential, User} from "firebase/auth";

export interface IAuthContext {
  token: string | null;
  user: User | null;
  isLogged: boolean;
  login: (email: string, password: string) => void;
  register: (email: string, password: string) => void;
  logout: () => void;
}

const authContext = createContext<IAuthContext>({} as IAuthContext);
export const useAuth = (): IAuthContext => useContext(authContext);

export function AuthProvider(props: any) {
  const {children} = props;
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLogged, setIsLogged] = useState<boolean>(false);

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user') || 'null'));
    setToken(localStorage.getItem('token'));
  }, [])

  useEffect(() => {
    setIsLogged(!!user && !!token);
  }, [user, token])

  const login = (email: string, password: string) => {
    authLogin(email, password)
      .then((userCredential: UserCredential) => {
        setUser(userCredential.user || null);
        setToken(userCredential.user?.refreshToken || null);

        localStorage.setItem('token', userCredential.user?.refreshToken || '');
        localStorage.setItem('user', JSON.stringify(userCredential.user));
      })
      .catch(handleError);
  }

  const register = (email: string, password: string) => {
    authRegister(email, password)
      .then((userCredential) => {
        setUser(userCredential.user || null);
        setToken(userCredential.user?.refreshToken || null);

        localStorage.setItem('token', userCredential.user?.refreshToken || '');
        localStorage.setItem('user', JSON.stringify(userCredential.user));
      })
      .catch(handleError)
  }

  const logout = () => {
    authLogout()
      .then(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        setUser(null);
        setToken(null);
      })
      .catch(handleError)
  }

  return (
    <authContext.Provider value={{
      token,
      user,
      isLogged,
      login,
      register,
      logout
    }}>
      {children}
    </authContext.Provider>
  )
}