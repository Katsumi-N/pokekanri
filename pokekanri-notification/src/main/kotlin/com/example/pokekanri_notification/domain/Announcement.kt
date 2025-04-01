package com.example.pokekanri_notification.domain

import java.time.LocalDateTime

data class Announcement(
    val id: AnnouncementId?,
    val title: Title,
    val content: Content,
    val createdAt: LocalDateTime,
) {
    companion object {
        fun create(title: String, content: String): Announcement {
            return Announcement(
                id = null,
                title = Title(title),
                content = Content(content),
                createdAt = LocalDateTime.now(),
            )
        }
    }
}

@JvmInline
value class AnnouncementId(val value: Long)

@JvmInline
value class Title(val value: String) {
    init {
        require(value.isNotBlank()) { "タイトルは空白にできません" }
        require(value.length <= 100) { "タイトルは100文字以内である必要があります" }
    }
}

@JvmInline
value class Content(val value: String) {
    init {
        require(value.isNotBlank()) { "内容は空白にできません" }
        require(value.length <= 1000) { "内容は1000文字以内である必要があります" }
    }
}