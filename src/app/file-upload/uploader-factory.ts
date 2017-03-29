import {FileUploader} from 'ng2-file-upload';

import {MULTIPLE_IMAGE_UPLOAD_URL, SINGLE_IMAGE_UPLOAD_URL} from './urls';

export {FileUploader} from 'ng2-file-upload';

export function createSingleFileUploader(): FileUploader {
  return new FileUploader({url: SINGLE_IMAGE_UPLOAD_URL});
}

export function createMultipleFileUploader(): FileUploader {
  return new FileUploader({url: MULTIPLE_IMAGE_UPLOAD_URL});
}
