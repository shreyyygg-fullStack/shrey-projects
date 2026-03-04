import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { ChartsModule } from 'ng2-charts';
import { HomeComponent } from '../../home/home.component';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { IndentDetailViewComponent } from '../../shared/modules/indent-detail-view/indent-detail-view.component';
import { IndentmgmtComponent } from '../../indentmgmt/indentmgmt.component';
import { FileuploadComponent } from '../../fileupload/fileupload.component';
import { FilterPipe } from '../../shared/services/filter.pipe';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { DetailsTemplateComponent } from '../../shared/details-template/details-template.component';
import { UsermanagementComponent } from 'src/app/usermanagement/usermanagement.component';
import { CompareUploadedfilesComponent } from 'src/app/shared/compare-uploadedfiles/compare-uploadedfiles.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { FilterPipe2 } from 'src/app/shared/services/filter2.pipe';
import { IndentlistComponent } from 'src/app/indentlist/indentlist.component';
import { ApplicationlogsComponent } from 'src/app/applicationlogs/applicationlogs.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  declarations: [
    HomeComponent,
    DashboardComponent,
    IndentDetailViewComponent,
    IndentmgmtComponent,
    FileuploadComponent,
    FilterPipe,
    FilterPipe2,
    DetailsTemplateComponent,
    UsermanagementComponent,
    CompareUploadedfilesComponent,
    IndentlistComponent,
    ApplicationlogsComponent,
  ],
  imports: [
    CommonModule,
    ChartsModule,
    NgbModule, 
    FormsModule,
    ReactiveFormsModule,
    SweetAlert2Module.forRoot({}),
    NgCircleProgressModule.forRoot({}),
    RouterModule.forChild(AdminLayoutRoutes),PdfViewerModule
  ],
  entryComponents: [DetailsTemplateComponent,
    CompareUploadedfilesComponent]
})
export class AdminLayoutModule { }
