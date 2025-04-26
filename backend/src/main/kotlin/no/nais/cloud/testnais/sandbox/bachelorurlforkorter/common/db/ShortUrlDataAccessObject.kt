package no.nais.cloud.testnais.sandbox.bachelorurlforkorter.common.db

import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq

object ShortUrlDataAccessObject {
    fun storeNewEntry(shortUrl: String, longUrl: String, createdBy: String?) {
        transaction {
            entries.insert {
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

    fun getAllEntriesWithMetadata(): List<Map<String, Any?>> {
        return transaction {
            entries.selectAll().map {
                mapOf(
                    "id" to it[entries.id],
                    "shortUrl" to it[entries.shortUrl],
                    "longUrl" to it[entries.longUrl],
                    "createdAt" to it[entries.createdAt].toString(),
                    "createdBy" to it[entries.createdBy],
                    "clicks" to it[entries.clicks]
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

    fun deleteEntryByID(id: Int): Boolean {
        return transaction {
            entries.deleteWhere { entries.id eq id } > 0
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
