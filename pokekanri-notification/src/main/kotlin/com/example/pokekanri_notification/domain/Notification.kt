package com.example.pokekanri_notification.domain

import arrow.core.Either
import arrow.core.raise.either
import arrow.core.raise.ensure
import java.time.LocalDateTime

data class Notification(
    val id: NotificationId?,
    val announcementId: AnnouncementId,
    val userId: UserId,
    val isRead: Boolean,
    val createdAt: LocalDateTime
) {
    companion object {
        fun create(
            announcementId: AnnouncementId,
            userId: UserId,
        ): Notification = Notification(
            id = null,
            announcementId = announcementId,
            userId = userId,
            isRead = false,
            createdAt = LocalDateTime.now()
        )
    }

    fun markAsRead(): Either<NotificationError, Notification> = either {
        ensure(!isRead) { NotificationError.AlreadyRead }
        copy(isRead = true)
    }
}

@JvmInline
value class NotificationId(val value: Long)

@JvmInline
value class UserId(val value: Long)

sealed interface NotificationError {
    data object AlreadyRead : NotificationError
}