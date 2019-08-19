import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { DataService } from './../data.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  messageForm: FormGroup;
  submitted: boolean = false;
  error = '';
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private data: DataService
  ) {
    this.messageForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit() {}

  onSubmit() {
    this.submitted = true;

    if (this.messageForm.invalid) {
      return;
    }
    console.log('ran');

    this.http
      .post(
        '/register',
        {
          email: this.messageForm.get('email').value,
          password: this.messageForm.get('password').value,
          confirmPassword: this.messageForm.get('confirmPassword').value
        },
        {
          withCredentials: true
        }
      )
      .subscribe((res: any) => {
        if (res.error) {
          this.error = res.error;
          return;
        }

        if (res.token) {
          console.log(res.token);
          localStorage.setItem('access_token', res.token);
          this.data.loggedIn = true;
          this.router.navigate(['/']);
        }
      });
  }
}
