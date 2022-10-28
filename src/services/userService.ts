import { NewUser, UserInfo } from './../types/user';
import { auth, db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  updateProfile,
} from 'firebase/auth';

const addUserInfo = async (userInfo: UserInfo) => {
  return await addDoc(collection(db, 'users'), userInfo);
};

function createUser(user: NewUser) {
  return createUserWithEmailAndPassword(auth, user.email, user.password).then(
    () => {
      if (auth.currentUser) {
        return updateProfile(auth.currentUser, {
          displayName: user.name,
          photoURL: user.icon,
        });
      }
    }
  );
}

const checkIfEmailExists = async (email: string) => {
  const res = await fetchSignInMethodsForEmail(auth, email);
  if (res.length === 0) {
    return false;
  } else {
    return true;
  }
};

export default {
  createUser,
  checkIfEmailExists,
};
