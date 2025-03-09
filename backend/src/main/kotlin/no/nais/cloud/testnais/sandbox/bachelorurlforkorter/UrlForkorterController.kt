package no.nais.cloud.testnais.sandbox.bachelorurlforkorter

import io.javalin.http.Context
import mu.KotlinLogging
import no.nais.cloud.testnais.sandbox.bachelorurlforkorter.common.db.ShortUrlDataAccessObject
import no.nais.cloud.testnais.sandbox.bachelorurlforkorter.forkorter.Forkorter

private val logger = KotlinLogging.logger {}

object UrlForkorterController {

    fun test(ctx: Context) {
        ctx.result("Hello world!")
    }

    fun redirect(ctx: Context) {
        val korturl = ctx.pathParam("korturl")
        try {
            val langurl = ShortUrlDataAccessObject.getLongUrl(korturl)
            if (langurl.isNullOrBlank()) {
                ctx.status(404).json(mapOf("message" to "Finner ingen URL"))
                return
            }
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
}