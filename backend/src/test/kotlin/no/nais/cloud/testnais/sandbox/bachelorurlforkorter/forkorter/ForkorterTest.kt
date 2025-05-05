package no.nais.cloud.testnais.sandbox.bachelorurlforkorter.forkorter

import io.kotest.matchers.string.shouldHaveLength
import io.kotest.matchers.string.shouldMatch
import no.nais.cloud.testnais.sandbox.bachelorurlforkorter.common.db.DatabaseInit
import no.nais.cloud.testnais.sandbox.bachelorurlforkorter.common.config.Config
import no.nais.cloud.testnais.sandbox.bachelorurlforkorter.common.config.DbConfig
import no.nais.cloud.testnais.sandbox.bachelorurlforkorter.common.config.Env
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test

class ForkorterTest {

    companion object {
        @JvmStatic
        @BeforeAll
        fun setup() {
            val h2Config = Config(
                environment = Env.Local,
                appPort = 9999,
                introspectionUrl = "http://localhost:9999/introspect",
                dbConfig = DbConfig(
                    jdbcUrl = "jdbc:h2:mem:test;DB_CLOSE_DELAY=-1"
                )
            )
            DatabaseInit.start(h2Config)
        }
    }

    @Test
    fun lagunikurl_returnerer_korrekt_url() {
        val shortUrl = Forkorter.lagUnikKortUrl(8)


        shortUrl shouldHaveLength 8
        shortUrl shouldMatch Regex("^[a-z0-9]{8}$")
    }
}
