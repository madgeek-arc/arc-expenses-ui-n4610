/*
* created by myrto on 27/4/2018
* */

import { Injectable } from '@angular/core';
import { ProjectBudgetSummary, RequestPayment, RequestResponse, RequestSummary } from '../domain/operation';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Paging } from '../domain/extraClasses';
import { ContactUsMail } from '../domain/operation';
import { environment } from '../../environments/environment';

const headerOptions = {
    headers : new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json'),
    withCredentials: true
};


@Injectable()
export class ManageRequestsService {

    apiUrl = environment.API_ENDPOINT + '/request/';

    constructor(private http: HttpClient) {}

    add<T>(newRequest: FormData): Observable<HttpEvent<T>> {
        const url = `${this.apiUrl}add`;
        console.log(`calling ${url}`);

        const req = new HttpRequest('POST', url, newRequest, {
            reportProgress: true,
            withCredentials: true
        });
        return this.http.request(req);
    }

    submitUpdate<T>(phase: string, mode: string, requestId: string, submittedStage?: FormData): Observable<HttpEvent<T>> {
        /* ACCEPTED PHASE VALUES: request, payment */
        /* ACCEPTED MODE VALUES: approve, reject, downgrade, cancel */
        const url = `${environment.API_ENDPOINT}/${phase}/${mode}/${requestId}`;
        console.log(`calling ${url}`);

        let formData = new FormData();
        if (submittedStage) { formData = submittedStage; }

        const req = new HttpRequest('POST', url, formData, {
            reportProgress: true,
            withCredentials: true
        });
        return this.http.request(req);
    }

    cancelRequestPayment(paymentId: string, cancelRequest: boolean): Observable<any> {
        const url = `${environment.API_ENDPOINT}/payment/cancel/${paymentId}`;
        console.log(`calling ${url}`);

        const formData = new FormData();
        formData.append('cancel_request', cancelRequest ? 'true' : 'false');

        // returns json of the form {id: paymentID}
        const req = new HttpRequest('POST', url, formData, { withCredentials: true });
        return this.http.request<any>(req);
    }

    addRequestPayment(requestId: string): Observable<any> {
        const url = `${environment.API_ENDPOINT}/payment/add/${requestId}`;
        console.log(`calling ${url}`);
        console.log(`sending ${JSON.stringify(requestId)}`);

        return this.http.post<any>(url, {}, headerOptions);
    }

    getRequestApprovalById(requestApproval: string): Observable<RequestResponse> {
        const url = `${this.apiUrl}approval/getById/${requestApproval}`;
        console.log(`calling ${url}`);
        return this.http.get<RequestResponse>(url, headerOptions);
    }

    getRequestPaymentById(requestPaymentId: string): Observable<RequestResponse> {
        const url = `${environment.API_ENDPOINT}/payment/getById/${requestPaymentId}`;
        console.log(`calling ${url}`);
        return this.http.get<RequestResponse>(url, headerOptions);
    }

    getPaymentsOfRequest(requestId: string): Observable<Paging<RequestPayment>> {
        const url = `${this.apiUrl}payments/getByRequestId/${requestId}`;
        console.log(`calling ${url}`);
        return this.http.get<Paging<RequestPayment>>(url, headerOptions);
    }

    getProjectBudgets(requestId: string): Observable<ProjectBudgetSummary[]> {
        const url = `${this.apiUrl}budgets/${requestId}`;
        console.log(`calling ${url}`);
        return this.http.get<ProjectBudgetSummary[]>(url, headerOptions);
    }

    searchAllRequestSummaries(searchField: string, status: string[], type: string[],
                              stage: string[], from: string, quantity: string,
                              order: string, orderField: string, editable: string,
                              isMine: string, extraFilters?: Map<string, string>): Observable<Paging<RequestSummary>> {
        let statusList = '';
        status.forEach( x => statusList = statusList + '&status=' + x.toUpperCase() );
        let typesList = '';
        type.forEach( x => typesList = typesList + '&type=' + x.toUpperCase() );
        let stagesList = '';
        stage.forEach( x => stagesList = stagesList + '&stage=' + x );
        let url = `${this.apiUrl}getAll?from=${from}&quantity=${quantity}${statusList}${typesList}${stagesList}`;
        url = url + `&order=${order}&orderField=${orderField.toUpperCase()}`;
        url = url + `&editable=${editable}&isMine=${isMine}&searchField=${searchField}`;
        if (extraFilters) {
            extraFilters.forEach(
                (val: string, k: string) => url = url + '&' + k + '=' + val
            );
        }

        console.log(`calling ${url}`);
        return this.http.get<Paging<RequestSummary>>(url, headerOptions);
    }

    sendContactFormToService(params: ContactUsMail): Observable<any> {
        const url = `${environment.API_ENDPOINT}/contactUs/sendMail`;
        console.log(`calling ${url}`);
        console.log(`sending ${JSON.stringify(params)}`);

        return this.http.post<any>(url, JSON.stringify(params), headerOptions);
    }
}
