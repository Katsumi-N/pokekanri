package com.example.pokekanri_notification.domain

class NotificationWithContent private constructor(
    val id: NotificationId,
    val announcementId: AnnouncementId,
    val userId: UserId,
    val isRead: Boolean,
    val title: Title,
    val content: Content
) {
    companion object {
        fun new(
            id: NotificationId,
            announcementId: AnnouncementId,
            userId: UserId,
            isRead: Boolean,
            title: Title,
            content: Content
        ): NotificationWithContent = NotificationWithContent(
            id = id,
            announcementId = announcementId,
            userId = userId,
            isRead = isRead,
            title = title,
            content = content
        )
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is NotificationWithContent) return false

        if (id != other.id) return false
        if (announcementId != other.announcementId) return false
        if (userId != other.userId) return false
        if (isRead != other.isRead) return false
        if (title != other.title) return false
        if (content != other.content) return false

        return true
    }
}
