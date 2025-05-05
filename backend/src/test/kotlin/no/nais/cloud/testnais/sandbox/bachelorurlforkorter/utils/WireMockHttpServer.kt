package no.nais.cloud.testnais.sandbox.bachelorurlforkorter.utils

import com.github.tomakehurst.wiremock.WireMockServer
import com.github.tomakehurst.wiremock.client.WireMock.*
import com.github.tomakehurst.wiremock.core.WireMockConfiguration

class WireMockHttpServer(private val port: Int = 9999) {

    private val server = WireMockServer(WireMockConfiguration.options().port(port))

    fun start(): WireMockHttpServer {
        server.start()
        return this
    }

    fun stop() {
        if (server.isRunning) {
            server.stop()
            server.checkForUnmatchedRequests()
        }
    }

    fun reset(): WireMockHttpServer {
        server.resetAll()
        return this
    }

    fun stubTexasEndpoint(): WireMockHttpServer {
        server.stubFor(post("/introspect")
            .withRequestBody(matchingJsonPath("$.token", equalTo("valid")))
            .willReturn(okJson("""
        {
          "active": true,
          "NAVident": "Test",
          "name": "TestName",
          "preferred_username": "TestUsername"
        }
    """)))
        return this
    }
}
