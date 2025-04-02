package com.example.pokekanri_notification.usecase

import arrow.core.Either
import arrow.core.getOrElse
import arrow.core.right
import com.example.pokekanri_notification.domain.Notification
import com.example.pokekanri_notification.domain.NotificationRepository
import com.example.pokekanri_notification.domain.UserId
import org.springframework.stereotype.Service

interface GetUserNotificationUseCase {
    /**
     * ユーザーの通知一覧のDTO
     */
    data class UserNotifications(
        val notifications: List<Notification>,
        val notificationsCount: Int
    )
    suspend fun execute(userId: UserId): Either<Error, UserNotifications> = throw NotImplementedError()

    /**
     * ユースケースのエラー
     * 今の所特になし
     */
    sealed interface Error
}

@Service
class GetUserNotificationUseCaseImpl(val notificationRepository: NotificationRepository) : GetUserNotificationUseCase {
    override suspend fun execute(userId: UserId): Either<GetUserNotificationUseCase.Error, GetUserNotificationUseCase.UserNotifications> {
        val userNotifications = notificationRepository.findAllByUserId(userId).getOrElse { throw UnsupportedOperationException("想定外のエラー") }

        return GetUserNotificationUseCase.UserNotifications(
            notifications = userNotifications,
            notificationsCount = userNotifications.size
        ).right()
    }
}