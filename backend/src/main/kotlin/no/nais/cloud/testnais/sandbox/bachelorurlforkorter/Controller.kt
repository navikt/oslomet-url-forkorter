package no.nais.cloud.testnais.sandbox.bachelorurlforkorter

import io.javalin.http.BadRequestResponse
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

object Controller {

    fun videresend(ctx: Context) {
        val korturl = ctx.pathParam("path")
        if (!korturl.matches(Regex("^[a-z0-9]{3,15}$"))) {
            ctx.status(204)
            return
        }
        try {
            val originalurl = EntryDataAccessObject.getEntryLongUrl(korturl.toString())
            if (originalurl.isNullOrBlank()) {
                ctx.status(404).json(mapOf("message" to "Finner ingen URL i databasen"))
                return
            }
            logger.info("Videsendt URL: $korturl til $originalurl")
            EntryDataAccessObject.incrementClicks(korturl)
            ctx.status(307).redirect(sanitizeCRLF(originalurl) ?: "/")
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
        val request = ctx.bodyValidator(CreateEntryRequest::class.java)
            .check({ !it.originalurl.isNullOrBlank() }, "Url kan ikke være tom")
            .get()
        try {
            val bruker = hentBrukerInfo(ctx).NAVident
            val forkortetUrl = request.korturl?: Forkorter.lagUnikKortUrl()
            EntryDataAccessObject.storeNewEntry(request.beskrivelse, forkortetUrl, request.originalurl.toString(), bruker)
            ctx.status(201).json(mapOf("forkortetUrl" to forkortetUrl))
        } catch (e: Exception) {
            logger.error("Feil ved forkorting av url: {}", request.originalurl, e)
            ctx.status(500)
        }
    }

    fun oppdater(ctx: Context) {
        val request = ctx.bodyAsClass(CreateEntryRequest::class.java)
        try {
            val id = request.entryid?.toInt()
            if (id == null) {
                ctx.status(400)
                return
            }
            val newUrl = request.originalurl
            val newDesc = request.beskrivelse
            val brukerid = hentBrukerInfo(ctx).NAVident

            val success = EntryDataAccessObject.updateEntryById(id, brukerid, newDesc, newUrl.toString())
            if (success) {
                ctx.status(200).result("Oppdatert")
            } else {
                ctx.status(400).result("Fant ikke lenke med gitt ID eller feil bruker ID")
            }
        } catch (e: Exception) {
            logger.error("Feil ved oppdatering av url: {}", request.originalurl, e)
            ctx.status(500)
        }
    }

    fun hentAlleMedMetadata(ctx: Context) {
        try {
            val urls = EntryDataAccessObject.getEntriesWithMetadata()
            ctx.status(200).json(urls)
        } catch (e: Exception) {
            logger.error("Feil ved henting av alle lenker", e)
            ctx.status(500)
        }
    }

    fun hentForInnloggetBrukerMedMetadata(ctx: Context) {
        val bruker = hentBrukerInfo(ctx).NAVident
        if (bruker.isBlank()) {
            ctx.status(401)
            return
        }
        try {
            val urls = EntryDataAccessObject.getEntriesWithMetadata(bruker)
            ctx.status(200).json(urls)
        } catch (e: Exception) {
            logger.error("Feil ved henting av lenker for bruker: {}", bruker, e)
            ctx.status(500)
        }
    }

    fun hentKlikkForLenkeID(ctx: Context) {
        try {
            val id = ctx.queryParam("id")?.toIntOrNull()
                ?: throw BadRequestResponse("Mangler eller ugyldig 'id'")
            val response = EntryDataAccessObject.getEntryClicksGroupedByDate(id)
            ctx.status(200).json(response)
        } catch (e: Exception) {
            logger.error("Feil ved henting av lenkestatistikk:", e)
            ctx.status(500)
        }
    }

    fun slett(ctx: Context) {
        val id = ctx.queryParam("id")
        val brukerid = hentBrukerInfo(ctx).NAVident
        try {
            EntryDataAccessObject.deleteEntryByID(Integer.parseInt(id), brukerid)
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