import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { HandleSubscription } from 'common/handle-subscription';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminService } from 'admin/admin.service';
import { ShowDialogOnError, ShowSuccessSnackbar } from 'store/common/common.actions';
import { SAVE_SUCCESS } from 'common/utilities/messages';
import { AppState } from 'models/app-state.model';

@Component({
  selector: 'app-panel-placeholders-settings',
  templateUrl: './panel-placeholders-settings.component.html',
  styleUrls: ['./panel-placeholders-settings.component.scss'],
})
export class PanelPlaceholdersSettingsComponent extends HandleSubscription implements OnInit {
  formGroup: FormGroup;
  isLoading: boolean = true;
  isSaving: boolean = false;
  types: string[] = [
    'index-title',
    'index-description',
    'index-keywords',
    'index-meta-tags',
    'robots-txt',
  ];

  constructor(
    private service: AdminService,
    private store: Store<AppState>,
  ) {
    super();
  }

  ngOnInit() {
    this.initForm();
    this.loadPlaceholders();
  }

  private initForm() {
    this.formGroup = new FormGroup({
    });

    this.types.forEach((type) => this.formGroup.addControl(type, new FormControl('', [Validators.required])));
  }

  loadPlaceholders() {
    this.isLoading = true;
    this.service.getPanelPlaceholders(this.types).subscribe(
      (response) => {
        this.types.forEach((type) => {
          const content = response[type] ? response[type].content : '';
          this.formGroup.get(type).setValue(content);
        });
        this.isLoading = false;
      },
      () => {
        this.store.dispatch(new ShowDialogOnError('Reload the page to load data.'));
        this.isLoading = false;
      }
    );
  }

  save(): void {
    this.isSaving = true;
    let placeholders = {};

    for (const key in this.formGroup.controls) {
      const control = this.formGroup.get(key);
      if (control.dirty) {
        placeholders[key] = control.value;
      }
    }

    this.service.patchPanelPlaceholders(placeholders).subscribe(
      () => {
        this.store.dispatch(new ShowSuccessSnackbar(SAVE_SUCCESS));
        this.formGroup.markAsPristine();
        this.isSaving = false;
      },
      () => {
        this.store.dispatch(new ShowDialogOnError(''));
        this.isSaving = false;
      }
    );
  }
}
