package com.serviceflow.service;

import com.serviceflow.model.ServiceLog;
import com.serviceflow.model.ServiceRequest;
import com.serviceflow.model.Status;
import com.serviceflow.model.User;
import com.serviceflow.repository.ServiceLogRepository;
import com.serviceflow.repository.ServiceRequestRepository;
import com.serviceflow.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class ServiceRequestService {
    @Autowired
    private ServiceRequestRepository requestRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ServiceLogRepository logRepository;
    @Autowired
    private NotificationService notificationService;

    public List<ServiceRequest> getRequestsByEngineer(Long engineerId) {
        return requestRepository.findByAssignedEngineerId(engineerId);
    }

    public ServiceRequest getRequest(Long id) {
        return requestRepository.findById(id).orElseThrow(() -> new RuntimeException("Service Request not found"));
    }

    @Transactional
    public ServiceRequest createRequest(ServiceRequest request) {
        request.setStatus(Status.REQUEST_RAISED);
        ServiceRequest saved = requestRepository.save(request);
        addLog(saved, "CREATED", "Service request raised by ADMIN");
        return saved;
    }

    @Transactional
    public ServiceRequest assignRequest(Long requestId, Long engineerId) {
        ServiceRequest request = getRequest(requestId);
        if (request.getStatus() != Status.REQUEST_RAISED && request.getStatus() != Status.ASSIGNED) {
            throw new RuntimeException("Invalid state transition. Can only assign when REQUEST_RAISED or ASSIGNED.");
        }
        User engineer = userRepository.findById(engineerId)
                .orElseThrow(() -> new RuntimeException("Engineer not found"));
        request.setAssignedEngineer(engineer);
        request.setStatus(Status.ASSIGNED);
        ServiceRequest saved = requestRepository.save(request);
        addLog(saved, "ASSIGNED", "Assigned to engineer: " + engineer.getName());
        notificationService.notifyEngineer(engineerId.toString(), "You have a new task assigned: #" + saved.getId());
        return saved;
    }

    @Transactional
    public ServiceRequest acceptRequest(Long requestId, Long engineerId) {
        ServiceRequest request = getRequest(requestId);
        if (request.getAssignedEngineer() == null || !request.getAssignedEngineer().getId().equals(engineerId)) {
            throw new RuntimeException("You are not assigned to this request.");
        }
        if (request.getStatus() != Status.ASSIGNED) {
            throw new RuntimeException("Invalid state transition. Can only ACCEPT when ASSIGNED.");
        }
        request.setStatus(Status.ACCEPTED);
        ServiceRequest saved = requestRepository.save(request);
        addLog(saved, "ACCEPTED", "Accepted by engineer");
        notificationService.broadcastStatusUpdate("Request #" + requestId + " has been accepted");
        return saved;
    }

    @Transactional
    public ServiceRequest updateStatus(Long requestId, Status newStatus, String remarks, Long engineerId) {
        ServiceRequest request = getRequest(requestId);
        if (request.getAssignedEngineer() == null || !request.getAssignedEngineer().getId().equals(engineerId)) {
            throw new RuntimeException("You are not assigned to this request.");
        }
        if (!isValidTransition(request.getStatus(), newStatus)) {
            throw new RuntimeException("Invalid state transition from " + request.getStatus() + " to " + newStatus);
        }
        request.setStatus(newStatus);
        ServiceRequest saved = requestRepository.save(request);
        addLog(saved, "STATUS_UPDATE", remarks != null ? remarks : "Status updated to " + newStatus);
        notificationService.broadcastStatusUpdate("Request #" + requestId + " status changed to " + newStatus);
        return saved;
    }

    @Transactional
    public ServiceLog addLogPublic(Long requestId, String action, String remarks) {
        return addLog(getRequest(requestId), action, remarks);
    }

    private ServiceLog addLog(ServiceRequest request, String action, String remarks) {
        ServiceLog log = new ServiceLog();
        log.setServiceRequest(request);
        log.setAction(action);
        log.setRemarks(remarks);
        return logRepository.save(log);
    }

    private boolean isValidTransition(Status current, Status next) {
        return switch (current) {
            case ACCEPTED -> next == Status.ON_THE_WAY;
            case ON_THE_WAY -> next == Status.IN_PROGRESS;
            case IN_PROGRESS -> next == Status.RESOLVED;
            case RESOLVED -> next == Status.CUSTOMER_CONFIRMED || next == Status.IN_PROGRESS;
            case CUSTOMER_CONFIRMED -> next == Status.CLOSED;
            default -> false;
        };
    }
}
