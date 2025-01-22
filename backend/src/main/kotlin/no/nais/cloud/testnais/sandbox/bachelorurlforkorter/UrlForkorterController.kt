package no.nais.cloud.testnais.sandbox.bachelorurlforkorter

import io.javalin.http.Context

object UrlForkorterController {

    fun test(ctx: Context) {
        ctx.result("Hello world!")
    }

}