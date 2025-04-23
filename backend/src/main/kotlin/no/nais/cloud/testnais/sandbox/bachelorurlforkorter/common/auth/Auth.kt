package no.nais.cloud.testnais.sandbox.bachelorurlforkorter.common.auth

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import io.javalin.http.Context
import io.javalin.http.UnauthorizedResponse
import no.nais.cloud.testnais.sandbox.bachelorurlforkorter.common.dto.TexasIntrospectionResponse
import java.net.URI
import java.net.http.HttpClient
import java.net.http.HttpRequest
import java.net.http.HttpResponse
import java.time.Duration

object Auth {

    private val objectMapper = jacksonObjectMapper()
    private val httpClient: HttpClient = HttpClient.newBuilder()
        .connectTimeout(Duration.ofSeconds(10))
        .build()

    private val introspectionUrl = System.getenv("NAIS_TOKEN_INTROSPECTION_ENDPOINT")

    data class BrukerResponse(
        val navIdent: String,
        val name: String,
        val preferredUsername: String
    )

    fun autoriserBrukerMotTexas(ctx: Context) {
        val response = sendRequest(ctx)
        if (response.active) {
            ctx.status(200).json(
                BrukerResponse(
                    navIdent = response.NAVident,
                    name = response.name,
                    preferredUsername = response.preferred_username
                )
            )
        } else {
            ctx.status(401)
        }

    }

    private fun sendRequest(ctx: Context): TexasIntrospectionResponse {
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
                .uri(URI.create(introspectionUrl))
                .timeout(Duration.ofSeconds(10))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                .build()

            val response = httpClient.send(request, HttpResponse.BodyHandlers.ofString())

            if (response.statusCode() != 200) throw UnauthorizedResponse()

            return objectMapper.readValue(response.body(), TexasIntrospectionResponse::class.java)

        } catch (e: Exception) {
            throw UnauthorizedResponse(e.message ?: e.toString())
        }
    }

}
