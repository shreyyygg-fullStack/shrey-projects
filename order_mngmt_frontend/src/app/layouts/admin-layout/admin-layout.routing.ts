import { Routes } from '@angular/router';
import { DashboardComponent } from 'src/app/dashboard/dashboard.component';
import { HomeComponent } from 'src/app/home/home.component';
import { IndentmgmtComponent } from 'src/app/indentmgmt/indentmgmt.component';
import { FileuploadComponent } from 'src/app/fileupload/fileupload.component';
import { UsermanagementComponent } from 'src/app/usermanagement/usermanagement.component';
import { IndentlistComponent } from 'src/app/indentlist/indentlist.component';
import { ApplicationlogsComponent } from 'src/app/applicationlogs/applicationlogs.component';
import { EMailSettingComponent } from 'src/app/e-mail-setting/e-mail-setting.component';
import { DisplayBoardComponent } from 'src/app/display-board/display-board.component';
import { DailyPlanningComponent } from 'src/app/daily-planning/daily-planning.component';
import { IboardSettingComponent } from 'src/app/iboard-setting/iboard-setting.component';
import { IboardFilesComponent } from 'src/app/iboard-files/iboard-files.component';
import { InvEmailSettingComponent } from 'src/app/inv-email-setting/inv-email-setting.component';
import { ServiceManagementComponent } from 'src/app/service-management/service-management.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'home', component: HomeComponent, canActivate: [] },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'indentmgmt', component: IndentmgmtComponent },
    { path: 'file', component: FileuploadComponent },
    { path: 'indentlist', component: IndentlistComponent },
    { path: 'usermanagement', component: UsermanagementComponent },
    { path: 'indentlogs', component: ApplicationlogsComponent },
    { path: 'email-setting', component: EMailSettingComponent },
    { path: 'iboard-planning', component: DisplayBoardComponent },
    { path: 'daily-planning', component: DailyPlanningComponent },
    { path: 'iboard-setting', component: IboardSettingComponent },
    { path: 'iboard-files', component: IboardFilesComponent },
    { path: 'inv-email-setting', component: InvEmailSettingComponent },
    { path: 'service-management', component: ServiceManagementComponent },
];
