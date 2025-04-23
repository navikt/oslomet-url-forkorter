package no.nais.cloud.testnais.sandbox.bachelorurlforkorter.common.auth

import io.javalin.http.Context
import io.javalin.http.UnauthorizedResponse
import java.net.URI
import java.net.http.HttpClient
import java.net.http.HttpRequest
import java.net.http.HttpResponse
import java.time.Duration

object Auth {

    private val httpClient: HttpClient = HttpClient.newBuilder()
        .connectTimeout(Duration.ofSeconds(10))
        .build()

    private val introspectionUrl = System.getenv("NAIS_TOKEN_INTROSPECTION_ENDPOINT")

    fun autoriserBrukerMotTexas(ctx: Context) {
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

            val debugInfo = mapOf(
                "introspectionUrl" to introspectionUrl,
                "requestBody" to jsonBody,
                "responseCode" to response.statusCode(),
                "responseBody" to response.body()
            )

            if (response.statusCode() > 300) {
                ctx.status(201).json(debugInfo)
            } else {
                ctx.status(200).json(debugInfo)
            }
        } catch (e: Exception) {
            ctx.status(400).json(
                mapOf(
                    "error" to e.message,
                    "stackTrace" to e.stackTraceToString(),
                    "introspectionUrl" to introspectionUrl
                )
            )
        }
    }

}
