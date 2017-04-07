const MAXIMUM_UPLOAD_SIZE = 1024 * 1024;  // 1 MB in bytes
const DEFAULT_IMAGE_UPLOAD_WIDTH = 960;
const DEFAULT_IMAGE_UPLOAD_HEIGHT = 1280;

export function fileTooLargeForUpload(file: File): boolean {
  return file.size > MAXIMUM_UPLOAD_SIZE;
}

function resize(width: number, height: number): {width: number, height: number} {
  var MAX_WIDTH = DEFAULT_IMAGE_UPLOAD_WIDTH;
  var MAX_HEIGHT = DEFAULT_IMAGE_UPLOAD_HEIGHT;

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

  return {width, height};
}

export function downscaleImageFile(file: File): Promise<File> {
  let originalFileName = file.name;
  let contentType = file.type;

  return new Promise((resolve: (file: File) => void, reject: (reason: string) => void) => {

    var reader = new FileReader();
    reader.onload = function(readerEvent) {
      var image = new Image();
      image.onload = function(imageEvent) {
        var canvas = document.createElement('canvas');
        var canvasContext = canvas.getContext('2d');
        canvasContext.drawImage(image, 0, 0);

        let newSize = resize(image.width, image.height);
        let newWidth = newSize.width;
        let newHeight = newSize.height;

        canvas.width = newWidth;
        canvas.height = newHeight;

        var canvasContext = canvas.getContext('2d');

        canvasContext.drawImage(image, 0, 0, newWidth, newHeight);

        var resizedImage = canvas.toBlob((blob) => {
          let newFileName = `resized${originalFileName}`;
          let resizedFile =
              new File([blob], newFileName, {type: contentType, lastModified: Date.now()});

          resolve(resizedFile);
        }, 'image/jpeg', 0.95);
      };
      image.src = (<any>readerEvent).target.result;
    };
    reader.readAsDataURL(file);
  });
}
