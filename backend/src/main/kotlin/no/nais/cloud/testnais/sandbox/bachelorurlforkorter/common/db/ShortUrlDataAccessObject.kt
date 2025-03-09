package no.nais.cloud.testnais.sandbox.bachelorurlforkorter.common.db

import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction

object ShortUrlDataAccessObject {
    fun storeShortUrl(shortUrl: String, longUrl: String, createdBy: String?) {
        transaction {
            ShortUrls.insert {
                it[ShortUrls.shortUrl] = shortUrl
                it[ShortUrls.longUrl] = longUrl
                it[ShortUrls.createdBy] = createdBy
            }
        }
    }

    fun getAllShortUrls(): List<String> {
        return transaction {
            ShortUrls.selectAll().map { it[ShortUrls.shortUrl] }
        }
    }

    fun getAllUrlsWithMetadata(): List<Map<String, Any?>> {
        return transaction {
            ShortUrls.selectAll().map {
                mapOf(
                    "id" to it[ShortUrls.id],
                    "shortUrl" to it[ShortUrls.shortUrl],
                    "longUrl" to it[ShortUrls.longUrl],
                    "createdAt" to it[ShortUrls.createdAt].toString(),
                    "createdBy" to it[ShortUrls.createdBy],
                    "clicks" to it[ShortUrls.clicks]
                )
            }
        }
    }

    fun getLongUrl(shortUrl: String): String? {
        return transaction {
            ShortUrls.select { ShortUrls.shortUrl eq shortUrl }
                .map { it[ShortUrls.longUrl] }
                .firstOrNull()
        }
    }

    fun incrementClicks(shortUrl: String) {
        transaction {
            ShortUrls.update({ ShortUrls.shortUrl eq shortUrl }) {
                with(SqlExpressionBuilder) {
                    it.update(clicks, clicks + 1)
                }
            }
        }
    }
}
