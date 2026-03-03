import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { GlobalConstants } from '../common/global-constants';

@Injectable({
  providedIn: 'root'
})
export class DisplayBoardService {

  constructor(private http: HttpClient) { }


  async savePriorityList(indentNum: any, remarks: string, priority_type: any, position: any, region: any, indentFrieghtTrms: any, indentDispatchLocation: any, indentsLinked: any): Promise<Observable<void>> {

    return this.http.post<void>(`${GlobalConstants.apiSetPriorityIndent}`, { indentNumber: indentNum, remarks: remarks, priority_type: priority_type, indentPosition: position, indentRegion: region, indentFrieghtTrms: indentFrieghtTrms, indentDispatchLocation: indentDispatchLocation, indentsLinked: indentsLinked })
      .pipe(map(Response => {

        var formUpdateStatus;
        formUpdateStatus = Response;
        let affectedRows = formUpdateStatus["affectedRows"];

        if (affectedRows == 1) {

          Swal.fire({
            icon: 'success',
            title: 'Data Updated against priority <br> Indent No.- ' + indentNum,
            showConfirmButton: true,
            confirmButtonColor: '#282E89',
            allowOutsideClick: false,
            customClass: {
              confirmButton: 'rounded-0',
            },
          })

        } else {
          Swal.fire({
            title: "Error in updating the Priority Data!",
            icon: 'warning',
            text: '',
            confirmButtonColor: '#282E89',
            allowOutsideClick: false,
            customClass: {
              confirmButton: 'rounded-0',
            },
          });
        }
      }));

  }

  async changeIndentPriorityPosition(selectedIndentNum: any, indentPosition: any, assignedIndent: any, remarks: string, priorityType: any, region: any, indentFrieghtTrms: any, indentDispatchLocation: any, indentsLinked: any): Promise<Observable<void>> {

    return await this.http.post<void>(`${GlobalConstants.apiChangeIndentPosition}`, { selectedIndentNumber: selectedIndentNum, selectedIndentPosition: indentPosition, assignedIndentNum: assignedIndent, remarks: remarks, priority_type: priorityType, indentRegion: region, indentFrieghtTrms: indentFrieghtTrms, indentDispatchLocation: indentDispatchLocation, indentsLinked: indentsLinked  })
      .pipe(map(Response => {

        var formUpdateStatus;
        formUpdateStatus = Response;
        let affectedRows = formUpdateStatus["affectedRows"];

        if (affectedRows == 1) {

          if (indentPosition == '999') {

            Swal.fire({
              icon: 'success',
              title: 'Data Updated against priority <br> Indent No.- ' + selectedIndentNum,
              showConfirmButton: true,
              confirmButtonColor: '#282E89',
              allowOutsideClick: false,
              customClass: {
                confirmButton: 'rounded-0',
              },
            })

          } else {

            Swal.fire({
              icon: 'success',
              title: 'Data Updated against priority <br> Indent No.- ' + selectedIndentNum + ' for ' + indentPosition + ' position.',
              showConfirmButton: true,
              confirmButtonColor: '#282E89',
              allowOutsideClick: false,
              customClass: {
                confirmButton: 'rounded-0',
              },
            })
          }
        } else {

          Swal.fire({
            title: "Error in updating the Priority Data!",
            icon: 'warning',
            text: '',
            confirmButtonColor: '#282E89',
            allowOutsideClick: false,
            customClass: {
              confirmButton: 'rounded-0',
            },
          })
        }
      }));
  }


  updateIndentPositions(dailyIndents: any[]): Observable<any> {
    return this.http.post(`${GlobalConstants.apiUpdateIndentPosition}`, dailyIndents).pipe((map(Response => {

      var formUpdateStatus;
      formUpdateStatus = Response;
      let affectedRows = formUpdateStatus["affectedRows"];

      if (affectedRows == 1) {

        Swal.fire({
          icon: 'success',
          title: 'Positions are Updated Successfully',
          showConfirmButton: true,
          confirmButtonColor: '#282E89',
          allowOutsideClick: false,
          customClass: {
            confirmButton: 'rounded-0',
          },
        })
          .then((result) => {
            if (result.isConfirmed) {
              window.location.reload();
            }
          });
      } else {
        Swal.fire({
          title: "Error in setting the Positions.",
          icon: 'warning',
          text: '',
          confirmButtonColor: '#282E89',
          allowOutsideClick: false,
          customClass: {
            confirmButton: 'rounded-0',
          },
        })
      }

    })),

      catchError(error => {
        Swal.fire({
          title: "Error in setting the Positions.",
          icon: 'warning',
          text: '',
          confirmButtonColor: '#282E89',
          allowOutsideClick: false,
          customClass: {
            confirmButton: 'rounded-0',
          },
        })
        throw 'Error in saving positions: ' + error;
      })
    );
  }


  async savePaginationDetails(pageStatus: any, pJumpStaus: any, pageJumpNum: any, pageTimer: any): Promise<Observable<void>> {

    return this.http.post<void>(`${GlobalConstants.apiSavePaginationDetails}`, { pStatus: pageStatus, pageJumpStatus: pJumpStaus, pJumpNumber: pageJumpNum, pTimer: pageTimer })
      .pipe(map(Response => {

        var formUpdateStatus;
        formUpdateStatus = Response;
        let affectedRows = formUpdateStatus["affectedRows"];

        if (affectedRows == 1) {

          Swal.fire({
            icon: 'success',
            title: 'IBoard setting has been saved successfully.',
            showConfirmButton: true,
            confirmButtonColor: '#282E89',
            allowOutsideClick: false,
            customClass: {
              confirmButton: 'rounded-0',
            },
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.reload();
            }
          });
        } else {
          Swal.fire({
            title: "Error in saving the IBoard setting!",
            icon: 'warning',
            text: '',
            confirmButtonColor: '#282E89',
            allowOutsideClick: false,
            customClass: {
              confirmButton: 'rounded-0',
            },
          });
        }
      }));
  }

  getPriorityIndentsByDate(fromDate: string, toDate: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    const param = new HttpParams()
      .set('startDate', fromDate)
      .set('endingDate', toDate);
    const options = { headers };
    return this.http.post<any>(GlobalConstants.apiPriorityIndentByDate, param, options)
      .pipe(map(Response => {
        let asynresult = Response;
        return asynresult;
      }))

  }


}
