package com.example.pokekanri_notification.api.integration

import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import io.kotest.core.spec.style.DescribeSpec
import io.kotest.extensions.spring.SpringExtension
import io.kotest.matchers.string.shouldContain
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.test.context.DynamicPropertyRegistry
import org.springframework.test.context.DynamicPropertySource
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get
import org.testcontainers.containers.MySQLContainer
import org.testcontainers.junit.jupiter.Container
import org.testcontainers.junit.jupiter.Testcontainers
import org.testcontainers.utility.DockerImageName
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.beans.factory.annotation.Autowired
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
    // user123は102, 103が未読
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
