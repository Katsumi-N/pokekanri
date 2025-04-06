package com.example.pokekanri_notification.usecase

import arrow.core.Either
import arrow.core.getOrElse
import arrow.core.right
import com.example.pokekanri_notification.domain.NotificationRepository
import com.example.pokekanri_notification.domain.NotificationWithContent
import com.example.pokekanri_notification.domain.UserId
import org.springframework.stereotype.Service

interface GetUserNotificationUseCase {
    /**
     * ユーザーの通知一覧のDTO
     */
    data class UserNotifications(
        val notifications: List<NotificationWithContent>,
        val notificationsCount: Int
    )
    fun execute(userId: UserId): Either<Error, UserNotifications> = throw NotImplementedError()

    /**
     * ユースケースのエラー
     * 今の所特になし
     */
    sealed interface Error
}

@Service
class GetUserNotificationUseCaseImpl(val notificationRepository: NotificationRepository) : GetUserNotificationUseCase {
    override fun execute(userId: UserId): Either<GetUserNotificationUseCase.Error, GetUserNotificationUseCase.UserNotifications> {
        val userNotifications = notificationRepository.all(userId).getOrElse { throw UnsupportedOperationException("想定外のエラー") }

        return GetUserNotificationUseCase.UserNotifications(
            notifications = userNotifications,
            notificationsCount = userNotifications.size
        ).right()
    }
}