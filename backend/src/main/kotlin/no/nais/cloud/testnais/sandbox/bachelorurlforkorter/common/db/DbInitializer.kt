package no.nais.cloud.testnais.sandbox.bachelorurlforkorter.common.db

import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.javatime.CurrentDateTime
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.javatime.datetime


object ShortUrls : Table("short_urls") {
    val id = integer("id").autoIncrement()
    val shortUrl = varchar("short_url", 255).uniqueIndex()
    val longUrl = text("long_url")
    val createdAt = datetime("created_at").defaultExpression(CurrentDateTime)
    val createdBy = varchar("created_by", 255).nullable()
    val clicks = integer("clicks").default(0)
    override val primaryKey = PrimaryKey(id)
}

object DatabaseInitializer {
    fun init() {
        Database.connect(DbConfig.getConnection())

        transaction {
            SchemaUtils.create(ShortUrls)
        }

        println("✅ Database initialized successfully.")
    }
}
