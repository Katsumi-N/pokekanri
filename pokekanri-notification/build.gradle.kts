plugins {
	kotlin("jvm") version "2.0.21"
	kotlin("plugin.spring") version "2.0.21"
	id("org.springframework.boot") version "3.4.4"
	id("io.spring.dependency-management") version "1.1.7"
	kotlin("plugin.jpa") version "2.0.21"
	/**
	 * detekt
	 *
	 * URL
	 * - https://github.com/detekt/detekt
	 * GradlePlugins(plugins.gradle.org)
	 * - https://plugins.gradle.org/plugin/io.gitlab.arturbosch.detekt
	 * Main用途
	 * - Linter/Formatter
	 * Sub用途
	 * - 無し
	 * 概要
	 * KotlinのLinter/Formatter
	 */
	id("io.gitlab.arturbosch.detekt") version "1.23.8"
}

group = "com.example"
version = "0.0.1-SNAPSHOT"

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(21)
	}
}

repositories {
	mavenCentral()
}

dependencies {
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")
	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation("org.springframework.boot:spring-boot-starter-validation")
	implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
	implementation("org.jetbrains.kotlin:kotlin-reflect")
	developmentOnly("org.springframework.boot:spring-boot-devtools")
	runtimeOnly("com.h2database:h2")
	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testImplementation("org.jetbrains.kotlin:kotlin-test-junit5")
	testRuntimeOnly("org.junit.platform:junit-platform-launcher")
	
	// Kotest dependencies
	testImplementation("io.kotest:kotest-runner-junit5:5.8.1")
	testImplementation("io.kotest:kotest-assertions-core:5.8.1")
	testImplementation("io.kotest.extensions:kotest-assertions-arrow:2.0.0")
	testImplementation("io.kotest:kotest-property:5.8.1")
	implementation("io.kotest.extensions:kotest-extensions-spring:1.3.0")

	// testcontainers
	testImplementation("org.testcontainers:junit-jupiter")
	testImplementation("org.testcontainers:mysql")
	
	/**
	 * detektの拡張: detekt-formatting
	 *
	 * 概要
	 * - formattingのルール
	 * - 基本はktlintと同じ
	 * - format自動適用オプションの autoCorrect が使えるようになる
	 */
	detektPlugins("io.gitlab.arturbosch.detekt:detekt-formatting:1.23.8")
	/**
	 * Arrow Core
	 *
	 * URL
	 * - https://arrow-kt.io/
	 * MavenCentral
	 * - https://mvnrepository.com/artifact/io.arrow-kt/arrow-core
	 * Main用途
	 * - Either/Validatedを使ったRailway Oriented Programming
	 * Sub用途
	 * - Optionを使ったletの代替
	 * 概要
	 * - Kotlinで関数型プログラミングをするときに便利なライブラリ
	 */
	implementation("io.arrow-kt:arrow-core:2.0.1")
	implementation("io.arrow-kt:arrow-fx-coroutines:2.0.1")

	/**
	 * Spring JDBC
	 *
	 * URL
	 * - https://spring.pleiades.io/spring-framework/docs/current/javadoc-api/org/springframework/jdbc/core/package-summary.html
	 * MavenCentral
	 * - https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-starter-jdbc
	 * Main用途
	 * - DBへ保存
	 * 概要
	 * - 特になし
	 *
	 * これを入れるだけで、application.properties/yamlや@ConfigurationによるDB接続設定が必要になる
	 */
	implementation("org.springframework.boot:spring-boot-starter-jdbc")

	implementation("com.mysql:mysql-connector-j:8.2.0")

	/**
	* Database Rider
	*
	* - Rider Core
	* - Rider Spring
	* - Rider JUnit 5
	*
	* URL
	* - https://database-rider.github.io/database-rider/
	* MavenCentral
	* - https://mvnrepository.com/artifact/com.github.database-rider/rider-core
	* - https://mvnrepository.com/artifact/com.github.database-rider/rider-spring
	* - https://mvnrepository.com/artifact/com.github.database-rider/rider-junit5
	* Main用途
	* - JUnitでDB周りのテスト時のヘルパー
	* 概要
	* - テーブルの事前条件、事後条件を簡潔に設定できる
	*/
	implementation("com.github.database-rider:rider-core:1.41.0")
	implementation("com.github.database-rider:rider-spring:1.41.0")
	testImplementation("com.github.database-rider:rider-junit5:1.41.0")

	/**
	 * jwt
	 */
	implementation("io.jsonwebtoken:jjwt-api:0.11.5")
	runtimeOnly("io.jsonwebtoken:jjwt-impl:0.11.5")
	runtimeOnly("io.jsonwebtoken:jjwt-jackson:0.11.5") // JSONパーサーにJacksonを使う場合
}

kotlin {
	compilerOptions {
		freeCompilerArgs.addAll("-Xjsr305=strict")
	}
}

allOpen {
	annotation("jakarta.persistence.Entity")
	annotation("jakarta.persistence.MappedSuperclass")
	annotation("jakarta.persistence.Embeddable")
}

detekt {
	autoCorrect = true
}

tasks.withType<Test> {
	useJUnitPlatform()
}
