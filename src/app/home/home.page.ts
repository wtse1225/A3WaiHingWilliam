import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Reservation from '../models/Reservation';
import { FormGroup, FormControl, Validators, ValidationErrors } from '@angular/forms'; // for the form module

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  // Instantiate the FormGroup and other necessary properties
  myForm: FormGroup;
  submitAttempted: Boolean = false;

  // Constructor: for initializing Form and passing data to the next page
  constructor(private router: Router) {
    this.myForm = new FormGroup({
      // variable links to the home.page.html, ''=current state; validators is required; custom validators
      carType: new FormControl('', [Validators.required, this.checkCarType]), // custom validator is needed
      date: new FormControl('', [Validators.required, this.checkDate]),
      hour: new FormControl('1', [
        Validators.required,
        Validators.min(1),
        Validators.max(96)
      ]),
      childSeat: new FormControl(false)
    })
  }

  // Validators: Need to specify what can be returned: null or error objects (doesn't work if not specify)
  checkCarType(control: FormControl): null | ValidationErrors {
    const validTypes = ["sedan", "suv"];

    return validTypes.includes(control.value) ? null : { invalidCarType: true }; // success if true; error object if false
  }

  checkDate(control: FormControl): null | ValidationErrors {
    let bookingDate = new Date(control.value);
    let systemDate = new Date();

    return bookingDate >= systemDate ? null : { invalidDate: true };
  }

  checkHour(control: FormControl): null | ValidationErrors {
    return control.value >= 1 && control.value <= 96 ? null : { invalidHour: true };
  }

  // Button logic
  buttonSubmit() {
    this.submitAttempted = true;

    if (this.myForm.valid) {
      // class examples didn't work because of how the reservation object is being passed

      // Convert the form value to JSON FIRST
      let data = JSON.stringify(this.myForm.value);

      // THEN, use the queryParams to pass data to the next page
      this.router.navigate(['/receipt'], { queryParams: { reservation: data } });   
    }
  }

  buttonReset() {
    this.myForm.reset({
      carType: '',
      date: '',
      hour: '1',
      childSeat: false
    });
    this.submitAttempted = false;
  }
}