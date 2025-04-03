package com.example.pokekanri_notification.domain

import arrow.core.EitherNel
import arrow.core.leftNel
import arrow.core.right
import com.example.pokekanri_notification.util.ValidationError

@JvmInline
value class TitleWithoutValidation(override val value: String) : Title

interface Title {
    val value: String

    private data class ValidatedTitle(override val value: String) : Title

    companion object {
        fun new(value: String): EitherNel<CreationError, Title> {
            if (value.isBlank()) {
                return CreationError.Empty.leftNel()
            }
            if (value.length > 100) {
                return CreationError.TooLong(100).leftNel()
            }
            return ValidatedTitle(value).right()
        }
    }

    sealed interface CreationError : ValidationError {
        data object Empty : CreationError {
            override val message: String
                get() = "タイトルは空白にできません"
        }

        data class TooLong(val maximum: Int) : CreationError {
            override val message: String
                get() = "タイトルは${maximum}以内である必要があります"
        }
    }
}