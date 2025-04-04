package com.example.pokekanri_notification.infrastructure

import arrow.core.Either
import arrow.core.right
import com.example.pokekanri_notification.domain.*
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Repository

@Repository
class NotificationRepositoryImpl(val namedParameterJdbcTemplate: NamedParameterJdbcTemplate) : NotificationRepository {
    override fun all(userId: UserId): Either<NotificationRepository.FindError, List<NotificationWithContent>> {
        val sql = """
            SELECT 
                a.id as announcement_id,
                COALESCE(n.id, 0) AS notification_id,
                COALESCE(n.is_read, 0) AS is_read,
                a.title,
                a.content,
                a.to_all
            FROM announcements a
            LEFT JOIN notifications n
                ON a.id = n.announcement_id AND n.user_id = :userId
            WHERE
                a.to_all = true AND (n.is_read IS NULL OR n.is_read = false)
                OR (a.to_all = false AND n.user_id = :userId AND n.is_read = false)
            ORDER BY a.id DESC
        """.trimIndent()
        
        val notificationMap = namedParameterJdbcTemplate.queryForList(sql, MapSqlParameterSource("userId", userId.value))
        
        return notificationMap.map {
            NotificationWithContent.new(
                id = NotificationId(it["notification_id"] as Long),
                announcementId = AnnouncementId(it["announcement_id"] as Long),
                userId = userId,
                isRead = it["is_read"] == 1L,
                title = TitleWithoutValidation(it["title"] as String),
                content = ContentWithoutValidation(it["content"] as String),
                toAll = it["to_all"] as Boolean
            )
        }.right()
    }
}
