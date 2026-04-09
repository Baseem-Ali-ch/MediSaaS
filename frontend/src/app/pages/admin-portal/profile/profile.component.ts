import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ConfirmationPopupComponent } from '../../../components/popup/confirmation/confirmation.component';
import { HttpService } from '../../../services/http.service';
import { LoaderService } from '../../../services/loader.service';
import { ToastService } from '../../../services/toast.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatDialogModule],

  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  activeSection: 'profile' | 'password' = 'profile';
  isHoveringAvatar = false;
  profilePicture: string | null = null;

  originalModel = {
    name: '',
    email: '',
    phone: '',
  };

  formModel = {
    name: '',
    email: '',
    phone: '',
  };

  focusState: Record<string, boolean> = {};

  isSavingProfile = false;

  passModel = {
    current: '',
    new: '',
    confirm: '',
  };

  showPassword = {
    current: false,
    new: false,
    confirm: false,
  };

  strengthPercent = 0;
  strengthLabel = '';
  strengthClass = '';
  isUpdatingPassword = false;

  constructor(
    private dialog: MatDialog,
    private httpService: HttpService,
    private toastService: ToastService,
    private loaderService: LoaderService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.getProfileData();
  }

  getProfileData() {
    this.loaderService.show();
    this.httpService
      .get('/admin/profile')
      .pipe(
        finalize(() => {
          this.loaderService.hide();
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (res: any) => {
          this.originalModel = { ...res.user };
          this.formModel = { ...res.user };
        },
        error: (err) => {
          this.showToast('Failed to fetch details.');
        },
      });
  }
  setFocus(field: string) {
    this.focusState[field] = true;
  }

  clearFocus(field: string) {
    this.focusState[field] = false;
  }

  switchSection(section: 'profile' | 'password') {
    if (this.activeSection === 'profile' && section !== 'profile' && this.hasUnsavedProfile()) {
      const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
        width: '400px',
        data: {
          title: 'Unsaved Changes',
          message: 'You have unsaved changes in your profile. Discard them?',
          confirmText: 'Discard',
          cancelText: 'Keep Editing',
          isDestructive: true,
        },
      });
      dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          this.discardProfileChanges();
          this.activeSection = section;
        }
      });
      return;
    }

    if (this.activeSection === 'password' && section !== 'password' && this.hasUnsavedPassword()) {
      const dialogRef = this.dialog.open(ConfirmationPopupComponent, {
        width: '400px',
        data: {
          title: 'Unsaved Data',
          message: 'You have entered password data. Discard it?',
          confirmText: 'Discard',
          cancelText: 'Keep Editing',
          isDestructive: true,
        },
      });
      dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          this.discardPasswordChanges();
          this.activeSection = section;
        }
      });
      return;
    }

    this.activeSection = section;
  }

  hasUnsavedProfile(): boolean {
    return (
      this.formModel.name !== this.originalModel.name ||
      this.formModel.email !== this.originalModel.email ||
      this.formModel.phone !== this.originalModel.phone
    );
  }

  discardProfileChanges() {
    this.formModel = { ...this.originalModel };
  }

  hasUnsavedPassword(): boolean {
    return (
      this.passModel.current !== '' || this.passModel.new !== '' || this.passModel.confirm !== ''
    );
  }

  discardPasswordChanges() {
    this.passModel = { current: '', new: '', confirm: '' };
    this.checkStrength();
  }

  onPhotoUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => (this.profilePicture = reader.result as string);
      reader.readAsDataURL(file);
      this.showToast('Profile photo updated successfully!');
    }
  }

  saveProfile() {
    if (!this.formModel.name) return;

    this.isSavingProfile = true;
    this.httpService
      .patch('/admin/profile', this.formModel)
      .pipe(
        finalize(() => {
          this.isSavingProfile = false;
        }),
      )
      .subscribe({
        next: (res) => {
          this.originalModel = { ...this.formModel };
          this.discardProfileChanges();
          this.showToast('Profile details saved.');
        },
        error: (err) => {
          this.showToast('Failed to update.');
        },
      });
  }

  checkStrength() {
    const p = this.passModel.new;
    if (!p) {
      this.strengthPercent = 0;
      this.strengthLabel = '';
      this.strengthClass = '';
      return;
    }

    let strength = 0;
    if (p.length >= 8) strength += 33;
    if (p.match(/[A-Z]/) && p.match(/[0-9]/)) strength += 33;
    if (p.match(/[^A-Za-z0-9]/)) strength += 34;

    this.strengthPercent = strength;

    if (strength <= 33) {
      this.strengthLabel = 'Weak';
      this.strengthClass = 'weak';
    } else if (strength <= 66) {
      this.strengthLabel = 'Fair';
      this.strengthClass = 'fair';
    } else {
      this.strengthLabel = 'Strong';
      this.strengthClass = 'strong';
    }
  }

  canUpdatePassword() {
    return (
      this.passModel.current &&
      this.passModel.new &&
      this.passModel.confirm &&
      this.passModel.new === this.passModel.confirm &&
      this.strengthPercent >= 66
    ); // Enforce at least fair password
  }

  updatePassword() {
    if (!this.canUpdatePassword()) return;

    this.isUpdatingPassword = true;
    this.httpService
      .patch('/admin/profile', this.passModel)
      .pipe(
        finalize(() => {
          this.isUpdatingPassword = false;
        }),
      )
      .subscribe({
        next: (res) => {
          this.discardPasswordChanges();
          this.showToast('Password securely updated.');
          localStorage.setItem('is-temp-password', 'false');
          sessionStorage.removeItem('temp-password-alert-shown');
        },
        error: (err) => {
          this.showToast('Failed to update.');
        },
      });
  }

  showToast(msg: string) {
    this.toastService.show(msg);
  }
}
