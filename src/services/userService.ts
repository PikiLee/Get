import { useUserStore } from './../stores/userStore';
import { NewUser, User, SignInInfo } from './../types/user';
import { auth } from './firebase';
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  updateProfile,
  signOut,
  signInWithEmailAndPassword,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from 'firebase/auth';

const updateUsernameAndIconUrl = (data: {
  name: string | null;
  icon: string | null;
}) => {
  if (auth.currentUser) {
    const dataToBeUpdated = {} as { displayName?: string; photoURL?: string };
    if (data.name) dataToBeUpdated.displayName = data.name;
    if (data.icon) dataToBeUpdated.photoURL = data.icon;

    return updateProfile(auth.currentUser, dataToBeUpdated).then(() => {
      getUserProfile();
    });
  } else {
    return Promise.reject();
  }
};

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
      icon: user.photoURL || '',
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
        }).then(() => {
          getUserProfile();
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

const signIn = (signInInfo: SignInInfo) => {
  return signInWithEmailAndPassword(
    auth,
    signInInfo.email,
    signInInfo.password
  ).then(() => {
    getUserProfile();
  });
};

const signInOrLogInViaEmailLink = (email: string) => {
  const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.
    url: 'http://localhost:9000/#/auth/finishAuth',
    // This must be true.
    handleCodeInApp: true,
  };

  return sendSignInLinkToEmail(auth, email, actionCodeSettings).then(() => {
    // The link was successfully sent. Inform the user.
    // Save the email locally so you don't need to ask the user for it again
    // if they open the link on the same device.
    window.localStorage.setItem('emailForSignIn', email);
    // ...
  });
};

const completeSignInViaEmailLink = (email: string) => {
  if (isSignInWithEmailLink(auth, window.location.href)) {
    return signInWithEmailLink(auth, email, window.location.href).then(() => {
      // Clear email from storage.
      window.localStorage.removeItem('emailForSignIn');
      // You can access the new user via result.user
      // Additional user info profile not available via:
      // result.additionalUserInfo.profile == null
      // You can check if the user is new or existing:
      // result.additionalUserInfo.isNewUser
      getUserProfile();
    });
  } else {
    return Promise.reject();
  }
};

export default {
  createUser,
  checkIfEmailExists,
  getUserProfile,
  logOut,
  signIn,
  signInOrLogInViaEmailLink,
  completeSignInViaEmailLink,
  updateUsernameAndIconUrl,
};
