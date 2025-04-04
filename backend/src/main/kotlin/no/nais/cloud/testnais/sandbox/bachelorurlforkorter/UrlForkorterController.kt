package no.nais.cloud.testnais.sandbox.bachelorurlforkorter

import io.javalin.http.Context
import mu.KotlinLogging
import no.nais.cloud.testnais.sandbox.bachelorurlforkorter.common.db.ShortUrlDataAccessObject
import no.nais.cloud.testnais.sandbox.bachelorurlforkorter.forkorter.Forkorter

private val logger = KotlinLogging.logger {}

object UrlForkorterController {

    fun redirect(ctx: Context) {
        val korturl = ctx.pathParam("korturl")
        if (!korturl.matches(Regex("^[a-z0-9]{6}$"))) {
            ctx.status(204)
            return
        }
        try {
            val langurl = ShortUrlDataAccessObject.getLongUrl(korturl.toString())
            if (langurl.isNullOrBlank()) {
                ctx.status(404).json(mapOf("message" to "Finner ingen URL i databasen"))
                return
            }
            logger.info("Videsendt URL: $korturl til $langurl")
            ShortUrlDataAccessObject.incrementClicks(korturl)
            ctx.status(307).redirect(langurl)
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
            val langurl = ShortUrlDataAccessObject.getLongUrl(korturl.toString())
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

    fun forkort(ctx: Context) {
        val originalUrl = ctx.queryParam("langurl")
        if (originalUrl.isNullOrBlank()) {
            ctx.status(400).json(mapOf("message" to "Mangler URL"))
            return
        }
        try {
            val forkortetUrl = Forkorter.lagUnikKortUrl()
            ShortUrlDataAccessObject.storeShortUrl(forkortetUrl, originalUrl.toString(), "Sigurd")
            ctx.status(201).json(mapOf("forkortetUrl" to forkortetUrl))
        } catch (e: Exception) {
            logger.error("Feil ved forkorting av url: {}", originalUrl, e)
            ctx.status(500)
        }
    }

    fun hentAlleMedMetadata(ctx: Context) {
        try {
            val urls = ShortUrlDataAccessObject.getAllUrlsWithMetadata()
            ctx.status(200).json(urls)
        } catch (e: Exception) {
            logger.error("Feil ved henting av alle URLer", e)
            ctx.status(500)
        }
    }

    fun slett(ctx: Context) {
        val id = ctx.queryParam("id")
        try {
            ShortUrlDataAccessObject.deleteShortUrlById(Integer.parseInt(id))
            ctx.status(204)
        } catch (e: Exception) {
            logger.error("Feil ved sletting av URL", e)
            ctx.status(500)
        }
    }
}