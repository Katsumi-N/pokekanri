package com.example.pokekanri_notification.domain

import arrow.core.Either

interface NotificationRepository {
    fun all(userId: UserId): Either<FindAllError, List<NotificationWithContent>>

    fun findByIdAndUserId(id: NotificationId, userId: UserId): Either<FindByIdError, Notification>

    fun save(notification: Notification): Either<SaveError, Notification> // Return updated Notification

    fun insert(notification: Notification): Either<InsertError, Notification> // Return created Notification

    sealed interface FindAllError {
        data class Unexpected(val cause: Throwable) : FindAllError
    }

    sealed interface FindByIdError {
        data object NotFound : FindByIdError
        data class Unexpected(val cause: Throwable) : FindByIdError
    }

    sealed interface SaveError {
        data class Unexpected(val cause: Throwable) : SaveError
    }

    sealed interface InsertError {
        data object DuplicateEntry : InsertError // Add error for duplicate entry
        data class Unexpected(val cause: Throwable) : InsertError
    }
}
