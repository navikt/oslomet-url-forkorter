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
import no.nais.cloud.testnais.sandbox.bachelorurlforkorter.common.auth.Auth.brukerErNavInnlogget
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
                    get("hent", BrukerController::hentBruker, Rolle.Alle)
                }
                path("url") {
                    post("sjekk", UrlController::sjekk, Rolle.Alle)
                    post("opprett", UrlController::opprett, Rolle.InternNavInnlogget)
                    post("slett", UrlController::slett, Rolle.InternNavInnlogget)
                    /*                    get("hentforbruker", UrlController::hentForBrukerMedMetadata, Rolle.InternNavInnlogget)*/
                    get("hentalle", UrlController::hentAlleMedMetadata, Rolle.InternNavInnlogget)
                }
            }
            // Dersom ingen endepunkter treffes skal man enten serve assets eller videresende til ekstern url
            get("{path}") { ctx ->
                UrlController::class.java.getResourceAsStream("/public/index.html")
                    ?.takeIf { ctx.pathParam("path") == "index.html" }
                    ?.let { ctx.contentType("text/html").result(it) }
                    ?: UrlController.videresend(ctx)
            }
        }

        if (config.environment == Env.Local) {
            javalinConfig.bundledPlugins.enableCors { cors ->
                cors.addRule {
                    it.allowHost("http://localhost:5173")
                    it.allowCredentials = true
                }
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

private fun checkAccessToEndpoint(ctx: Context, config: Config) {
    when {
        ctx.routeRoles().isEmpty() -> {
            logger.error { "Manglende tilgangsstyring på endepunkt ${ctx.path()}" }
            throw UnauthorizedResponse()
        }

        ctx.routeRoles().contains(Rolle.InternNavInnlogget) || ctx.routeRoles().contains(Rolle.AdminNavInnlogget) -> {
            if (config.environment == Env.Local) {
                logger.warn { "Bruker ikke innlogget, men tillates i lokal utvikling på endepunkt ${ctx.path()}" }
                return
            }
            if (!brukerErNavInnlogget(ctx)) {
                logger.warn { "Bruker ikke autorisert på endepunkt ${ctx.path()}" }
                throw UnauthorizedResponse()
            }
        }
        ctx.routeRoles().contains(Rolle.Alle) -> return
    }
}