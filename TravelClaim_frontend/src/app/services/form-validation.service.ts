import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormValidationService {

  constructor() { }


  validateDate(row: AbstractControl, userDepartment: string) {

    let flag = false;
    let message = '';

    const selectedDate = row.get('date')?.value;
    if (!selectedDate) {
      flag = true;
      message = 'Date is required.';
    }

    const currentDate = new Date();
    const selectedDateObj = new Date(selectedDate);
    const dayDifference = Math.ceil(Math.abs(currentDate.getTime() - selectedDateObj.getTime()) / (1000 * 3600 * 24));

    if (dayDifference > 7 && !(userDepartment === 'sales' || userDepartment === 'service')) {
      flag = true;
      message = 'Date cannot be older than 7 days.';
    }
    else if (dayDifference > 30 && (userDepartment === 'sales' || userDepartment === 'service')) {
      flag = true;
      message = 'Date cannot be older than 30 days.';
    }

    return { flag, message };
  }












  isDistanceInvalid(row: AbstractControl): boolean {
    const distance = (row as FormGroup).get('distanceKm')?.value;
    return distance !== null && distance > 200;
  }

  isVehicleTypeInvalid(row: AbstractControl, userGrade: string): boolean {
    const userGradeLower = userGrade;
    const vehicleType = (row as FormGroup).get('vehicleType')?.value;

    if (userGradeLower === 'lm-0' && vehicleType !== 'Two Wheeler' && vehicleType !== '') {
      return true;
    }
    return false;
  }

  validateOwnVehicleRow(row: AbstractControl) {
    const vehicleType = (row as FormGroup).get('vehicleType')?.value;
    let ratePerKm = (row as FormGroup).get('rateKm')?.value;
    let openingKm = (row as FormGroup).get('openingKm')?.value;
    let closingKm = (row as FormGroup).get('closingKm')?.value;
    let totalKm = (row as FormGroup).get('totalKm')?.value;
    let tollNother = (row as FormGroup).get('tollNother')?.value;
    let totalAmount = (row as FormGroup).get('totalAmount')?.value;

    // Automatically set ratePerKm based on vehicle type
    if (vehicleType) {
      ratePerKm = vehicleType === 'Two Wheeler' ? 6 : 12;
    } else {
      ratePerKm = 0;
    }
    // (row as FormGroup).get('rateKm')?.setValue(ratePerKm);

    // Calculate totalKm 
    openingKm = Number(openingKm) || 0;
    closingKm = Number(closingKm) || 0;

    // (row as FormGroup).get('openingKm')?.setValue(openingKm);
    // (row as FormGroup).get('closingKm')?.setValue(closingKm);

    totalKm = closingKm > openingKm ? closingKm - openingKm : 0;
    // (row as FormGroup).get('totalKm')?.setValue(totalKm);

    // Ensure toolFastagParking is a valid number
    tollNother = Number(tollNother) || 0;
    // (row as FormGroup).get('tollNother')?.setValue(tollNother);

    // Calculate total amount
    totalAmount = (totalKm * ratePerKm) + tollNother;
    // (row as FormGroup).get('totalAmount')?.setValue(totalAmount);

    return { ratePerKm, openingKm, closingKm, totalKm, tollNother, totalAmount };
  }

  isOpeningKmInvalid(row: AbstractControl): boolean {
    const openingKm = (row as FormGroup).get('openingKm')?.value;
    const closingKm = (row as FormGroup).get('closingKm')?.value;

    if (openingKm == null || closingKm == null) {
      return false;
    }
    return openingKm > closingKm;
  }

  isTotalDistanceInvalid(row: AbstractControl): boolean {
    const totalDistance = (row as FormGroup).get('totalKm')?.value;
    if (!totalDistance) return false;
    const distance = Number(totalDistance);
    return !isNaN(distance) && distance > 200;
  }










  validateTime(row: AbstractControl): boolean {


    const startTime = row.get('startTime')?.value;
    const endTime = row.get('endTime')?.value;

    let haltTimeFlag = true; // Default value

    if (startTime && endTime) {
      const start = new Date(`1970-01-01T${startTime}:00`);
      const end = new Date(`1970-01-01T${endTime}:00`);
      const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60); // Convert to hours

      haltTimeFlag = diff <= 4; // Disable if 4 or fewer hours
      console.log('haltTimeFlag:', haltTimeFlag);


    } else {
      haltTimeFlag = true; // Default to disabled if times are missing
      // row.get('lodging')?.disable();
      // row.get('lodging')?.setValue('');
      // lodgingValidationMessages[index] = '';
      // lodgingValidationFlags[index] = false;
    }

    return haltTimeFlag; // Return flag
  }

  validateDestination(row: AbstractControl, cityData: { cityLevel: string; city: string; area: string }[],
    isAPlusCity: boolean, isACity: boolean, isBCity: boolean,
    redArea: boolean, orangeArea: boolean, greenArea: boolean) {

    isAPlusCity = false;
    isACity = false;
    isBCity = false;

    redArea = false;
    orangeArea = false;
    greenArea = false;

    const destinationCity = row.get('destinationCity')?.value;
    if (destinationCity == 'Pune' || destinationCity == 'Gurugram') {
      row.get('da')?.disable(); // Disable lodging field
      row.get('da')?.setValue(''); // Reset lodging value
    } else {
      row.get('da')?.enable(); // Disable lodging field
    }
    isAPlusCity = cityData.some(data => data.city === destinationCity && data.cityLevel === "A+");
    isACity = cityData.some(data => data.city === destinationCity && data.cityLevel === "A");
    isBCity = cityData.some(data => data.city === destinationCity && data.cityLevel === "B");

    redArea = cityData.some(data => data.city === destinationCity && data.area === "red");
    orangeArea = cityData.some(data => data.city === destinationCity && data.area === "orange");
    greenArea = cityData.some(data => data.city === destinationCity && data.area === "green");


    return { isAPlusCity, isACity, isBCity, redArea, orangeArea, greenArea };
  }

  validateLodging(row: AbstractControl, isAPlusCity: boolean, isACity: boolean, isBCity: boolean, userGrade: string): { flag: boolean; message: string } {

    let flag = false;
    let message = '';
    const lodgingPrice = row.get('lodging')?.value;
    const destinationCheck = row.get('destinationCity')?.value;

    let maxLimit = 0;


    // Set base limits based on user grade
    // if (userGrade.toLocaleLowerCase() === 'lm0') {
    //   maxLimit = 3500;
    // } else if (['lm1', 'jm1', 'jm2'].includes(userGrade)) {
    //   maxLimit = 5000;
    //   console.log("hitting")
    // } else if (['mm1', 'sm3'].includes(userGrade)) {
    //   maxLimit = 8000;
    // }

    // Adjust limits based on city type if applicable
    if (isAPlusCity) {
      if (userGrade === 'lm-0') { maxLimit = 3500; }
      else if (['lm-1', 'lm-2', 'jm-1', 'jm-2'].includes(userGrade)) { maxLimit = 5000; }
      else if (['mm-1', 'mm-2', 'sm-1', 'sm-2', 'sm-3'].includes(userGrade)) { maxLimit = 8000; }
    } else if (isACity) {
      if (userGrade === 'lm-0') { maxLimit = 2500; }
      else if (['lm-1', 'lm-2', 'jm-1', 'jm-2'].includes(userGrade)) { maxLimit = 4000; }
      else if (['mm-1', 'mm-2', 'sm-1', 'sm-2', 'sm-3'].includes(userGrade)) { maxLimit = 7000; }
    } else if (isBCity) {
      if (userGrade === 'lm-0') { maxLimit = 2000; }
      else if (['lm-1', 'lm-2', 'jm-1', 'jm-2'].includes(userGrade)) { maxLimit = 3500; }
      else if (['mm-1', 'mm-2', 'sm-1', 'sm-2', 'sm-3'].includes(userGrade)) { maxLimit = 5500; }
    }

    // Validate lodging price against max limit
    if (destinationCheck == '') {
      flag = false;
      message = '';
    } else {
      if (lodgingPrice > maxLimit) {
        flag = true;
        message = `You can not exceed ${maxLimit}.`;
      }
    }

    return { flag, message };
  }




  validateDA(row: AbstractControl, userGrade: string,
    redArea: boolean, orangeArea: boolean, greenArea: boolean
  ): { flag: boolean; message: string } {


    let halfTimeFlag = this.validateTime(row);
    let flag = false;
    let message = '';
    const daPrice = row.get('da')?.value;
    const destinationCheck = row.get('destinationCity')?.value;
    let maxLimit = 0;


    // Determine base limit based on userGrade
    if (userGrade === 'lm-0') {
      maxLimit = 600;
    } else if (['lm-1', 'lm-2', 'jm-1', 'jm-2'].includes(userGrade)) {
      maxLimit = 700;
    } else if (['mm-1', 'mm-2', 'sm-1', 'sm-2', 'sm-3'].includes(userGrade)) {
      maxLimit = 800;
    }

    if (redArea) {
      maxLimit *= 2;
    } else if (orangeArea) {
      maxLimit *= 1.5;
    }
    if (halfTimeFlag) {
      maxLimit = maxLimit / 2;
    }

    // Validate the daPrice against the calculated maxLimit
    // if (daPrice > maxLimit) {
    //   flag = true;
    //   message = `You cannot exceed ${maxLimit} in this area.`;
    // }

    if (destinationCheck == '') {
      flag = false;
      message = '';
    } else { 
      if (daPrice > maxLimit) {
        flag = true;
        message = `You can not exceed ${maxLimit}.`;
      }
    }

    return { flag, message };
  }

  validateFA(row: AbstractControl, userGrade: string): { flag: boolean; message: string } {

    let flag = false;
    let message = '';
    const faPrice = row.get('fa')?.value;

    if (userGrade === 'lm-0' && faPrice > 1400) {
      flag = true;
      message = 'You cannot exceed 1400.';
    } else if (['lm-1', 'lm-2', 'jm-1', 'jm-2'].includes(userGrade) && faPrice > 1500) {
      flag = true;
      message = 'You cannot exceed 1500.';
    } else if (['mm-1', 'mm-2', 'sm-1', 'sm-2', 'sm-3'].includes(userGrade) && faPrice > 1600) {
      flag = true;
      message = 'You cannot exceed 1600.';
    }

    return { flag, message };
  }



  validateOthers(row: AbstractControl): { flag: boolean; message: string } {

    let flag = false;
    let message = '';
    const otherPrice = row.get('other')?.value;

    if (otherPrice > 500) {
      flag = true;
      message = 'Other Price is allowed up to 500 only.';
    }
    return { flag, message };
  }



  validateConveyMode(row: AbstractControl, userGrade: string): { flag: boolean; message: string } {
    let flag = false;
    let message = '';
    const isConveyMode = row.get('conveyMode')?.value;
    const empGrade = userGrade;
    if (['lm-0', 'lm-1', 'lm-2'].includes(empGrade) && isConveyMode == 'Four Wheeler') {
      flag = true;
      message = 'Four Wheeler is not allowed below JM-1 grade.';
    } else {
      flag = false;
      message = '';
    }
    return { flag, message };
  }



  calcDomstConvTotalAmt(row:AbstractControl):number{
    let totalAmount = 0;
    const convAmt = Number(row.get('convAmt')?.value) || 0;
    const tollFastagParking = Number(row.get('tollNother')?.value) || 0;
    const trainExp = Number(row.get('trainExp')?.value) || 0;
    const airExp = Number(row.get('airExp')?.value) || 0;
    totalAmount= convAmt + tollFastagParking + trainExp + airExp
    return totalAmount;
  }

}
