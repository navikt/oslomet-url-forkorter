package no.nais.cloud.testnais.sandbox.bachelorurlforkorter

import io.kotest.matchers.shouldBe
import kong.unirest.core.HttpResponse
import kong.unirest.core.HttpStatus
import kong.unirest.core.JsonNode
import kong.unirest.core.Unirest
import no.nais.cloud.testnais.sandbox.bachelorurlforkorter.common.config.createApplicationConfigFromFile
import no.nais.cloud.testnais.sandbox.bachelorurlforkorter.common.db.DatabaseInit
import no.nais.cloud.testnais.sandbox.bachelorurlforkorter.utils.WireMockHttpServer
import org.junit.jupiter.api.AfterAll
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class UrlForkorterApiTest {
  companion object {
    private const val APP_PORT = 8001
    private const val BASE_URL = "http://localhost:$APP_PORT/api"
    private val wireMock = WireMockHttpServer()

    @JvmStatic
    @BeforeAll
    fun init() {
      val config = createApplicationConfigFromFile("test.properties")
      wireMock.start()
        .stubTexasEndpoint()
      DatabaseInit.start(config)
      startAppServer(config)
    }
  }

  @AfterAll
  fun tearDown() {
    wireMock.stop()
  }

  @Test
  fun ingen_authorization_gir_unauthorized() {
    val response: HttpResponse<JsonNode> = Unirest.get("$BASE_URL/url/hentalle")
      .header("Content-type", "application/json")
      .accept("application/json")
      .asJson()

    response.status.shouldBe(HttpStatus.UNAUTHORIZED)
  }

  @Test
  fun authorization_gir_tilgang() {
    val response: HttpResponse<JsonNode> = Unirest.get("$BASE_URL/url/hentalle")
      .header("Authorization", "Bearer test-valid")
      .header("Content-type", "application/json")
      .accept("application/json")
      .asJson()

    response.status.shouldBe(HttpStatus.OK)
  }
}

