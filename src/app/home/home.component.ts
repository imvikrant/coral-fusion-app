import { Component, OnInit } from '@angular/core';
import { DataService } from './../data.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  uploadForm: FormGroup;
  image: File = null;
  studentRecords = [];
  addingRecord = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private data: DataService
  ) {
    this.uploadForm = this.formBuilder.group({
      rollNo: ['', Validators.required],
      name: ['', Validators.required],
      subject: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.http
      .get('/records', {
        headers: new HttpHeaders({
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        })
      })
      .subscribe((jsonData: any) => {
        console.log(jsonData.records);
        this.studentRecords = jsonData.records;
      });
  }

  handleFileInput(files: FileList) {
    this.image = files.item(0);
  }

  onLogout() {
    localStorage.removeItem('access_token');
    this.data.loggedIn = false;
  }

  onSubmit() {
    this.submitted = true;
    if (this.uploadForm.invalid) {
      return;
    }

    this.addingRecord = true;
    const formData = new FormData();
    formData.append('rollNo', this.uploadForm.get('rollNo').value);
    formData.append('name', this.uploadForm.get('name').value);
    formData.append('subject', this.uploadForm.get('subject').value);
    formData.append('image', this.image, this.image.name);

    this.http
      .post('/record', formData, {
        headers: new HttpHeaders({
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        })
      })
      .subscribe((res: any) => {
        if (res.record) {
          this.studentRecords.push(res.record);
        }
        this.addingRecord = false;
        Object.keys(this.uploadForm.controls).forEach(name => {
          this.uploadForm.controls[name].setValue('');
          this.uploadForm.controls[name].setErrors(null);
        });
        this.image = null;
      });
  }
}
