import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DataService } from './../data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  messageForm: FormGroup;
  submitted = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private data: DataService
  ) {
    this.messageForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {}

  onSubmit() {
    this.submitted = true;
    if (this.messageForm.invalid) {
      return;
    }

    this.http
      .post('/login', {
        email: this.messageForm.get('email').value,
        password: this.messageForm.get('password').value
      })
      .subscribe((res: any) => {
        console.log(res);
        if (res.error) {
          console.log(res.error);
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
