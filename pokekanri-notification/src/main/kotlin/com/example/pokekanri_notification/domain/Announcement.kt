package com.example.pokekanri_notification.domain

import arrow.core.EitherNel
import arrow.core.raise.either
import arrow.core.raise.zipOrAccumulate
import com.example.pokekanri_notification.util.ValidationError

class Announcement private constructor(
    val id: AnnouncementId?,
    val title: Title,
    val content: Content,
) {
    companion object {
        /**
         * バリデーションあり
         */
        fun new(title: String, content: String): EitherNel<ValidationError, Announcement> {
            return either {
                zipOrAccumulate(
                    { Title.new(title).bindNel() },
                    { Content.new(content).bindNel() },
                ) { validatedTitle, validatedContent ->
                    Announcement(
                        id = null,
                        title = validatedTitle,
                        content = validatedContent
                    )
                }
            }
        }

        /**
         * バリデーションなし
         */
        fun newWithoutValidation(
            id: AnnouncementId?,
            title: String,
            content: String
        ): Announcement {
            return Announcement(
                id = id,
                title = TitleWithoutValidation(title),
                content = ContentWithoutValidation(content)
            )
        }
    }
}

@JvmInline
value class AnnouncementId(val value: Long)

