package com.example.pokekanri_notification.api.integration

import com.example.pokekanri_notification.presentation.model.MarkReadRequest
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import io.kotest.core.spec.style.DescribeSpec
import io.kotest.extensions.spring.SpringExtension
import io.kotest.matchers.longs.shouldBeGreaterThan
import io.kotest.matchers.shouldBe
import io.kotest.matchers.string.shouldContain
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.context.DynamicPropertyRegistry
import org.springframework.test.context.DynamicPropertySource
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.post
import org.testcontainers.containers.MySQLContainer
import org.testcontainers.junit.jupiter.Container
import org.testcontainers.junit.jupiter.Testcontainers
import org.testcontainers.utility.DockerImageName
import java.sql.Timestamp
import java.time.LocalDateTime

@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
class NotificationTest(
    @Autowired private val mockMvc: MockMvc,
    @Autowired private val jdbcTemplate: JdbcTemplate
) : DescribeSpec({

    val secretKey = "super-secret-jwt-token-with-at-least-32-characters-long"
    val userId = "user123"
    val token = generateJwtToken(userId, secretKey)
    val objectMapper = jacksonObjectMapper() // For request/response body

    beforeTest {
        cleanupTestData(jdbcTemplate)
        setupTestData(jdbcTemplate)
    }

    afterTest {
        cleanupTestData(jdbcTemplate)
    }

    describe("GET /api/notifications") {
        it("ユーザーの通知一覧を取得できること") {
            val response = mockMvc.get("/api/notifications") {
                contentType = MediaType.APPLICATION_JSON
                header("Authorization", "Bearer $token")
            }.andExpect {
                status { isOk() }
                content { contentType(MediaType.APPLICATION_JSON) }
            }.andReturn().response.contentAsString

            response shouldContain "\"id\":0"
            response shouldContain "\"announcementId\":103"
            response shouldContain "\"title\":\"全体お知らせタイトル1\""
            response shouldContain "\"isRead\":false"
            response shouldContain "\"toAll\":true"

            response shouldContain "\"id\":3"
            response shouldContain "\"announcementId\":102"
            response shouldContain "\"title\":\"個別お知らせタイトル2\""
            response shouldContain "\"isRead\":false"
            response shouldContain "\"toAll\":false"
        }
    }

    describe("POST /api/notifications/read") {
        context("個別通知を更新する時") {
            it("未読の通知を既読にできること (200 OK with body)") {
                val notificationIdToMark = 3L // user123, announcement 102, currently unread
                val requestBody = MarkReadRequest(notificationId = 3L)
                mockMvc.post("/api/notifications/read") {
                    header("Authorization", "Bearer $token")
                    contentType = MediaType.APPLICATION_JSON
                    content = objectMapper.writeValueAsString(requestBody)
                }.andExpect {
                    status { isOk() }
                    content { contentType(MediaType.APPLICATION_JSON) }
                    jsonPath("$.id") { value(notificationIdToMark) }
                    jsonPath("$.announcementId") { value(102L) }
                    jsonPath("$.userId") { value(userId) }
                    jsonPath("$.isRead") { value(true) }
                }

                val finalState = jdbcTemplate.queryForObject(
                    "SELECT is_read FROM notifications WHERE id = ?",
                    Int::class.java,
                    notificationIdToMark
                )
                finalState shouldBe 1
            }

            it("存在しない通知IDを指定した場合 (404 Not Found)") {
                val nonExistentNotificationId = 999L

                mockMvc.post("/api/notifications/$nonExistentNotificationId/read") {
                    header("Authorization", "Bearer $token")
                }.andExpect {
                    status { isNotFound() } // 404
                }
            }
        }

        context("全体通知の場合") {
            it("未読の全体通知を指定して新規作成できること") {
                val announcementIdToCreate = 103L // Existing announcement (to_all = true)
                val requestBody = MarkReadRequest(notificationId = 0, announcementId = announcementIdToCreate)

                // Verify no notification exists for user123 and announcement 103 initially
                val initialCount = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM notifications WHERE user_id = ? AND announcement_id = ?",
                    Int::class.java, userId, announcementIdToCreate
                )
                initialCount shouldBe 0

                val result = mockMvc.post("/api/notifications/read") {
                    header("Authorization", "Bearer $token")
                    contentType = MediaType.APPLICATION_JSON
                    content = objectMapper.writeValueAsString(requestBody)
                }.andExpect {
                    status { isOk() }
                    content { contentType(MediaType.APPLICATION_JSON) }
                    jsonPath("$.id") { isNumber() } // Check if ID is a number (generated)
                    jsonPath("$.announcementId") { value(announcementIdToCreate) }
                    jsonPath("$.userId") { value(userId) }
                    jsonPath("$.isRead") { value(true) } // Should be created as read
                }.andReturn()

                // Extract the created ID from the response
                val responseString = result.response.contentAsString
                val createdNotification = objectMapper.readValue(responseString, Map::class.java)
                val createdId = (createdNotification["id"] as Number).toLong()
                createdId shouldBeGreaterThan 0L

                // Verify final state in DB
                val finalState = jdbcTemplate.queryForMap(
                    "SELECT user_id, announcement_id, is_read FROM notifications WHERE id = ?",
                    createdId
                )
                finalState["user_id"] shouldBe userId
                finalState["announcement_id"] shouldBe announcementIdToCreate
                finalState["is_read"] shouldBe true
            }
        }

        it("既に存在する通知を作成しようとした場合 (409 Conflict)") {
            // Notification for user123 and announcement 101 already exists (id=1)
            val announcementIdToCreate = 101L
            val requestBody = MarkReadRequest(announcementId = announcementIdToCreate, notificationId = 0)

            // Verify it exists initially
            val initialCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM notifications WHERE user_id = ? AND announcement_id = ?",
                Int::class.java, userId, announcementIdToCreate
            )
            initialCount shouldBe 1 // Should be 1 because it was created in setupTestData

            mockMvc.post("/api/notifications/read") {
                header("Authorization", "Bearer $token")
                contentType = MediaType.APPLICATION_JSON
                content = objectMapper.writeValueAsString(requestBody)
            }.andExpect {
                status { isConflict() } // 409 Conflict
                content {
                    contentType(MediaType.APPLICATION_JSON)
                    jsonPath("$.errors.messages[0]") { value("Notification already exists for this user and announcement.") }
                    jsonPath("$.errors.messages.length()") { value(1) }v
                }
            }
        }
    }
}) {
    override fun extensions() = listOf(SpringExtension)

    companion object {
        @JvmStatic
        @Container
        val mysqlContainer = MySQLContainer<Nothing>(DockerImageName.parse("mysql:8.0")).apply {
            withDatabaseName("notificationdb")
            withUsername("root")
            withPassword("pass")
            withInitScript("sql/schema.sql")
        }

        @JvmStatic
        @DynamicPropertySource
        fun properties(registry: DynamicPropertyRegistry) {
            registry.add("spring.datasource.url") { mysqlContainer.jdbcUrl }
            registry.add("spring.datasource.username") { mysqlContainer.username }
            registry.add("spring.datasource.password") { mysqlContainer.password }
            registry.add("spring.datasource.driver-class-name") { mysqlContainer.driverClassName }
            registry.add("JWT_SECRET") { "super-secret-jwt-token-with-at-least-32-characters-long" }
        }

        init {
            mysqlContainer.start()
        }
    }
}

private fun generateJwtToken(userId: String, secret: String): String =
    Jwts.builder()
        .claim("sub", userId)
        .claim("name", "Test User")
        .claim("iat", Timestamp.valueOf(LocalDateTime.now()))
        .claim("exp", Timestamp.valueOf(LocalDateTime.now().plusDays(1)))
        .signWith(SignatureAlgorithm.HS256, secret.toByteArray())
        .compact()

private fun setupTestData(jdbcTemplate: JdbcTemplate) {
    val now = Timestamp.valueOf(LocalDateTime.now())

    // お知らせ
    jdbcTemplate.update(
        """
            INSERT INTO announcements (id, title, content, to_all, created_at)
            VALUES (101, '個別お知らせタイトル1', '個別お知らせ', false, ?),
                   (102, '個別お知らせタイトル2', '個別お知らせ', false, ?),
                   (103, '全体お知らせタイトル1', '全体お知らせ', true, ?)
        """, now, now, now
    )

    // 通知
    // user123: 1 (read), 3 (unread)
    // user124: 2 (read)
    jdbcTemplate.update(
        """
            INSERT INTO notifications (id, user_id, announcement_id, is_read, created_at)
            VALUES (1, 'user123', 101, true, ?),
                   (2, 'user124', 102, true, ?),
                   (3, 'user123', 102, false, ?)
        """, now, now, now
    )
}

private fun cleanupTestData(jdbcTemplate: JdbcTemplate) {
    jdbcTemplate.update("DELETE FROM notifications")
    jdbcTemplate.update("DELETE FROM announcements")
}
