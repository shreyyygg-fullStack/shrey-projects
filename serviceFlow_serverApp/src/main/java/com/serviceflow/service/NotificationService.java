package com.serviceflow.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void notifyEngineer(String engineerId, String message) {
        messagingTemplate.convertAndSendToUser(engineerId, "/queue/notifications", message);
    }

    public void broadcastStatusUpdate(String message) {
        messagingTemplate.convertAndSend("/topic/updates", message);
    }
}
