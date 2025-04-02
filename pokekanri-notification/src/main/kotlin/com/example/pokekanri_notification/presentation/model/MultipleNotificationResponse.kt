package com.example.pokekanri_notification.presentation.model

import com.example.pokekanri_notification.domain.Notification
import com.fasterxml.jackson.annotation.JsonProperty
import jakarta.validation.Valid

data class MultipleNotificationResponse(
    @field:Valid
    @field:JsonProperty("notifications", required = true) val notifications: List<Notification>,

    @field:JsonProperty("total_count", required = true) val totalCount: Int,
)