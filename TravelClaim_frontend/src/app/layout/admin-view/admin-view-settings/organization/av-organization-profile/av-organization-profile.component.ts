import { NgIf, NgClass } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, computed, effect, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { firstValueFrom, map } from 'rxjs';
import { EncryptionService } from '../../../../../services/encryption.service';
import { GlobalConstants } from '../../../../../shared/common/global-constants';

@Component({
  selector: 'app-av-organization-profile',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgClass],
  templateUrl: './av-organization-profile.component.html',
  styleUrl: './av-organization-profile.component.scss'
})
export class AvOrganizationProfileComponent {

  companyName: string = "";
  companyAddress: string = "";
  phoneNo: string = "";
  city: string = "";
  state: string = "";
  zipCode: string = "";
  country: string = "";
  companyWebsite: string = "";
  applicationDomain: string = "";
  primaryContactEmail: string = "";
  companySupportEmail: string = "";
  baseCurrency: string = "";
  fiscalYear: string = "";
  dateFormat: string = "";

  organizationForm: FormGroup;

  orgInfo: any;

  imagePreview: string | ArrayBuffer | null = null; // Preview the selected image
  uploadedImage: string | ArrayBuffer | null = null;  // Display the uploaded image


  constructor(private fb: FormBuilder, private httpcon: HttpClient, private encdec: EncryptionService) {


    effect(() => {
      // console.log('Data changed:', this.c());

      console.log('zip code Data changed:', this.zipcode());

      this.zipcode() === this.initialZipcodeValue() ? this.inputAlert = false : this.inputAlert = true

    });

    this.organizationForm = this.fb.group({
      companyName: new FormControl('', [Validators.required]),
      companyAddress: new FormControl('', [Validators.required, Validators.minLength(5)]),
      phoneNo: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      zipCode: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
      companyWebsite: new FormControl('', [Validators.required]),
      applicationDomain: new FormControl('', [Validators.required]),
      primaryContactEmail: new FormControl('', [Validators.required, Validators.email]),
      companySupportEmail: new FormControl('', [Validators.required, Validators.email]),
      baseCurrency: new FormControl('', [Validators.required]),
      fiscalYear: new FormControl('', [Validators.required]),
      dateFormat: new FormControl('', [Validators.required]),
      image: [null],
    });

  }

  isFocused = signal(false);

  zipcode = signal('');
  initialZipcodeValue = signal('');
  inputAlert: boolean = false;


  num: number | undefined;

  a = signal(5);
  b = signal(10);
  c = computed(() => this.a() + this.b());

  ngOnInit(): void {
    this.getOrgInfo();

    // console.log("c value", this.c())

    // this.b.set(30);

    // console.log("c value", this.c())
  }

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.zipcode.set(value);
  }

  onFocus() {
    this.isFocused.set(true);
  }


  // Computed signal for dynamic background color
  inputBackground = computed(() =>
    this.zipcode() === this.initialZipcodeValue() ? 'rgb(245, 250, 255)' : 'lightcoral'

    // this.isFocused() && this.zipcode() !== '' ? 'lightcoral' : 'rgb(245, 250, 255)'
  );

  onFileSelect(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput?.files?.[0]) {
      const file = fileInput.files[0];
      this.organizationForm.patchValue({ image: file });
      console.log(file)
      // Preview the image
      const reader = new FileReader();
      reader.onload = (e) => (this.imagePreview = reader.result);
      reader.readAsDataURL(file);
    }
  }


  async onSubmit() {
    if (this.organizationForm.valid) {

      const formData = new FormData();

      const headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      });
      const options = { withCredentials: true, };
      let url: string;
      // let param = new HttpParams();
      url = GlobalConstants.apiSaveOrgInfo;

      formData.append('image', this.organizationForm.get('image')?.value);
      // Append other form data fields
      formData.append('companyName', this.organizationForm.value.companyName);
      formData.append('companyAddress', this.organizationForm.value.companyAddress);
      formData.append('phoneNo', this.organizationForm.value.phoneNo);
      formData.append('city', this.organizationForm.value.city);
      formData.append('state', this.organizationForm.value.state);
      formData.append('zipCode', this.organizationForm.value.zipCode);
      formData.append('country', this.organizationForm.value.country);
      formData.append('companyWebsiteName', this.organizationForm.value.companyWebsite);
      formData.append('applicationDomain', this.organizationForm.value.applicationDomain);
      formData.append('baseCurrency', this.organizationForm.value.baseCurrency);
      formData.append('fiscalYear', this.organizationForm.value.fiscalYear);
      formData.append('dateFormat', this.organizationForm.value.dateFormat);
      formData.append('primaryContactEmail', this.organizationForm.value.primaryContactEmail);
      formData.append('companySupportEmail', this.organizationForm.value.companySupportEmail);

      console.log(formData);

      await this.httpcon.post<any>(url, formData, options)
        .pipe(map(Response => {

          console.log(Response)

          window.location.reload();
        }))
        .subscribe(() => { }, () => {
        });

      console.log('Form Submitted:', this.organizationForm.value);
    } else {
      console.log('Form is invalid');
    }
  }


  zipcodeValue: number | undefined;

  async getOrgInfo() {

    var url = GlobalConstants.apiGetOrgInfo;

    let asyncResult = await firstValueFrom(this.httpcon.get<any[]>(url, { responseType: 'text' as 'json', withCredentials: true }));
    // this.orgInfo = asyncResult;

    if (asyncResult) {

      try {
        this.orgInfo = this.encdec.decodeData(asyncResult);

      } catch (error) {
        console.error('JSON Parsing Error:', error);

      }
    } else {
      console.error('No data received from the server');

    }

    this.companyName = this.orgInfo[0].COMPANY_NAME;
    this.companyAddress = this.orgInfo[0].COMPANY_ADDRESS;
    this.phoneNo = this.orgInfo[0].PHONE_NO;
    this.city = this.orgInfo[0].CITY;
    this.state = this.orgInfo[0].STATE;
    this.zipCode = this.orgInfo[0].ZIP_CODE;
    this.country = this.orgInfo[0].COUNTRY;
    this.companyWebsite = this.orgInfo[0].COMPANY_WEBSITE_NAME;
    this.applicationDomain = this.orgInfo[0].APPLICATION_DOMAIN;
    this.primaryContactEmail = this.orgInfo[0].PRIMARY_CONTACT_EMAIL;
    this.companySupportEmail = this.orgInfo[0].COMPANY_SUPPORT_EMAIL;
    this.baseCurrency = this.orgInfo[0].BASE_CURRENCY;
    this.fiscalYear = this.orgInfo[0].FISCAL_YEAR;
    this.dateFormat = this.orgInfo[0].DATE_FORMAT;

    this.zipcode.set(this.zipCode);

    this.initialZipcodeValue.set(this.zipCode);

    const decodedFileData = atob(this.orgInfo[0].LOGO);

    const mimeType = this.getMimeType("default.png");
    const dataURI = `data:${mimeType};base64,${decodedFileData}`;

    this.uploadedImage = dataURI;

    // console.log(asyncResult);
  }


  getMimeType(fileName: string) {
    const extension = fileName.split('.').pop();
    switch (extension) {
      case 'png':
        return 'image/png';
      case 'jpg':
        return 'image/jpeg';
      case 'jpeg':
        return 'image/jpeg';
      case 'ico':
        return 'image/x-icon';
      default:
        return 'application/octet-stream';
    }
  }




}
