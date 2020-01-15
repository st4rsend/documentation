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

	@Output() loginCloseEvent = new EventEmitter<string>();

	submitted: boolean = false;

  constructor(
		private formBuilder: FormBuilder,
		private authService: AuthenticationService
	) { }

  public ngOnInit() {
 		this.loginForm = this.formBuilder.group({
			username: ['', Validators.required],
			password: ['', Validators.required]
		});
		//this.authService.connected().pipe(first()).subscribe(x => {
		this.authService.connected().subscribe(x => {
			console.log("X: ", x);
			if (x > 0) {
				this.loginCloseEvent.emit("true");
			}
		});
	}

	get formControls() { return this.loginForm.controls;}

	onSubmit() {
		this.submitted = true;
		if (this.loginForm.invalid) {
			return;
		}
		this.authService.loginChallenge(
			this.formControls.username.value,
			this.formControls.password.value);
	}

	public close() {
		this.loginCloseEvent.emit("");
	}
	public register() {
		this.loginCloseEvent.emit("register");
	}
}
