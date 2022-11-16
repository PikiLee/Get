export const deleteUndefinedPropertiesOfObject = <T>(obj: T) => {
  if (typeof obj !== 'object' || obj === null) {
    throw 'Need an object.';
  } else {
    const objCopy = { ...obj };
    let key: keyof typeof objCopy;
    for (key in objCopy) {
      if (!objCopy[key]) {
        delete objCopy[key];
      }
    }

    return objCopy;
  }
};
