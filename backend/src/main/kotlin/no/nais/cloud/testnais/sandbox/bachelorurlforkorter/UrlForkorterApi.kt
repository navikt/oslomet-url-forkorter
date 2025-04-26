package no.nais.cloud.testnais.sandbox.bachelorurlforkorter

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import io.javalin.Javalin
import io.javalin.apibuilder.ApiBuilder.get
import io.javalin.apibuilder.ApiBuilder.path
import io.javalin.apibuilder.ApiBuilder.post
import io.javalin.http.Context
import io.javalin.http.HttpResponseException
import io.javalin.http.HttpStatus
import io.javalin.http.UnauthorizedResponse
import io.javalin.http.staticfiles.Location
import io.javalin.json.JavalinJackson
import io.javalin.security.RouteRole
import mu.KotlinLogging
import no.nais.cloud.testnais.sandbox.bachelorurlforkorter.common.auth.Auth
import no.nais.cloud.testnais.sandbox.bachelorurlforkorter.common.config.*
import no.nais.cloud.testnais.sandbox.bachelorurlforkorter.common.db.DatabaseInit
import org.slf4j.MDC

private val logger = KotlinLogging.logger {}

fun main() {
    val config = createApplicationConfig()
    DatabaseInit.start(config)
    startAppServer(config);
}

fun startAppServer(config: Config) {
    val app = Javalin.create { javalinConfig ->
        javalinConfig.jsonMapper(JavalinJackson(jacksonObjectMapper().registerKotlinModule()))
        javalinConfig.staticFiles.add("/public", Location.CLASSPATH)
        javalinConfig.router.apiBuilder {
            path("api") {
                path("bruker") {
                    get("sjekk", Auth::autoriserBrukerMotTexas, Rolle.Alle)
                }
                path("url") {
                    post("sjekk", UrlForkorterController::sjekk, Rolle.Alle)
                    post("opprett", UrlForkorterController::opprett, Rolle.InternNavInnlogget)
                    post("slett", UrlForkorterController::slett, Rolle.InternNavInnlogget)
                    get("hentalle", UrlForkorterController::hentAlleMedMetadata, Rolle.InternNavInnlogget)
                }
            }
            get("{korturl}") { ctx ->
                if (ctx.pathParam("korturl") == "index.html" || ctx.pathParam("korturl") == "dashboard") {
                    val asset =
                        UrlForkorterController::class.java.getResourceAsStream("/public/index.html")
                    if (asset != null) {
                        ctx.contentType("text/html").result(asset)
                    }
                } else {
                    UrlForkorterController.redirect(ctx)
                }
            }
        }
        // TODO: Kun for lokal utvikling med hot reload
        javalinConfig.bundledPlugins.enableCors { cors ->
            cors.addRule {
                it.allowHost("http://localhost:5173")
                it.allowCredentials = true
            }
        }
    }

    app.before { ctx ->
        validateContentType(ctx)
        validateAcceptHeader(ctx)
    }

    app.after { ctx ->
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
            checkAccessToEndpoint(ctx)
        }
    }

    app.exception(Exception::class.java) { e, ctx -> ctx.status(500).also { logger.error(e) { "Uventet feil." } } }

    app.start(config.appPort)
}

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
    Alle,
    InternNavInnlogget,
    AdminNavInnlogget
}

private fun checkAccessToEndpoint(ctx: Context) {
    when {
        ctx.routeRoles().isEmpty() -> {
            logger.error { "Manglende tilgangsstyring på endepunkt ${ctx.path()}" }
            throw UnauthorizedResponse()
        }

        ctx.routeRoles().contains(Rolle.InternNavInnlogget) || ctx.routeRoles().contains(Rolle.AdminNavInnlogget) -> {
            // TODO: Valider med texas-opplegg
        }

        ctx.routeRoles().contains(Rolle.Alle) -> return
    }
}

private fun sanitizeCRLF(dirty: String?): String? = dirty?.replace("[\n\r]".toRegex(), "")
