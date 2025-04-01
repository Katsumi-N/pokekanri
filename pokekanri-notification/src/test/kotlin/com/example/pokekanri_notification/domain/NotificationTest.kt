package com.example.pokekanri_notification.domain

import io.kotest.core.spec.style.DescribeSpec
import io.kotest.matchers.shouldBe
import io.kotest.matchers.types.shouldBeTypeOf
import io.kotest.property.Arb
import io.kotest.property.arbitrary.long
import io.kotest.property.arbitrary.map
import io.kotest.property.arbitrary.localDateTime
import io.kotest.property.checkAll
import java.time.LocalDateTime
import java.time.temporal.ChronoUnit


class NotificationTest : DescribeSpec({
    val notificationIdArb = Arb.long(1L..1000L).map { NotificationId(it) }
    val announcementIdArb = Arb.long(1L..1000L).map { AnnouncementId(it) }
    val userIdArb = Arb.long(1L..1000L).map { UserId(it) }
    val pastDateTimeArb = Arb.localDateTime(
        minYear = 2024,
        maxYear = LocalDateTime.now().year
    )

    describe("Notification") {
        describe("create") {
            it("任意のAnnounceIdとUserIdでNotificationを作成できること") {
                checkAll(announcementIdArb, userIdArb) { announcementId, userId ->
                    val before = LocalDateTime.now()
                    val notification = Notification.create(
                        announcementId = announcementId,
                        userId = userId
                    )
                    val after = LocalDateTime.now()

                    notification.id shouldBe null
                    notification.announcementId shouldBe announcementId
                    notification.userId shouldBe userId
                    notification.isRead shouldBe false
                    notification.createdAt.isAfter(before.minus(1, ChronoUnit.SECONDS)) shouldBe true
                    notification.createdAt.isBefore(after.plus(1, ChronoUnit.SECONDS)) shouldBe true
                }
            }
        }
        
        describe("markAsRead") {
            context("未読の通知の場合") {
                it("既読としてマークできること") {

                    checkAll(
                        notificationIdArb,
                        announcementIdArb,
                        userIdArb,
                        pastDateTimeArb
                    ) { notificationId, announcementId, userId, createdAt ->
                        val notification = Notification(
                            id = notificationId,
                            announcementId = announcementId,
                            userId = userId,
                            isRead = false,
                            createdAt = createdAt
                        )

                        val result = notification.markAsRead()

                        result.isRight() shouldBe true
                        result.shouldBeTypeOf<arrow.core.Either.Right<Notification>>()
                        val readNotification = result.getOrNull()!!
                        readNotification.isRead shouldBe true
                        readNotification.id shouldBe notificationId
                        readNotification.announcementId shouldBe announcementId
                        readNotification.userId shouldBe userId
                        readNotification.createdAt shouldBe createdAt
                    }
                }
            }
            
            context("既読の通知の場合") {
                it("エラーが返されること") {
                    checkAll(
                        notificationIdArb,
                        announcementIdArb,
                        userIdArb,
                        pastDateTimeArb
                    ) { notificationId, announcementId, userId, createdAt ->
                        val notification = Notification(
                            id = notificationId,
                            announcementId = announcementId,
                            userId = userId,
                            isRead = true,
                            createdAt = createdAt
                        )

                        val result = notification.markAsRead()

                        result.isLeft() shouldBe true
                        result.shouldBeTypeOf<arrow.core.Either.Left<NotificationError>>()
                        val error = result.leftOrNull()
                        error shouldBe NotificationError.AlreadyRead
                    }
                }
            }
        }
    }
})