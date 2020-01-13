import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../../shared/service/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

	loginForm: FormGroup;
	loading = false;
	submitted = false;

	@Output() loginCloseEvent = new EventEmitter<boolean>();

  constructor(
		private formBuilder: FormBuilder,
		private authService: AuthenticationService
	) { }

  ngOnInit() {
 		this.loginForm = this.formBuilder.group({
			username: ['', Validators.required],
			password: ['', Validators.required]
		});
		this.authService.connected().pipe(first()).subscribe(x => {
			this.loading = false;
			if (x > 0) {
				this.loginCloseEvent.emit(true);
			}
		});
	}

	get formControls() { return this.loginForm.controls;}

	onSubmit() {
		this.submitted = true;

		if (this.loginForm.invalid) {
			return;
		}

		this.loading = true;
		this.authService.loginChallenge(
			this.formControls.username.value,
			this.formControls.password.value);
	}

	close() {
		this.loginCloseEvent.emit(false);
	}
	register() {
		// TODO: To be habdled correctly
	}
}
