package com.serviceflow.controller;

import com.serviceflow.dto.AssignRequest;
import com.serviceflow.dto.LogRequest;
import com.serviceflow.dto.StatusUpdateRequest;
import com.serviceflow.model.ServiceLog;
import com.serviceflow.model.ServiceRequest;
import com.serviceflow.security.UserDetailsImpl;
import com.serviceflow.service.ServiceRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ServiceRequestController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @GetMapping("/engineer/requests")
    @PreAuthorize("hasAuthority('ENGINEER')")
    public ResponseEntity<List<ServiceRequest>> getAssignedRequests(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(serviceRequestService.getRequestsByEngineer(userDetails.getId()));
    }

    @GetMapping("/request/{id}")
    public ResponseEntity<ServiceRequest> getRequest(@PathVariable Long id) {
        return ResponseEntity.ok(serviceRequestService.getRequest(id));
    }

    @PostMapping("/request")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ServiceRequest> createRequest(@RequestBody ServiceRequest request) {
        return ResponseEntity.ok(serviceRequestService.createRequest(request));
    }

    @PutMapping("/request/{id}/assign")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ServiceRequest> assignRequest(@PathVariable Long id,
            @RequestBody AssignRequest assignRequest) {
        return ResponseEntity.ok(serviceRequestService.assignRequest(id, assignRequest.getEngineerId()));
    }

    @PutMapping("/request/{id}/accept")
    @PreAuthorize("hasAuthority('ENGINEER')")
    public ResponseEntity<ServiceRequest> acceptRequest(@PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(serviceRequestService.acceptRequest(id, userDetails.getId()));
    }

    @PutMapping("/request/{id}/status")
    @PreAuthorize("hasAuthority('ENGINEER')")
    public ResponseEntity<ServiceRequest> updateStatus(@PathVariable Long id,
            @RequestBody StatusUpdateRequest statusRequest, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(serviceRequestService.updateStatus(id, statusRequest.getStatus(),
                statusRequest.getRemarks(), userDetails.getId()));
    }

    @PostMapping("/request/{id}/log")
    public ResponseEntity<ServiceLog> addLogPublic(@PathVariable Long id, @RequestBody LogRequest logRequest) {
        return ResponseEntity
                .ok(serviceRequestService.addLogPublic(id, logRequest.getAction(), logRequest.getRemarks()));
    }
}
