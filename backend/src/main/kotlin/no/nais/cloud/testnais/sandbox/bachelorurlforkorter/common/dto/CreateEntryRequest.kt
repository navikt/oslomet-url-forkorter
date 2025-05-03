package no.nais.cloud.testnais.sandbox.bachelorurlforkorter.common.dto

data class CreateEntryRequest(
    val beskrivelse: String?,
    val originalurl: String?,
    val korturl: String?,
    val entryid: String?
)