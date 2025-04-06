package com.example.pokekanri_notification.presentation.model

import com.example.pokekanri_notification.domain.NotificationWithContent
import com.fasterxml.jackson.annotation.JsonProperty
import jakarta.validation.Valid

data class MarkReadRequest(
    @field:JsonProperty("notification_id", required = true) val notificationId: Long,

    @field:JsonProperty("announcement_id", required = false) val announcementId: Long? = null,
)