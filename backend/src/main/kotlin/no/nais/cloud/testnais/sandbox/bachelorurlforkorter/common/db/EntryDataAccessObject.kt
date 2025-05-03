package no.nais.cloud.testnais.sandbox.bachelorurlforkorter.common.db

import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.vendors.H2Dialect
import org.jetbrains.exposed.sql.vendors.PostgreSQLDialect
import org.jetbrains.exposed.sql.vendors.currentDialect
import java.time.LocalDate

object EntryDataAccessObject {
    fun storeNewEntry(description: String?, shortUrl: String, longUrl: String, createdBy: String?) {
        transaction {
            entries.insert {
                it[entries.description] = description?: ""
                it[entries.shortUrl] = shortUrl
                it[entries.longUrl] = longUrl
                it[entries.createdBy] = createdBy
            }
        }
    }

    fun getAllEntries(): List<String> {
        return transaction {
            entries.selectAll().map { it[entries.shortUrl] }
        }
    }

    fun updateEntryById(id: Int, brukerid: String, newDescription: String?, newLongUrl: String): Boolean {
        return transaction {
            entries.update({ (entries.id eq id) and (entries.createdBy eq brukerid) }) {
                it[description] = newDescription ?: ""
                it[longUrl] = newLongUrl
            } > 0
        }
    }

    fun getEntriesWithMetadata(username: String? = null): List<Map<String, Any?>> {
        return transaction {
            val query = if (username != null) {
                entries.select { entries.createdBy eq username }
            } else {
                entries.selectAll()
            }

            query.map {
                mapOf(
                    "id" to it[entries.id],
                    "description" to it[entries.description],
                    "shortUrl" to it[entries.shortUrl],
                    "longUrl" to it[entries.longUrl],
                    "createdAt" to it[entries.createdAt].toString(),
                    "createdBy" to it[entries.createdBy],
                    "clicks" to it[entries.clicks]
                )
            }
        }
    }

    data class ClicksPerDateDTO(val date: LocalDate, val count: Long)

    // Den her er litt hacky for å kunne støtte H2
    fun getEntryClicksGroupedByDate(id: Int): List<ClicksPerDateDTO> {
        return transaction {
            val dateColumn: Expression<Any?> = when (currentDialect) {
                is PostgreSQLDialect -> object : Expression<Any?>() {
                    override fun toQueryBuilder(q: QueryBuilder) {
                        q.append("DATE(", entryClicks.clickedAt, ")")
                    }
                }.alias("click_date")

                is H2Dialect -> object : Expression<Any?>() {
                    override fun toQueryBuilder(q: QueryBuilder) {
                        q.append("CAST(", entryClicks.clickedAt, " AS DATE)")
                    }
                }.alias("click_date")

                else -> error("Unsupported SQL dialect: ${currentDialect.name}")
            }
            val countColumn = entryClicks.id.count().alias("click_count")

            entryClicks
                .slice(dateColumn, countColumn)
                .select { entryClicks.shortUrlId eq id }
                .groupBy(dateColumn)
                .map { row ->
                    val raw = row[dateColumn]
                    val localDate = raw?.toString()?.let { LocalDate.parse(it) }
                        ?: error("Expected date value, got null or unparseable")
                    ClicksPerDateDTO(
                        date = localDate,
                        count = row[countColumn]
                    )
                }
        }
    }

    fun getEntryLongUrl(shortUrl: String): String? {
        return transaction {
            entries.select { entries.shortUrl eq shortUrl }
                .map { it[entries.longUrl] }
                .firstOrNull()
        }
    }

    fun incrementClicks(shortUrl: String) {
        transaction {
            val id = findEntryByID(shortUrl)

            entryClicks.insert {
                it[shortUrlId] = id
            }

            entries.update({ entries.shortUrl eq shortUrl }) {
                with(SqlExpressionBuilder) {
                    it.update(clicks, clicks + 1)
                }
            }
        }
    }

    fun deleteEntryByID(id: Int, brukerid: String): Boolean {
        return transaction {
            entries.deleteWhere { (entries.id eq id) and (createdBy eq brukerid) } > 0
        }
    }
}

private fun findEntryByID(shortUrl: String): Int {
    return entries
        .select { entries.shortUrl eq shortUrl }
        .singleOrNull()
        ?.get(entries.id)
        ?: throw IllegalArgumentException("Short URL not found: $shortUrl")
}
