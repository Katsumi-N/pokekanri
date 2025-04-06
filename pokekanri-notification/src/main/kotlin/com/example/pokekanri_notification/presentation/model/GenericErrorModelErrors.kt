package com.example.pokekanri_notification.presentation.model

import com.fasterxml.jackson.annotation.JsonProperty

/**
 * エラーモデル
 *
 * エラーレスポンスの詳細を List<String> 型で記述する
 *
 * @property messages
 */
data class GenericErrorModelErrors(
    @field:JsonProperty("messages", required = true) val messages: List<String>,
)