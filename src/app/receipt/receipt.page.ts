import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Reservation from '../models/Reservation';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.page.html',
  styleUrls: ['./receipt.page.scss'],
})
export class ReceiptPage implements OnInit {
  // Instantiate the necessary properties
  reservation!: Reservation; // ! tell compiler that I am using the reservation properties and I don't want to initialize each property here
  referenceNum: number = 0;
  subTotal: number = 0.0;
  tax: number = 0.13;

  // Constructor that takes ActivatedRoute to handle data through pages
  constructor(private route: ActivatedRoute) {

    // Manipulate the incoming object from main page
    this.route.queryParams.subscribe(params => {
      if ('reservation' in params) {

        this.reservation = JSON.parse(params['reservation']); // parse the incoming object to the current reservation
        this.referenceNum = this.generateRngRef(1000, 9999);
        console.log('reservation: ', this.reservation);

        this.calculateFee(this.reservation);
      }
    });
  }

  // Random number that's generated with min max inclusively
  generateRngRef(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  
  // Using the object, keys and values for lookups and cleaner code
  calculateFee(reservation: Reservation) {
    if (reservation) {
      const rateTable = {
        sedan: { hourly: 7, flat: 70 },
        suv: { hourly: 12, flat: 100 },
        seat: { hourly: 1, flat: 10 }
      };

      if (reservation.carType in rateTable) {
        // read the rates based on the carType as key
        let type = rateTable[reservation.carType];
        let hourly = type.hourly;
        let flat = type.flat;
        let days = Math.ceil(reservation.hour / 24);

        if (reservation.hour <= 5) {
          // hourly charge
          this.subTotal = (reservation.hour * hourly) + (reservation.childSeat ? reservation.hour * rateTable['seat'].hourly: 0);
        } else {
          // day charge
          this.subTotal = (days * flat) + (reservation.childSeat ? days * rateTable['seat'].flat : 0);
        }
      }; 
    };
  }

  ngOnInit() {
  }

}
