package no.nais.cloud.testnais.sandbox.bachelorurlforkorter.common.db

import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import javax.sql.DataSource

object DbConfig {
    private val dbUrl: String = System.getenv("NAIS_DATABASE_OSLOMET_URL_FORKORTER_MYDB_JDBC_URL") ?: "jdbc:postgresql://localhost:5432/postgres-url-forkorter"
    private val dbUser: String = System.getenv("NAIS_DATABASE_OSLOMET_URL_FORKORTER_MYDB_USERNAME") ?: "postgres"
    private val dbPassword: String = System.getenv("NAIS_DATABASE_OSLOMET_URL_FORKORTER_MYDB_PASSWORD") ?: "password"

    private val hikariConfig = HikariConfig().apply {
        jdbcUrl = dbUrl
        username = dbUser
        password = dbPassword
        driverClassName = "org.postgresql.Driver"
        maximumPoolSize = 5
        isAutoCommit = false
        transactionIsolation = "TRANSACTION_REPEATABLE_READ"
    }

    private val dataSource: HikariDataSource = HikariDataSource(hikariConfig)

    fun getConnection(): DataSource = dataSource
}
