package com.example.pokekanri_notification.usecase

import arrow.core.*
import com.example.pokekanri_notification.domain.*
import org.springframework.stereotype.Service

@Service
class MarkNotificationReadUseCase(
    private val notificationRepository: NotificationRepository
) {
    fun execute(
        notificationId: NotificationId,
        userId: UserId,
        announcementIdForCreate: AnnouncementId? // Optional announcement ID for creation
    ): Either<UseCaseError, Notification> { // Return Notification on success
        if (notificationId.value == 0L) {
            val announcementId = announcementIdForCreate
                ?: return UseCaseError.MissingAnnouncementId.left()

            // Create a new notification, marked as read
            val newNotification = Notification.new(
                announcementId = announcementId,
                userId = userId
            ).copy(isRead = true) // Mark as read immediately upon creation for this flow

            return notificationRepository.insert(newNotification)
                .mapLeft { error ->
                    when (error) {
                        is NotificationRepository.InsertError.DuplicateEntry -> UseCaseError.AlreadyExists // Map DuplicateEntry to AlreadyExists
                        is NotificationRepository.InsertError.Unexpected -> UseCaseError.RepositoryError(error.cause)
                    }
                }
        }

        // Handle update case (notificationId > 0)
        return notificationRepository.findByIdAndUserId(notificationId, userId)
            .mapLeft { error ->
                when (error) {
                    is NotificationRepository.FindByIdError.NotFound -> UseCaseError.NotFound
                    is NotificationRepository.FindByIdError.Unexpected -> UseCaseError.RepositoryError(error.cause)
                }
            }
            .flatMap { notification ->
                notification.markAsRead()
                    .mapLeft { error ->
                        when (error) {
                            is NotificationError.AlreadyRead -> UseCaseError.AlreadyRead
                        }
                    }
                    .flatMap { updatedNotification ->
                        // Save the updated notification and return it
                        notificationRepository.save(updatedNotification)
                            .mapLeft { saveError ->
                                when (saveError) {
                                    is NotificationRepository.SaveError.Unexpected -> UseCaseError.RepositoryError(saveError.cause)
                                    // Add other specific save errors if defined
                                }
                            }
                        // No need for further flatMap if save returns Notification
                    }
            }
    }

    sealed interface UseCaseError {
        data object NotFound : UseCaseError
        data object AlreadyRead : UseCaseError
        data object MissingAnnouncementId : UseCaseError
        data object AlreadyExists : UseCaseError // Added error for duplicate creation attempt
        data class RepositoryError(val cause: Throwable) : UseCaseError
    }
}
