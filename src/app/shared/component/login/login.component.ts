import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

	loginForm: FormGroup;
	loading = false;
	submitted = false;
	returnUrl: string;

  constructor(
		private formBuilder: FormBuilder
	) { }

  ngOnInit() {
 		this.loginForm = this.formBuilder.group({
			username: ['', Validators.required],
			password: ['', Validators.required]
		});
	}

	get formControls() { return this.loginForm.controls;}

	onSubmit() {
		this.submitted = true;

		if (this.loginForm.invalid) {
			console.log("loginForm INVALID");
			return;
		}

		this.loading = true;
		console.log("Access auth service");
/*
		this.authService.login(
			this.formControls.username.value,
			this.formControls.password.value)
		.pipe(first())
		.subscribe(
			data => {
				this.router.navigate([this.returnUrl]);
			},
			error => {
				console.log("ERROR: ", error);
			}
		);
*/
	}
}
