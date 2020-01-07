import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../../shared/service/authentication.service';

@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.scss']
})
export class SetPasswordComponent implements OnInit {

	passwordForm: FormGroup;
	submitted = false;

	@Output() passwordCloseEvent = new EventEmitter<boolean>();

  constructor(
		private formBuilder: FormBuilder,
		private authService: AuthenticationService) { }

  ngOnInit() {
		this.passwordForm = this.formBuilder.group({
			oldPassword: ['', Validators.required],
			newPassword: ['', Validators.required]
		});
  }

	get formControls() { return this.passwordForm.controls;}

	onSubmit() {
		this.submitted = true;

		if (this.passwordForm.invalid) {
			return;
		}

		this.authService.setPassword(
			this.formControls.oldPassword.value,
			this.formControls.newPassword.value);
	}

	close() {
		this.passwordCloseEvent.emit(false);
	}
}
