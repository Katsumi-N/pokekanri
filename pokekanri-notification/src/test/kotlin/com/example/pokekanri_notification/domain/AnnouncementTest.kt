package com.example.pokekanri_notification.domain

import io.kotest.assertions.arrow.core.shouldBeRight
import io.kotest.core.spec.style.DescribeSpec
import io.kotest.matchers.shouldBe
import io.kotest.property.Arb
import io.kotest.property.arbitrary.*
import io.kotest.property.checkAll

class AnnouncementTest : DescribeSpec({
    val announcementIdArb = Arb.long(1L..1000L).map { AnnouncementId(it) }

    val validTitleStringArb = Arb.string(1..100).filter { it.isNotBlank() }
    val validContentStringArb = Arb.string(1..1000).filter { it.isNotBlank() }

    describe("Announcement") {
        describe("new") {
            it("タイトルと内容からお知らせを作成できること") {
                checkAll(validTitleStringArb, validContentStringArb) { title, content ->
                    val announcementEither = Announcement.new(
                        title = title,
                        content = content
                    )
                    
                    announcementEither.shouldBeRight { "Announcement should be valid format $it" }
                }
            }
        }

        describe("newWithoutValidation") {
            it("IDありでバリデーションなしでインスタンス化できること") {
                checkAll(announcementIdArb, validTitleStringArb, validContentStringArb) { id, title, content ->
                    val announcement = Announcement.newWithoutValidation(
                        id = id,
                        title = title,
                        content = content
                    )
                    
                    announcement.id shouldBe id
                    announcement.title.value shouldBe title
                    announcement.content.value shouldBe content
                }
            }
            
            it("IDなしでバリデーションなしでインスタンス化できること") {
                checkAll(validTitleStringArb, validContentStringArb) { title, content ->
                    val announcement = Announcement.newWithoutValidation(
                        id = null,
                        title = title,
                        content = content
                    )
                    
                    announcement.id shouldBe null
                    announcement.title.value shouldBe title
                    announcement.content.value shouldBe content
                }
            }
        }
    }
})
