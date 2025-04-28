package no.nais.cloud.testnais.sandbox.bachelorurlforkorter

import io.javalin.http.Context
import mu.KotlinLogging
import no.nais.cloud.testnais.sandbox.bachelorurlforkorter.common.auth.Auth.BrukerResponse
import no.nais.cloud.testnais.sandbox.bachelorurlforkorter.common.auth.Auth.hentBrukerInfo
import no.nais.cloud.testnais.sandbox.bachelorurlforkorter.common.db.EntryDataAccessObject
import no.nais.cloud.testnais.sandbox.bachelorurlforkorter.common.dto.CreateEntryRequest
import no.nais.cloud.testnais.sandbox.bachelorurlforkorter.forkorter.Forkorter

private val logger = KotlinLogging.logger {}

object BrukerController {

    fun hentBruker(ctx: Context) {
        val bruker = hentBrukerInfo(ctx)
        if (!bruker.active) ctx.status(401)
        ctx.status(200).json(
            BrukerResponse(
                navIdent = bruker.NAVident,
                name = bruker.name,
                preferredUsername = bruker.preferred_username
            )
        )
    }
}

object UrlController {

    fun videresend(ctx: Context) {
        val korturl = ctx.pathParam("path")
        if (!korturl.matches(Regex("^[a-z0-9]{6}$"))) {
            ctx.status(204)
            return
        }
        try {
            val langurl = EntryDataAccessObject.getEntryLongUrl(korturl.toString())
            if (langurl.isNullOrBlank()) {
                ctx.status(404).json(mapOf("message" to "Finner ingen URL i databasen"))
                return
            }
            logger.info("Videsendt URL: $korturl til $langurl")
            EntryDataAccessObject.incrementClicks(korturl)
            ctx.status(307).redirect(sanitizeCRLF(langurl) ?: "/")
        } catch (e: Exception) {
            logger.error("Feil ved redirect: {}", korturl, e)
            ctx.status(500)
        }
    }

    fun sjekk(ctx: Context) {
        val korturl = ctx.queryParam("korturl")
        if (korturl.isNullOrBlank()) {
            ctx.status(400).json(mapOf("message" to "Mangler URL"))
            return
        }
        try {
            val langurl = EntryDataAccessObject.getEntryLongUrl(korturl.toString())
            if (langurl == null) {
                ctx.status(404)
                return
            }
            ctx.status(200).json(mapOf("langurl" to langurl))
        } catch (e: Exception) {
            logger.error("Feil ved sjekk av url: {}", korturl, e)
            ctx.status(500)
        }
    }

    fun opprett(ctx: Context) {
        // TODO: Ikke send bruker fra frontend, sjekk innlogging i backend
        val request = ctx.bodyValidator(CreateEntryRequest::class.java)
            .check({ !it.originalurl.isNullOrBlank() }, "Url kan ikke være tom")
            .check({ !it.bruker.isNullOrBlank() }, "Bruker kan ikke være tom")
            .get()

        try {
            // TODO: Valider korturl
            val forkortetUrl = request.korturl?: Forkorter.lagUnikKortUrl()
            EntryDataAccessObject.storeNewEntry(request.beskrivelse, forkortetUrl, request.originalurl.toString(), request.bruker)
            ctx.status(201).json(mapOf("forkortetUrl" to forkortetUrl))
        } catch (e: Exception) {
            logger.error("Feil ved forkorting av url: {}", request.originalurl, e)
            ctx.status(500)
        }
    }

    fun hentAlleMedMetadata(ctx: Context) {
        try {
            val urls = EntryDataAccessObject.getAllEntriesWithMetadata()
            ctx.status(200).json(urls)
        } catch (e: Exception) {
            logger.error("Feil ved henting av alle URLer", e)
            ctx.status(500)
        }
    }

    fun slett(ctx: Context) {
        val id = ctx.queryParam("id")
        try {
            EntryDataAccessObject.deleteEntryByID(Integer.parseInt(id))
            ctx.status(204)
        } catch (e: Exception) {
            logger.error("Feil ved sletting av URL", e)
            ctx.status(500)
        }
    }
}

private fun sanitizeCRLF(dirty: String?): String? {
    return dirty?.replace(Regex("[\r\n]+"), "")
}