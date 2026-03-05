package com.serviceflow.dto;

import com.serviceflow.model.Status;
import lombok.Data;

@Data
public class StatusUpdateRequest {
    private Status status;
    private String remarks;
}
