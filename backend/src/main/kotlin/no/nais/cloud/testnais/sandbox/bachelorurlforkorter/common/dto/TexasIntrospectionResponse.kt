package no.nais.cloud.testnais.sandbox.bachelorurlforkorter.common.dto

import com.fasterxml.jackson.annotation.JsonIgnoreProperties

@JsonIgnoreProperties(ignoreUnknown = true)
data class TexasIntrospectionResponse(
    val active: Boolean,
    val NAVident: String,
    val name: String,
    val preferred_username: String,

    val ver: String? = null,
    val azp_name: String? = null,
    val sid: String? = null,
    val uti: String? = null,
    val azpacr: String? = null,
    val aio: String? = null,
    val rh: String? = null,
    val azp: String? = null,
    val nbf: Long? = null,
    val aud: String? = null,
    val exp: Long? = null,
    val iat: Long? = null,
    val groups: List<String>? = null,
    val sub: String? = null,
    val tid: String? = null,
    val iss: String? = null,
    val oid: String? = null,
    val scp: String? = null,
)
