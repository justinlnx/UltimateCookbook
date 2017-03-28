import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {Subscription} from 'rxjs/Subscription';

import {ApiService, FirebaseAuthState, User} from '../../api';
import {createSingleFileUploader, FileUploader} from '../../file-upload';

@Component({
  selector: 'account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss']
})
export class AccountSettingsComponent implements OnInit, OnDestroy {
  @ViewChild('avatarUploadInput') public avatarUploadInput: ElementRef;

  public user: User;
  public authState: FirebaseAuthState;
  public avatarUrl: SafeResourceUrl;
  public avatarUploader: FileUploader = createSingleFileUploader();
  public loading: boolean = false;

  get email(): string {
    if (!this.authState) {
      return '';
    }
    return this.authState.auth.email;
  }

  get avatarUploadFileName(): string {
    if (!this.avatarUploadInput || !this.avatarUploadInput.nativeElement.files ||
        this.avatarUploadInput.nativeElement.files.length < 1) {
      return '';
    }

    let files = this.avatarUploadInput.nativeElement.files as File[];

    let avatarImage = files[0];

    return avatarImage.name;
  }

  private userSubscription: Subscription;

  constructor(public apiServie: ApiService, public domSanitizer: DomSanitizer) {}

  public ngOnInit() {
    this.userSubscription = this.apiServie.getCurrentUserObservable().subscribe((user) => {
      this.user = user;
      this.updateAvatarSafeUrl(user);
    });

    this.apiServie.getAuth().subscribe((authState) => {
      this.authState = authState;
    });
  }

  public ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  public onLogout() {
    this.apiServie.logout();
  }

  public onSelectFile() {
    this.avatarUploadInput.nativeElement.click();
  }

  public onUploadAvatar(): void {
    this.loading = true;
    for (let item of this.avatarUploader.queue) {
      item.upload();

      const self = this;

      item.onComplete = (response: string) => {
        console.log(response);
        self.user.avatar = response;
        self.apiServie.updateUserInfo(self.user);

        this.loading = false;
      };
    }
  }

  private updateAvatarSafeUrl(user: User) {
    this.avatarUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(user.avatar);
  }
}
