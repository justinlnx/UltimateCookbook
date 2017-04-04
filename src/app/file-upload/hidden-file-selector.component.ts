import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Subject} from 'rxjs/Subject';

import {FileUploader} from './uploader-factory';

@Component({
  selector: 'hidden-file-selector',
  template: `
  <input #uploadInput type="file" ng2FileSelect [uploader]="uploader" (change)="onFileChange()">
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
      this.onSelected.emit(selectedFile.name);
    }
  }

  private openFileInputSelector(): void {
    this.uploadInput.nativeElement.click();
  }
}
