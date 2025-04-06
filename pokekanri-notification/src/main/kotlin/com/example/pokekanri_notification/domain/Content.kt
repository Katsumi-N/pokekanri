package com.example.pokekanri_notification.domain

import arrow.core.EitherNel
import arrow.core.leftNel
import arrow.core.right
import com.example.pokekanri_notification.util.ValidationError

@JvmInline
value class ContentWithoutValidation(override val value: String) : Content

interface Content {
    val value: String

    private data class ValidatedContent(override val value: String) : Content

    companion object {
        fun new(value: String): EitherNel<CreationError, Content> {
            if (value.isBlank()) {
                return CreationError.Empty.leftNel()
            }
            if (value.length > 1000) {
                return CreationError.TooLong(1000).leftNel()
            }
            return ValidatedContent(value).right()
        }
    }
}
sealed interface CreationError : ValidationError {
    data object Empty : CreationError {
        override val message: String
            get() = "コンテンツは空白にできません"
    }

    data class TooLong(val maximum: Int) : CreationError {
        override val message: String
            get() = "コンテンツは${maximum}以内である必要があります"
    }
}