package no.nais.cloud.testnais.sandbox.bachelorurlforkorter.common.db

import mu.KotlinLogging
import no.nais.cloud.testnais.sandbox.bachelorurlforkorter.common.config.Config
import no.nais.cloud.testnais.sandbox.bachelorurlforkorter.common.config.Env.Local
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.javatime.CurrentDateTime
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.javatime.datetime

private val logger = KotlinLogging.logger {}

object entries : Table("short_urls") {
    val id = integer("id").autoIncrement()
    val description = text("description")
    val shortUrl = varchar("short_url", 255).uniqueIndex()
    val longUrl = text("long_url")
    val createdAt = datetime("created_at").defaultExpression(CurrentDateTime)
    val createdBy = varchar("created_by", 255).nullable()
    val clicks = integer("clicks").default(0)
    override val primaryKey = PrimaryKey(id)
}

object entryClicks : Table("short_url_clicks") {
    val id = integer("id").autoIncrement()
    val shortUrlId = integer("short_url_id").references(entries.id, onDelete = ReferenceOption.CASCADE)
    val clickedAt = datetime("clicked_at").defaultExpression(CurrentDateTime)
    override val primaryKey = PrimaryKey(id)
}


object DatabaseInit {
    fun start(config: Config) {
        logger.info { "Oppretter database connection ..." }
        try {
            val db = if (config.environment == Local) {
                logger.info("Kjører lokalt med H2 in-memory database")
                Database.connect(config.dbConfig.jdbcUrl, driver = "org.h2.Driver")
            } else {
                Database.connect(config.dbConfig.getDbConnection())
            }
            transaction(db) {
                SchemaUtils.drop(entries, entryClicks)
                SchemaUtils.create(entries, entryClicks)
            }
        } catch (e: Exception) {
            throw RuntimeException("Kunne ikke opprette database connection", e)
        }
        logger.info("Database connection opprettet!")
    }
}