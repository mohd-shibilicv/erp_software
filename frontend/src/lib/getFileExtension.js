export const getFileExtension = (filename) => {
    return filename.substring(filename.lastIndexOf('.')) || '';
  }