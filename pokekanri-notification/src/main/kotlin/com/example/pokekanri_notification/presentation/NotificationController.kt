package com.example.pokekanri_notification.presentation

import arrow.core.getOrElse
import com.example.pokekanri_notification.domain.UserId
import com.example.pokekanri_notification.presentation.model.MultipleNotificationResponse
import com.example.pokekanri_notification.usecase.GetUserNotificationUseCase
import io.jsonwebtoken.Jwts
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RestController
import java.sql.Timestamp
import java.time.LocalDateTime

@RestController
@Validated
class NotificationController(
    @Value("\${JWT_SECRET}") private val jwtSecret: String,
    val getUserNotificationUseCase: GetUserNotificationUseCase
) {
    /**
     * ユーザーの通知一覧を取得するAPI
     */
    @GetMapping("/api/notifications", produces = [MediaType.APPLICATION_JSON_VALUE])
    fun getUserNotifications(@RequestHeader("Authorization") authorization: String): ResponseEntity<MultipleNotificationResponse> {
        // ヘッダからjwtを取得
        val jwt = authorization.removePrefix("Bearer ")
        val parseJwtMap = parseJwt(jwt)
        val userId = UserId(parseJwtMap["sub"] ?: throw IllegalArgumentException("Invalid JWT token"))

        val notifications = getUserNotificationUseCase.execute(userId).getOrElse { throw UnsupportedOperationException("想定外のエラー") }

        val response = MultipleNotificationResponse(notifications.notifications, notifications.notificationsCount)

        return ResponseEntity(
            response,
            HttpStatus.OK
        )
    }
    
    private fun parseJwt(jwt: String): Map<String, String> {
        val signingKey = io.jsonwebtoken.security.Keys.hmacShaKeyFor(
            jwtSecret.toByteArray(Charsets.UTF_8)
        )
        val claims = Jwts.parserBuilder()
            .setSigningKey(signingKey)
            .build()
            .parseClaimsJws(jwt)
            .body
        return mapOf(
            "sub" to claims.subject as String,
            "name" to claims["name"] as String,
            "issuedAt" to claims.issuedAt.toString(),
            "expiration" to claims.expiration.toString(),
        )
    }
}
