package no.nais.cloud.testnais.sandbox.bachelorurlforkorter.common.config

import mu.KotlinLogging
import no.nais.cloud.testnais.sandbox.bachelorurlforkorter.common.config.Env.Local
import no.nais.cloud.testnais.sandbox.bachelorurlforkorter.common.config.Env.Dev
import no.nais.cloud.testnais.sandbox.bachelorurlforkorter.common.config.Env.Test
import no.nais.cloud.testnais.sandbox.bachelorurlforkorter.common.config.Env.Prod
import java.util.Properties

private val logger = KotlinLogging.logger {}

data class Config(
  val environment: Env,
  val appPort: Int,
  val healthProbePort: Int?,
  val exposeWeblogs: Boolean,
  val authConfig: AuthConfig,
)

data class AuthConfig(val basicAuthUsername: String, val basicAuthPassword: Password)

data class Password(val value: String) {
  override fun toString() = "*****"
}

enum class Env {
  Local, Dev, Test, Prod
}

fun createApplicationConfig(): Config {
  val props = Properties()

  System.getenv().entries.forEach { props.setProperty(it.key, it.value) }

  if (getEnv(props) == null) {
    addLocalProperties(props)
  }

  return Config(
    environment = getEnv(props)
      ?: throw RuntimeException("Property \"environment\" is not set. Valid values are: local, dev, test and prod."),
    appPort = props.getProperty("app.port").toInt(),
    healthProbePort = props.getProperty("health.prope.port")?.toInt(),
    exposeWeblogs = props.getProperty("weblogs.expose").toBoolean(),
    authConfig = AuthConfig(
      basicAuthUsername = props.getProperty("basicauth.username"),
      basicAuthPassword = Password(props.getProperty("basicauth.password"))
    )
  ).also(::logConfig)
}

private fun logConfig(config: Config) {
  if (config.environment in listOf( Local, Dev, Test, Prod)) {
    logger.info("Created config : $config")
  }
}

private fun addLocalProperties(props: Properties): Properties {
  val fileName = "local.properties"

  {}.javaClass.getResourceAsStream("/$fileName")?.use {
    logger.info("Reading properties from $fileName")
    props.load(it)
  } ?: logger.warn { "Missing $fileName file" }

  return props
}

private fun getEnv(props: Properties): Env? =
  when (props.getProperty("environment")) {
    "local" -> Local
    "dev" -> Dev
    "test" -> Test
    "prod" -> Prod
    else -> null
  }
