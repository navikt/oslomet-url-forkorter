package no.nais.cloud.testnais.sandbox.bachelorurlforkorter.common.dto

data class TexasIntrospectionResponse(
    val active: Boolean,
    val ver: String,
    val azp_name: String,
    val sid: String,
    val uti: String,
    val azpacr: String,
    val NAVident: String,
    val aio: String,
    val rh: String,
    val azp: String,
    val nbf: Long,
    val aud: String,
    val exp: Long,
    val iat: Long,
    val groups: List<String>,
    val name: String,
    val sub: String,
    val tid: String,
    val iss: String,
    val oid: String,
    val scp: String,
    val preferred_username: String
)
