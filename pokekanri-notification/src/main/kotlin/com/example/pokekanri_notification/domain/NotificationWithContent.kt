package com.example.pokekanri_notification.domain

class NotificationWithContent private constructor(
    val id: NotificationId,
    val announcementId: AnnouncementId,
    val userId: UserId,
    val isRead: Boolean,
    val title: Title,
    val content: Content,
    val toAll: Boolean
) {
    companion object {
        fun new(
            id: NotificationId,
            announcementId: AnnouncementId,
            userId: UserId,
            isRead: Boolean,
            title: Title,
            content: Content,
            toAll: Boolean
        ): NotificationWithContent = NotificationWithContent(
            id = id,
            announcementId = announcementId,
            userId = userId,
            isRead = isRead,
            title = title,
            content = content,
            toAll = toAll
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

    override fun hashCode(): Int {
        var result = id.hashCode()
        result = 31 * result + announcementId.hashCode()
        result = 31 * result + userId.hashCode()
        result = 31 * result + isRead.hashCode()
        result = 31 * result + title.hashCode()
        result = 31 * result + content.hashCode()
        return result
    }
}
