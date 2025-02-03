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
