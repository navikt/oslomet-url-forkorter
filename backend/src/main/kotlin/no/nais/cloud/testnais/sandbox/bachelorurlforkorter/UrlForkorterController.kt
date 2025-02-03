package no.nais.cloud.testnais.sandbox.bachelorurlforkorter

import io.javalin.http.Context
import no.nais.cloud.testnais.sandbox.bachelorurlforkorter.common.db.ShortUrlDataAccessObject

object UrlForkorterController {

    fun test(ctx: Context) {
        ctx.result("Hello world!")
    }

    fun forkort(ctx: Context) {
        val langurl = ctx.pathParam("langurl")
        ShortUrlDataAccessObject.storeShortUrl("123", langurl, "Sigurd")
        ctx.status(201)
    }

    fun sjekk(ctx: Context) {
        val korturl = ctx.pathParam("korturl")
        val langurl = ShortUrlDataAccessObject.getLongUrl(korturl)
        ctx.result(langurl.toString())
    }
}