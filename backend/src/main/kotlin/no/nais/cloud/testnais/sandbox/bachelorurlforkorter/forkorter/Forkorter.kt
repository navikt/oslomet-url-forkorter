package no.nais.cloud.testnais.sandbox.bachelorurlforkorter.forkorter

import no.nais.cloud.testnais.sandbox.bachelorurlforkorter.common.db.EntryDataAccessObject

object Forkorter {

    fun lagUnikKortUrl(lengde: Int = 6): String {
        val existingShortUrls = EntryDataAccessObject.getAllEntries()
        var newShortUrl: String
        do {
            newShortUrl = lagKortUrl(lengde)
        } while (newShortUrl in existingShortUrls)

        return newShortUrl
    }

    private fun lagKortUrl(lengde: Int): String {
        val chars = "abcdefghijklmnopqrstuvwxyz0123456789"
        return (1..lengde)
            .map { chars.random() }
            .joinToString("")
    }

}