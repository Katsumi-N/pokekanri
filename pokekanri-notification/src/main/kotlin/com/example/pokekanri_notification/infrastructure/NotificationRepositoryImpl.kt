package com.example.pokekanri_notification.infrastructure

import arrow.core.Either
import arrow.core.flatMap
import arrow.core.left
import arrow.core.right
import com.example.pokekanri_notification.domain.*
import org.springframework.dao.EmptyResultDataAccessException
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.jdbc.core.simple.SimpleJdbcInsert
import org.springframework.stereotype.Repository
import java.sql.Timestamp
import java.time.LocalDateTime
import javax.sql.DataSource

@Repository
class NotificationRepositoryImpl(
    private val namedParameterJdbcTemplate: NamedParameterJdbcTemplate,
    dataSource: DataSource // Inject DataSource for SimpleJdbcInsert
) : NotificationRepository {

    private val simpleJdbcInsert = SimpleJdbcInsert(dataSource)
        .withTableName("notifications")
        .usingGeneratedKeyColumns("id")
        .usingColumns("user_id", "announcement_id", "is_read")

    override fun all(userId: UserId): Either<NotificationRepository.FindAllError, List<NotificationWithContent>> {
        // Wrap existing logic in Either.catch for consistency
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

    override fun findByIdAndUserId(id: NotificationId, userId: UserId): Either<NotificationRepository.FindByIdError, Notification> {
        val sql = """
            SELECT id, announcement_id, user_id, is_read, created_at
            FROM notifications
            WHERE id = :id AND user_id = :userId
        """.trimIndent()

        val params = MapSqlParameterSource()
            .addValue("id", id.value)
            .addValue("userId", userId.value)

        return Either.catch {
            namedParameterJdbcTemplate.queryForMap(sql, params)
        }.mapLeft { throwable ->
            when (throwable) {
                is EmptyResultDataAccessException -> NotificationRepository.FindByIdError.NotFound
                else -> NotificationRepository.FindByIdError.Unexpected(throwable)
            }
        }.map { result ->
            Notification(
                id = NotificationId(result["id"] as Long),
                announcementId = AnnouncementId(result["announcement_id"] as Long),
                userId = UserId(result["user_id"] as String),
                isRead = result["is_read"] as Boolean,
                createdAt = (result["created_at"] as Timestamp).toLocalDateTime()
            )
        }
    }

    override fun save(notification: Notification): Either<NotificationRepository.SaveError, Notification> {
        // Update existing notification (specifically is_read)
        val notificationId = notification.id ?: return NotificationRepository.SaveError.Unexpected(
            IllegalArgumentException("Cannot update notification without ID")
        ).left()

        val sql = """
            UPDATE notifications
            SET is_read = :isRead, updated_at = CURRENT_TIMESTAMP
            WHERE id = :id AND user_id = :userId
        """.trimIndent()

        val params = MapSqlParameterSource()
            .addValue("isRead", if (notification.isRead) 1 else 0)
            .addValue("id", notificationId.value)
            .addValue("userId", notification.userId.value)

        return Either.catch {
            namedParameterJdbcTemplate.update(sql, params)
        }.mapLeft { throwable ->
            NotificationRepository.SaveError.Unexpected(throwable)
        }.flatMap { updatedRows ->
            if (updatedRows == 1) {
                // Return the updated notification object
                notification.right()
            } else {
                // If 0 rows updated, it likely means the record didn't exist for that user/id combo.
                NotificationRepository.SaveError.Unexpected(
                    IllegalStateException("Update affected $updatedRows rows for notification ID ${notificationId.value}")
                ).left()
            }
        }
    }

    override fun insert(notification: Notification): Either<NotificationRepository.InsertError, Notification> {
        // 1. Check for existing notification with the same user_id and announcement_id
        val checkSql = """
            SELECT COUNT(*) FROM notifications WHERE user_id = :userId AND announcement_id = :announcementId
        """.trimIndent()
        val checkParams = MapSqlParameterSource()
            .addValue("userId", notification.userId.value)
            .addValue("announcementId", notification.announcementId.value)

        val existsCheckResult = Either.catch {
            namedParameterJdbcTemplate.queryForObject(checkSql, checkParams, Int::class.java) ?: 0
        }.mapLeft { NotificationRepository.InsertError.Unexpected(it) }

        return existsCheckResult.flatMap { count ->
            if (count > 0) {
                // If record exists, return DuplicateEntry error
                NotificationRepository.InsertError.DuplicateEntry.left()
            } else {
                // 2. If no duplicate, proceed with insertion
                val insertParams = MapSqlParameterSource()
                    .addValue("user_id", notification.userId.value)
                    .addValue("announcement_id", notification.announcementId.value)
                    .addValue("is_read", if (notification.isRead) 1 else 0)
                    // created_at and updated_at have defaults in the DB schema

                Either.catch {
                    // Use SimpleJdbcInsert to get the generated ID
                    simpleJdbcInsert.executeAndReturnKey(insertParams)
                }.mapLeft { throwable ->
                    // Consider mapping specific exceptions like DataIntegrityViolationException if needed
                    NotificationRepository.InsertError.Unexpected(throwable)
                }.map { generatedId -> // generatedId is the actual Number object representing the key
                    // Return the notification with the correct generated ID
                    notification.copy(id = NotificationId(generatedId.toLong()))
                }
            }
        }
    }
}
