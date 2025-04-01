package com.example.pokekanri_notification.domain

import arrow.core.Either

interface NotificationRepository {
    suspend fun save(notification: Notification): Either<NotificationPersistenceError, Notification>
    suspend fun findByIdAndUserId(notificationId: NotificationId, userId: UserId): Either<NotificationPersistenceError, Notification>
    suspend fun findAllByUserId(userId: UserId): Either<NotificationPersistenceError, List<Notification>>
}

sealed interface NotificationPersistenceError {
    data object NotFound : NotificationPersistenceError
    data class DatabaseError(val message: String) : NotificationPersistenceError
}