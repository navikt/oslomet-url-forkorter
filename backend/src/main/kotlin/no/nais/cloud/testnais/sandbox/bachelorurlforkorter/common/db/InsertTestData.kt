package no.nais.cloud.testnais.sandbox.bachelorurlforkorter.common.db

import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.update
import java.time.LocalDateTime

fun insertTestData() {
    transaction {
        val now = LocalDateTime.now()

        val entryId1 = entries.insert {
            it[description] = "NRK"
            it[shortUrl] = "abc123"
            it[longUrl] = "https://www.nrk.no/"
            it[createdAt] = now.minusMonths(3)
            it[createdBy] = "Test Dummy"
        }[entries.id]

        val entryId2 = entries.insert {
            it[description] = "VG"
            it[shortUrl] = "def456"
            it[longUrl] = "https://www.vg.no/"
            it[createdAt] = now.minusMonths(2)
            it[createdBy] = "Test Dummy"
        }[entries.id]

        val entryId3 = entries.insert {
            it[description] = "IKEA Preowned"
            it[shortUrl] = "egendefinert"
            it[longUrl] = "https://preowned.ikea.com/no/no"
            it[createdAt] = now.minusMonths(1)
            it[createdBy] = "Test Dummy"
        }[entries.id]

        // Define once outside
        val daysBack = listOf(
            10 to 1,
            9 to 2,
            8 to 1,
            7 to 3,
            6 to 0,
            5 to 1,
            4 to 2,
            3 to 0,
            2 to 4,
            1 to 10
        )

        fun insertClicksWithVariation(entryId: Int) {
            for ((daysAgo, count) in daysBack) {
                repeat(count) {
                    entryClicks.insert {
                        it[shortUrlId] = entryId
                        it[clickedAt] = now.minusDays(daysAgo.toLong())
                    }
                }
            }
        }

        insertClicksWithVariation(entryId1)
        insertClicksWithVariation(entryId2)
        insertClicksWithVariation(entryId3)

        val totalClicks = daysBack.sumOf { it.second }
        entries.update({ entries.id eq entryId1 }) { it[clicks] = totalClicks }
        entries.update({ entries.id eq entryId2 }) { it[clicks] = totalClicks }
        entries.update({ entries.id eq entryId3 }) { it[clicks] = totalClicks }

        println("✅ Opprettet testdata med 3 entries og varierte klikk over 10 dager.")
    }
}



