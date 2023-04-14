import {firebaseAuth} from "../firebase/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import {UserCredential} from 'firebase/auth';

export const authLogin = async (email: string, password: string):Promise<UserCredential> => {
  try {
    return signInWithEmailAndPassword(firebaseAuth, email, password)
  } catch (err) {
    throw err;
  }
}

export const authRegister = async (email: string, password: string) => {
  try {
    return createUserWithEmailAndPassword(firebaseAuth, email, password)
  } catch (err) {
    throw err;
  }
}

export const authLogout = async (): Promise<void> => {
  try {
    return signOut(firebaseAuth)
  } catch (err) {
    throw err;
  }
}