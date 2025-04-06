package com.example.pokekanri_notification.presentation.model

import com.fasterxml.jackson.annotation.JsonProperty
import jakarta.validation.Valid

/**
 * エラーモデル
 *
 * エラーの内容レスポンスモデル
 *
 * @property errors
 */
data class GenericErrorModel(
    @field:Valid
    @field:JsonProperty("errors", required = true) val errors: GenericErrorModelErrors
)