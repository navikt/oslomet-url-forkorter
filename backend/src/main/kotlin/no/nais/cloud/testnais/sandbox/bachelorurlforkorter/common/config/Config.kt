package no.nais.cloud.testnais.sandbox.bachelorurlforkorter.common.config

import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import mu.KotlinLogging
import no.nais.cloud.testnais.sandbox.bachelorurlforkorter.common.config.Env.Local
import no.nais.cloud.testnais.sandbox.bachelorurlforkorter.common.config.Env.Sandbox
import no.nais.cloud.testnais.sandbox.bachelorurlforkorter.common.config.Env.Prod
import java.util.Properties
import javax.sql.DataSource

private val logger = KotlinLogging.logger {}

data class Config(
    val environment: Env,
    val appPort: Int,
    val authConfig: AuthConfig,
    val dbConfig: DbConfig
)

data class AuthConfig(val basicAuthUsername: String, val basicAuthPassword: Password)

data class DbConfig(
    val jdbcUrl: String
) {
    private val dataSource: HikariDataSource? = if (!jdbcUrl.contains("h2")) {
        val hikariConfig = HikariConfig().apply {
            jdbcUrl = this@DbConfig.jdbcUrl
            driverClassName = "org.postgresql.Driver"
            maximumPoolSize = 3
            isAutoCommit = false
            transactionIsolation = "TRANSACTION_REPEATABLE_READ"
            addDataSourceProperty("user", "****")
            addDataSourceProperty("password", "****")
        }
        HikariDataSource(hikariConfig)
    } else {
        null
    }

    fun getDbConnection(): DataSource {
        return dataSource ?: throw RuntimeException("HikariCP brukes ikke for H2, kall Database.connect() i stedet.")
    }

    override fun toString(): String {
        return "DbConfig(jdbcUrl=${maskJdbcUrl(jdbcUrl)})"
    }

    private fun maskJdbcUrl(jdbcUrl: String): String {
        return jdbcUrl.replace(Regex("(?<=://)[^:/]+:[^@]+@"), "****:****@")
    }
}

data class Password(val value: String) {
    override fun toString() = "*****"
}

enum class Env {
    Local, Sandbox, Prod
}

fun createApplicationConfig(): Config {
    val props = Properties()

    System.getenv().entries.forEach {
        props.setProperty(it.key, it.value)
    }

    if (getEnv(props) == null) {
        addLocalProperties(props)
    }

    logger.info("Kjører i miljø: ${props.getProperty("NAIS_CLUSTER_NAME")}")

    return Config(
        environment = getEnv(props)
            ?: throw RuntimeException("Property \"NAIS_CLUSTER_NAME\" er ikke satt. Gyldige miljøer er: local, sandbox og prod."),
        appPort = props.getProperty("PORT")?.toInt()
            ?: throw RuntimeException("Property \"PORT\" er ikke satt."),
        authConfig = AuthConfig(
            basicAuthUsername = props.getProperty("basicauth.username") ?: "",
            basicAuthPassword = Password(props.getProperty("basicauth.password") ?: "")
        ),
        dbConfig = DbConfig(
            jdbcUrl = props.getProperty("NAIS_DATABASE_OSLOMET_URL_FORKORTER_POSTGRES_URL_FORKORTER_JDBC_URL")
                ?: throw RuntimeException("Property \"NAIS_DATABASE_X_Y_JDBC_URL\" er ikke satt.")

        )
    ).also(::logConfig)
}

private fun logConfig(config: Config) {
    if (config.environment in listOf(Local, Sandbox, Prod)) {
        logger.info("Opprettet config : $config")
    }
}

private fun addLocalProperties(props: Properties): Properties {
    val fileName = "local.properties"

    {}.javaClass.getResourceAsStream("/$fileName")?.use {
        logger.info("Leser properties fra $fileName")
        props.load(it)
    } ?: logger.warn { "Missing $fileName file" }

    return props
}

private fun getEnv(props: Properties): Env? =
    when (props.getProperty("NAIS_CLUSTER_NAME")) {
        "local" -> Local
        "sandbox" -> Sandbox
        "prod" -> Prod
        else -> null
    }
