import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Subject} from 'rxjs/Subject';

import {downscaleImageFile, fileTooLargeForUpload} from './compression-helpers';
import {FileUploader} from './uploader-factory';

@Component({
  selector: 'hidden-file-selector',
  template: `
  <input #uploadInput type="file" (change)="onFileChange()">
  `,
  styleUrls: ['./hidden-file-selector.component.scss']
})
export class HiddenFileSelectorComponent implements OnInit {
  @Input() public uploader: FileUploader;
  @Input() public clickEventSubject: Subject<string>;

  @Output() public onSelected: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('uploadInput') public uploadInput: ElementRef;

  public ngOnInit() {
    this.clickEventSubject.subscribe((_) => {
      this.openFileInputSelector();
    });
  }

  public onFileChange(): void {
    let files = this.uploadInput.nativeElement.files as File[];

    if (!!files && files.length > 0) {
      let selectedFile = files[0];

      if (fileTooLargeForUpload(selectedFile)) {
        downscaleImageFile(selectedFile).then((file) => {
          this.onCompleteCompression(file);
        });
      } else {
        this.onCompleteCompression(selectedFile);
      }
    }
  }

  private onCompleteCompression(file: File): void {
    this.uploader.addToQueue([file], this.uploader.options);

    this.onSelected.emit(file.name);
  }

  private openFileInputSelector(): void {
    this.uploadInput.nativeElement.click();
  }
}
