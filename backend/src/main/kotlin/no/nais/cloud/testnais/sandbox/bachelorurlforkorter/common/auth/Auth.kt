package no.nais.cloud.testnais.sandbox.bachelorurlforkorter.common.auth

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import io.javalin.http.Context
import io.javalin.http.UnauthorizedResponse
import mu.KotlinLogging
import no.nais.cloud.testnais.sandbox.bachelorurlforkorter.common.config.Config
import no.nais.cloud.testnais.sandbox.bachelorurlforkorter.common.dto.TexasIntrospectionResponse
import java.net.URI
import java.net.http.HttpClient
import java.net.http.HttpRequest
import java.net.http.HttpResponse
import java.time.Duration

private val logger = KotlinLogging.logger {}

object Auth {

    private val objectMapper = jacksonObjectMapper()
    private val httpClient: HttpClient = HttpClient.newBuilder()
        .connectTimeout(Duration.ofSeconds(10))
        .build()

    data class BrukerResponse(
        val navIdent: String,
        val name: String,
        val preferredUsername: String
    )

    fun hentBrukerInfo(ctx: Context): TexasIntrospectionResponse {
        return ctx.attribute("texasresponse")
            ?: throw UnauthorizedResponse("Bruker mangler. Har du kalt autoriserBruker først?")

    }

    fun autoriserBruker(ctx: Context, config: Config): Boolean {
        if (ctx.header("Authorization").isNullOrBlank()) return false
        val response = sendTexasRequest(ctx, config)
        ctx.attribute("texasresponse", response)
        return response.active
    }

    private fun sendTexasRequest(ctx: Context, config: Config): TexasIntrospectionResponse {
        ctx.attribute<TexasIntrospectionResponse>("texasresponse")?.let { return it }
        try {
            val token = ctx.header("Authorization")?.removePrefix("Bearer ")
                ?: throw UnauthorizedResponse("Mangler Authorization header")

            val jsonBody = """
        {
          "identity_provider": "azuread",
          "token": "$token"
        }
        """.trimIndent()

            val request = HttpRequest.newBuilder()
                .uri(URI.create(config.introspectionUrl))
                .timeout(Duration.ofSeconds(10))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                .build()

            logger.info("Kaller texas for autorisasjon av token")
            val response = httpClient.send(request, HttpResponse.BodyHandlers.ofString())

            if (response.statusCode() != 200) throw UnauthorizedResponse()

            return objectMapper.readValue(response.body(), TexasIntrospectionResponse::class.java)

        } catch (e: Exception) {
            throw UnauthorizedResponse(e.message ?: e.toString())
        }
    }

}
