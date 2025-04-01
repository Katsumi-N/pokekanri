package com.example.pokekanri_notification.domain

import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.DescribeSpec
import io.kotest.matchers.shouldBe
import io.kotest.property.Arb
import io.kotest.property.arbitrary.*
import io.kotest.property.checkAll
import java.time.LocalDateTime
import java.time.temporal.ChronoUnit

class AnnouncementTest : DescribeSpec({
    val announcementIdArb = Arb.long(1L..1000L).map { AnnouncementId(it) }

    val validTitleArb = Arb.string(1..100).filter { it.isNotBlank() }.map { Title(it) }

    val validContentArb = Arb.string(1..1000).filter { it.isNotBlank() }.map { Content(it) }

    val pastDateTimeArb = Arb.localDateTime(
        minYear = 2020,
        maxYear = LocalDateTime.now().year
    )

    val validTitleStringArb = Arb.string(1..100).filter { it.isNotBlank() }
    val validContentStringArb = Arb.string(1..1000).filter { it.isNotBlank() }

    describe("Announcement") {
        describe("create") {
            it("タイトルと内容からお知らせを作成できること") {
                checkAll(validTitleStringArb, validContentStringArb) { title, content ->
                    val before = LocalDateTime.now()
                    val announcement = Announcement.create(
                        title = title,
                        content = content
                    )
                    val after = LocalDateTime.now()

                    announcement.id shouldBe null
                    announcement.title.value shouldBe title
                    announcement.content.value shouldBe content
                    announcement.createdAt.isAfter(before.minus(1, ChronoUnit.SECONDS)) shouldBe true
                    announcement.createdAt.isBefore(after.plus(1, ChronoUnit.SECONDS)) shouldBe true
                }
            }
        }
        
        describe("Title") {
            context("無効な値の場合") {
                it("空文字列の場合は例外が発生すること") {
                    shouldThrow<IllegalArgumentException> {
                        Title("")
                    }.message shouldBe "タイトルは空白にできません"
                }
                
                it("空白文字のみの場合は例外が発生すること") {
                    shouldThrow<IllegalArgumentException> {
                        Title("   ")
                    }.message shouldBe "タイトルは空白にできません"
                }
                
                it("100文字を超える場合は例外が発生すること") {
                    val tooLongTitle = "a".repeat(101)
                    shouldThrow<IllegalArgumentException> {
                        Title(tooLongTitle)
                    }.message shouldBe "タイトルは100文字以内である必要があります"
                }
            }
            
            context("有効な値の場合") {
                it("正しくインスタンス化できること") {
                    checkAll(validTitleStringArb) { titleValue ->
                        val title = Title(titleValue)
                        title.value shouldBe titleValue
                    }
                }
            }
        }
        
        describe("Content") {
            context("無効な値の場合") {
                it("空文字列の場合は例外が発生すること") {
                    shouldThrow<IllegalArgumentException> {
                        Content("")
                    }.message shouldBe "内容は空白にできません"
                }
                
                it("空白文字のみの場合は例外が発生すること") {
                    shouldThrow<IllegalArgumentException> {
                        Content("   ")
                    }.message shouldBe "内容は空白にできません"
                }
                
                it("1000文字を超える場合は例外が発生すること") {
                    val tooLongContent = "a".repeat(1001)
                    shouldThrow<IllegalArgumentException> {
                        Content(tooLongContent)
                    }.message shouldBe "内容は1000文字以内である必要があります"
                }
            }
            
            context("有効な値の場合") {
                it("正しくインスタンス化できること") {
                    checkAll(validContentStringArb) { contentValue ->
                        val content = Content(contentValue)
                        content.value shouldBe contentValue
                    }
                }
            }
        }
        
        describe("constructor") {
            it("すべてのプロパティが正しく設定されること") {
                checkAll(
                    announcementIdArb.orNull(),
                    validTitleArb,
                    validContentArb,
                    pastDateTimeArb
                ) { id, title, content, createdAt ->
                    val announcement = Announcement(
                        id = id,
                        title = title,
                        content = content,
                        createdAt = createdAt
                    )
                    
                    announcement.id shouldBe id
                    announcement.title shouldBe title
                    announcement.content shouldBe content
                    announcement.createdAt shouldBe createdAt
                }
            }
        }
    }
})
