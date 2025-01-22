package no.nais.cloud.testnais.sandbox.bachelorurlforkorter

import io.kotest.matchers.shouldBe
import kong.unirest.core.HttpResponse
import kong.unirest.core.HttpStatus
import kong.unirest.core.JsonNode
import kong.unirest.core.Unirest
import kong.unirest.core.json.JSONObject
import no.nais.cloud.testnais.sandbox.bachelorurlforkorter.common.config.createApplicationConfig

import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test

class UrlForkorterApiTest {
  companion object {
    private const val appPortForTests = 8001
    private const val demoDataURL = "http://localhost:$appPortForTests/api/test"
    private var basicAuthUsername = ""
    private var basicAuthPassword = ""

    @JvmStatic
    @BeforeAll
    fun init() {
      val config = createApplicationConfig().copy(appPort = appPortForTests)

      startAppServer(config)

      basicAuthUsername = config.authConfig.basicAuthUsername
      basicAuthPassword = config.authConfig.basicAuthPassword.value
    }
  }

  @Test
  fun `ugyldige verdier i basic auth gir 401 Unauthorized`() {
    val request = JSONObject()

    val response: HttpResponse<JsonNode> = Unirest.post(demoDataURL)
      .header("Content-type", "application/json")
      .accept("application/json")
      .basicAuth("god", "morgen")
      .body(request)
      .asJson()

    response.status.shouldBe(HttpStatus.UNAUTHORIZED)
  }
}

