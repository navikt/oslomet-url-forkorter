package no.nais.cloud.testnais.sandbox.bachelorurlforkorter

import io.javalin.Javalin
import io.javalin.apibuilder.ApiBuilder.get
import io.javalin.apibuilder.ApiBuilder.path
import io.javalin.apibuilder.ApiBuilder.post
import io.javalin.http.Context
import io.javalin.http.HttpResponseException
import io.javalin.http.HttpStatus
import io.javalin.http.UnauthorizedResponse
import io.javalin.http.staticfiles.Location
import io.javalin.security.RouteRole
import mu.KotlinLogging
import no.nais.cloud.testnais.sandbox.bachelorurlforkorter.common.config.*
import no.nais.cloud.testnais.sandbox.bachelorurlforkorter.common.db.DatabaseInitializer
import org.slf4j.MDC

private val logger = KotlinLogging.logger {}

fun main() {
    val config = createApplicationConfig()
    startAppServer(config);
}

fun startAppServer(config: Config) {
    DatabaseInitializer.init(config)
    val app = Javalin.create { javalinConfig ->
        javalinConfig.router.apiBuilder {
            path("api") {
                get("test", UrlForkorterController::test, Rolle.Alle)
                get("sjekk/{korturl}", UrlForkorterController::sjekk, Rolle.Alle)

                post("test", UrlForkorterController::test, Rolle.NavInnloggetBruker)
                post("forkort/{langurl}", UrlForkorterController::forkort, Rolle.Alle)
            }
        }
        javalinConfig.staticFiles.add("/public", Location.CLASSPATH)
    }

    app.before { ctx ->
        setEventId(ctx)
        logApiRequest(ctx)
        validateContentType(ctx)
        validateAcceptHeader(ctx)
    }

    app.after { ctx ->
        logApiResponse(ctx)

        if (ctx.contentType() == "application/json") {
            ctx.contentType("application/json; charset=utf-8")
        }

        // Security headers
        ctx.header("X-Content-Type-Options", "nosniff")
        ctx.header("X-Frame-Options", "DENY")

        MDC.clear()
    }

    app.beforeMatched { ctx ->
        if (ctx.path().startsWith("/api/")) {
            checkAccessToEndpoint(ctx, config)
        }
    }

    app.exception(Exception::class.java) { e, ctx -> ctx.status(500).also { logger.error(e) { "Uventet feil." } } }

    app.start(config.appPort)
}

private fun setEventId(ctx: Context) = MDC.put("event.id", ctx.header("X-EVENT-ID")?.let(::sanitizeCRLF))

private fun logApiRequest(ctx: Context) {
    if (isK8sLivenessProbe(ctx)) {
        return
    }

    ctx.req().setAttribute("request.start.time", System.currentTimeMillis())
    logger.info("Request method=${ctx.req().method}, uri=${ctx.req().requestURI}")
}

private fun logApiResponse(ctx: Context) {
    if (isK8sLivenessProbe(ctx)) {
        return
    }

    val requestTime = System.currentTimeMillis() - ctx.req().getAttribute("request.start.time") as Long
    logger.info("Request uri=${ctx.req().requestURI}, Duration=${requestTime}, Response=${ctx.res().status}")
}

private fun isK8sLivenessProbe(ctx: Context): Boolean = ctx.req().requestURL.contains("alivez")

private fun validateContentType(ctx: Context) {
    if (ctx.method().name === "POST" && ctx.header("Content-Type")?.contains("application/json") != true) {
        throw HttpResponseException(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "Unsupported Media Type")
    }
}

private fun validateAcceptHeader(ctx: Context) {
    if (ctx.method().name === "POST" && ctx.header("Accept")?.contains("application/json") != true) {
        throw HttpResponseException(HttpStatus.NOT_ACCEPTABLE, "Not Acceptable")
    }
}

enum class Rolle : RouteRole {
    NavInnloggetBruker,
    Alle
}

private fun checkAccessToEndpoint(ctx: Context, config: Config) {
    when {
        ctx.routeRoles().isEmpty() -> {
            logger.error { "Manglende tilgangsstyring på endepunkt ${ctx.path()}" }
            throw UnauthorizedResponse()
        }

        ctx.routeRoles().contains(Rolle.NavInnloggetBruker) -> {
            val isValidUsername = config.authConfig.basicAuthUsername == ctx.basicAuthCredentials()?.username
            val isValidPassword = config.authConfig.basicAuthPassword.value == ctx.basicAuthCredentials()?.password

            if (!isValidUsername || !isValidPassword) {
                logger.error { "Feil ved autentisering av innlogget bruker" }
                throw UnauthorizedResponse()
            }
        }

        ctx.routeRoles().contains(Rolle.Alle) -> return
    }
}

private fun sanitizeCRLF(dirty: String?): String? = dirty?.replace("[\n\r]".toRegex(), "")
