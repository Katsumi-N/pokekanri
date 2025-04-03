package com.example.pokekanri_notification.domain

import arrow.core.Either

interface NotificationRepository {
    fun all(userId: UserId): Either<FindError, List<NotificationWithContent>> = throw NotImplementedError()
    
    sealed class FindError {
        data class Unexpected(val cause: Throwable) : FindError()
    }
}
