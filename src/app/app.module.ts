import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { ComponentsModule } from './components/components.module';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { SuLayoutComponent } from './layouts/su-layout/su-layout.component';
import { LoginComponent } from './login/login.component';
import { InterceptorInterceptor } from './inserceptor/interceptor.interceptor';
import { NgxUiLoaderConfig, NgxUiLoaderModule, POSITION, SPINNER } from 'ngx-ui-loader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EMailSettingComponent } from './e-mail-setting/e-mail-setting.component';
import { DisplayBoardComponent } from './display-board/display-board.component';
import { DailyPlanningComponent } from './daily-planning/daily-planning.component';
import { IboardSettingComponent } from './iboard-setting/iboard-setting.component';
import { IboardFilesComponent } from './iboard-files/iboard-files.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { InvEmailSettingComponent } from './inv-email-setting/inv-email-setting.component';
import { ServiceManagementComponent } from './service-management/service-management.component';


const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  "bgsColor": "rgba(255,255,255,0)",
  "bgsOpacity": 0.5,
  "bgsPosition": "center-center",
  "bgsSize": 60,
  "bgsType": "ball-spin-clockwise",
  "blur": 5,
  "delay": 0,
  "fastFadeOut": true,
  "fgsColor": "rgba(255,255,255,0)",
  "fgsPosition": "center-center",
  "fgsSize": 60,
  "fgsType": "ball-spin-clockwise",
  "gap": 24,
  "logoPosition": "center-center",
  "logoSize": 120,
  "logoUrl": "",
  "masterLoaderId": "master",
  "overlayBorderRadius": "0",
  "overlayColor": "rgba(40, 40, 40, 0.8)",
  "pbColor": "#f6d285",
  "pbDirection": "ltr",
  "pbThickness": 3,
  "hasProgressBar": true,
  "text": "Loading...",
  "textColor": "#f6d285",
  "textPosition": "top-center",
  "maxTime": -1,
  "minTime": 300
};

@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    SuLayoutComponent,
    LoginComponent,
    EMailSettingComponent,
    DisplayBoardComponent,
    DailyPlanningComponent,
    IboardSettingComponent,
    IboardFilesComponent,
    InvEmailSettingComponent,
    ServiceManagementComponent,


  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    ComponentsModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    NgbModule,PdfViewerModule
  ],

  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: InterceptorInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
