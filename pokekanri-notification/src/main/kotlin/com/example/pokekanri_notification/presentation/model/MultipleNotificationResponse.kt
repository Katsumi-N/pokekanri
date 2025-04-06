package com.example.pokekanri_notification.presentation.model

import com.example.pokekanri_notification.domain.NotificationWithContent
import com.fasterxml.jackson.annotation.JsonProperty
import jakarta.validation.Valid

data class MultipleNotificationResponse(
    @field:Valid
    @field:JsonProperty("notifications", required = true) val notifications: List<NotificationWithContent>,

    @field:JsonProperty("count", required = true) val count: Int
)