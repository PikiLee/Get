import { storage } from './firebase';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  listAll,
  StorageReference,
} from 'firebase/storage';
import md5 from 'md5';
import { ref as vueRef } from 'vue';

const storageFolder = {
  icon: 'icons/',
};

export type KeyOfStorageFolder = keyof typeof storageFolder;

const randomName = (name: string) => {
  const parts = name.split('.');
  return md5(parts[0] + Date.now()) + '.' + parts[1];
};

const upload = (options: {
  folder: keyof typeof storageFolder;
  userId: string;
}) => {
  const progress = vueRef(0);
  const isDone = vueRef(false);
  const isError = vueRef(false);
  const url = vueRef('');
  const fullPath = vueRef('');

  const start = async (file: File) => {
    const delay = progress.value === 0 ? 0 : 500;
    progress.value = 0;
    isDone.value = false;
    isError.value = false;
    url.value = '';
    fullPath.value = '';

    const fileRef = ref(
      storage,
      storageFolder[options.folder] +
        options.userId +
        '/' +
        randomName(file.name)
    );
    const uploadTask = uploadBytesResumable(fileRef, file);

    setTimeout(() => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          progress.value = snapshot.bytesTransferred / snapshot.totalBytes;
        },
        () => {
          // Handle unsuccessful uploads
          isError.value = true;
        },
        () => {
          isDone.value = true;
          progress.value = 1;
          fullPath.value = uploadTask.snapshot.ref.fullPath;
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            url.value = downloadURL;
          });
        }
      );
    }, delay);
  };

  return { start, progress, isDone, isError, url, fullPath };
};

const fetchFile = (options: { folder: KeyOfStorageFolder; userId: string }) => {
  // Create a reference under which you want to list
  const listRef = ref(storage, storageFolder[options.folder] + options.userId);

  // Find all the prefixes and items.
  return listAll(listRef).then(async (res) => {
    // res.prefixes.forEach((folderRef) => {
    //   // All the prefixes under listRef.
    //   // You may call listAll() recursively on them.
    // });

    const r: {
      url: string;
      fullPath: string;
    }[] = [];
    for (const itemRef of res.items) {
      try {
        r.push({
          url: await getDownloadURL(itemRef),
          fullPath: itemRef.fullPath,
        });
      } catch (err) {
        console.log(err);
      }
    }

    return r;
  });
};

const fetchDownloadURL = (fullPath: string) => {
  const fileRef = ref(storage, fullPath);
  return getDownloadURL(fileRef);
};

export default {
  storageFolder,
  upload,
  fetchFile,
  fetchDownloadURL,
};
