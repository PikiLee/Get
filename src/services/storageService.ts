import { storage } from './firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import md5 from 'md5';
import { ref as vueRef } from 'vue';

const storageFolder = {
  icon: 'icons/',
};

const randomName = (name: string) => {
  const parts = name.split('.');
  return md5(parts[0] + Date.now()) + '.' + parts[1];
};

const upload = (options: { folder: keyof typeof storageFolder }) => {
  const progress = vueRef(0);
  const isDone = vueRef(false);
  const isError = vueRef(false);
  const url = vueRef('');

  const start = async (file: File) => {
    console.log('start');
    const delay = progress.value === 0 ? 0 : 500;
    progress.value = 0;
    isDone.value = false;
    isError.value = false;
    url.value = '';

    const fileRef = ref(
      storage,
      storageFolder[options.folder] + randomName(file.name)
    );
    const uploadTask = uploadBytesResumable(fileRef, file);

    setTimeout(() => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          console.log('hr1');
          progress.value = snapshot.bytesTransferred / snapshot.totalBytes;
        },
        () => {
          // Handle unsuccessful uploads
          isError.value = true;
        },
        () => {
          isDone.value = true;
          progress.value = 1;
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            url.value = downloadURL;
          });
        }
      );
    }, delay);
  };

  return { start, progress, isDone, isError, url };
};

export default {
  storageFolder,
  upload,
};
