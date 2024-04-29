import asyncWait from "./asyncWait";

export const readFileAsDataURL = (file) => {
  const timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error("File reading timed out")), 3000);
  });

  const fileReaderPromise = new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function () {
      resolve(reader.result);
    };

    reader.onerror = function (error) {
      reject(error);
    };

    reader.readAsDataURL(file);
  });

  return Promise.race([timeoutPromise, fileReaderPromise]);
};

export const resizeImage = (file) => {
  const fileResized = new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function () {
      const img = new Image();
      img.onload = function () {
        const MAX_WIDTH = 1000;
        const MAX_HEIGHT = 750;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            const resizedFile = new File([blob], file.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resolve(resizedFile);
          },
          "image/jpeg",
          1
        );
      };
      img.src = reader.result;
    };

    reader.readAsDataURL(file);
  });

  return Promise.race([asyncWait(3000), fileResized]);
};
