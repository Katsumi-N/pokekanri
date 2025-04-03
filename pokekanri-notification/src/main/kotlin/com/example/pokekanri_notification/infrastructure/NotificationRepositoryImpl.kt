package com.example.pokekanri_notification.infrastructure

import arrow.core.Either
import arrow.core.left
import arrow.core.right
import com.example.pokekanri_notification.domain.*
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Repository
import java.sql.ResultSet
import java.time.LocalDateTime

@Repository
class NotificationRepositoryImpl(val namedParameterJdbcTemplate: NamedParameterJdbcTemplate) : NotificationRepository {
    override fun all(userId: UserId): Either<NotificationRepository.FindError, List<NotificationWithContent>> {
        val sql = """
            SELECT n.id, n.user_id, n.announcement_id, n.is_read, n.created_at,
                   a.title, a.content
            FROM notifications n
            LEFT JOIN announcements a ON n.announcement_id = a.id
            WHERE n.user_id = :userId
            ORDER BY n.created_at DESC
        """.trimIndent()
        
        val notificationMap = namedParameterJdbcTemplate.queryForList(sql, MapSqlParameterSource("userId", userId.value))
        
        return notificationMap.map {
            NotificationWithContent.new(
                id = NotificationId(it["id"] as Long),
                announcementId = AnnouncementId(it["announcement_id"] as Long),
                userId = UserId(it["user_id"] as String),
                isRead = it["is_read"] as Boolean,
                title = TitleWithoutValidation(it["title"] as String),
                content = ContentWithoutValidation(it["content"] as String)
            )
        }.right()
    }
}
