import { useUserStore } from './../stores/userStore';
import { NewUser, User } from './../types/user';
import { auth } from './firebase';
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  updateProfile,
  signOut,
} from 'firebase/auth';

const setUserToStore = (user: User) => {
  const userStore = useUserStore();
  userStore.user = user;
};

const getUserProfile = () => {
  const user = auth.currentUser;
  if (user !== null) {
    const info: User = {
      id: user.uid,
      name: user.displayName || '',
      email: user.email || '',
      icon: user.phoneNumber || '',
      emailVerified: user.emailVerified,
    };
    setUserToStore(info);
  }
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

const removeUserFromStore = () => {
  const userStore = useUserStore();
  userStore.user = null;
};

const logOut = () => {
  return signOut(auth).then(() => {
    // Sign-out successful.
    removeUserFromStore();
  });
};

export default {
  createUser,
  checkIfEmailExists,
  getUserProfile,
  logOut,
};
