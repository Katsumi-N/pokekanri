package com.example.pokekanri_notification.presentation

import arrow.core.*
import com.example.pokekanri_notification.domain.*
import com.example.pokekanri_notification.presentation.model.*
import com.example.pokekanri_notification.usecase.GetUserNotificationUseCase
import com.example.pokekanri_notification.usecase.MarkNotificationReadUseCase
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*

@RequestMapping("/api") // Add base path for consistency
@RestController
@Validated
class NotificationController(
    @Value("\${JWT_SECRET}") private val jwtSecret: String,
    private val getUserNotificationUseCase: GetUserNotificationUseCase,
    private val markNotificationReadUseCase: MarkNotificationReadUseCase
) {
    /**
     * ユーザーの通知一覧を取得するAPI
     * GET /api/notifications
     */
    @GetMapping("/notifications", produces = [MediaType.APPLICATION_JSON_VALUE])
    fun getUserNotifications(@RequestHeader("Authorization") authorization: String): ResponseEntity<MultipleNotificationResponse> {
        val userId = parseUserIdFromJwt(authorization)
            ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build() // Or handle appropriately

        val notificationsResult = getUserNotificationUseCase.execute(userId).getOrElse { throw UnsupportedOperationException("想定外のエラー") }
        return ResponseEntity(
            MultipleNotificationResponse(
                notifications = notificationsResult.notifications,
                count = notificationsResult.notificationsCount
            ),
            HttpStatus.OK
        )
    }

    /**
     * 通知を既読にするAPI
     * POST /api/notifications/read
     */
    @PostMapping("/notifications/read")
    fun markNotificationAsRead(
        @RequestHeader("Authorization") authorization: String,
        @RequestBody(required = true) request: MarkReadRequest
    ): ResponseEntity<Any> { // Return Any to allow different success responses
        val userId = parseUserIdFromJwt(authorization)
            ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()

        val notificationId = request.notificationId

        // Validate notificationId (must be non-negative)
        if (notificationId < 0) {
            return ResponseEntity.badRequest().body("Notification ID cannot be negative.")
        }

        val announcementIdForCreate = if (notificationId == 0L) {
            request.announcementId?.let { AnnouncementId(it) }
        } else {
            null
        }

        val result = markNotificationReadUseCase.execute(
            NotificationId(notificationId),
            userId,
            announcementIdForCreate
        ).getOrElse { throw MarkNotificationReadUseCaseErrorException(it) }

        return ResponseEntity(
            NotificationResponse(
                id = result.id?.value ?: 0L, // ID should exist after insert/save
                announcementId = result.announcementId.value,
                userId = result.userId.value,
                isRead = result.isRead,
                createdAt = result.createdAt
            ),
            HttpStatus.OK
        )
    }

    data class MarkNotificationReadUseCaseErrorException(val error: MarkNotificationReadUseCase.UseCaseError) : Throwable()

    @ExceptionHandler(value = [MarkNotificationReadUseCaseErrorException::class])
    fun onMarkNotificationReadUseCaseErrorException(e: MarkNotificationReadUseCaseErrorException): ResponseEntity<GenericErrorModel> {
        return when (e.error) {
            is MarkNotificationReadUseCase.UseCaseError.NotFound -> ResponseEntity<GenericErrorModel>(
                GenericErrorModel(
                    errors = GenericErrorModelErrors(
                        messages = listOf("Notification not found."),
                    )
                ),
                HttpStatus.NOT_FOUND
            )
            is MarkNotificationReadUseCase.UseCaseError.AlreadyRead -> ResponseEntity<GenericErrorModel> (
                GenericErrorModel(
                    errors = GenericErrorModelErrors(
                        messages = listOf("Notification already marked as read."),
                    )
                ),
                HttpStatus.CONFLICT
            )
            is MarkNotificationReadUseCase.UseCaseError.AlreadyExists -> ResponseEntity<GenericErrorModel>(
                GenericErrorModel(
                    errors = GenericErrorModelErrors(
                        messages = listOf("Notification already exists for this user and announcement."),
                    )
                ),
                HttpStatus.CONFLICT
            )
            is MarkNotificationReadUseCase.UseCaseError.MissingAnnouncementId -> ResponseEntity<GenericErrorModel>(
                GenericErrorModel(
                    errors = GenericErrorModelErrors(
                        messages = listOf("announcementId is required in body when notificationId is 0."),
                    )
                ),
                HttpStatus.BAD_REQUEST
            )
            is MarkNotificationReadUseCase.UseCaseError.RepositoryError -> ResponseEntity<GenericErrorModel>(
                GenericErrorModel(
                    errors = GenericErrorModelErrors(
                        messages = listOf("Internal server error occurred."),
                    )
                ),
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    // Refactored JWT parsing logic into a separate function
    // Returns null if JWT is invalid or missing 'sub' claim
    private fun parseUserIdFromJwt(authorization: String): UserId? {
        return try {
            val jwt = authorization.removePrefix("Bearer ")
            val signingKey = Keys.hmacShaKeyFor(jwtSecret.toByteArray(Charsets.UTF_8))
            val claims = Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(jwt)
                .body

            claims.subject?.let { UserId(it) }
        } catch (e: Exception) {
            // Log exception (e.g., SignatureException, ExpiredJwtException, MalformedJwtException)
            null
        }
    }
}
