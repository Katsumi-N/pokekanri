package com.example.pokekanri_notification.presentation.model

import com.example.pokekanri_notification.domain.Notification
import java.time.LocalDateTime

data class NotificationResponse(
    val id: Long,
    val announcementId: Long,
    val userId: String,
    val isRead: Boolean,
    val createdAt: LocalDateTime
)