package no.nais.cloud.testnais.sandbox.bachelorurlforkorter.auth

import no.nais.cloud.testnais.sandbox.bachelorurlforkorter.Rolle
import java.util.concurrent.ConcurrentHashMap

data class User(
    val id: String,
    val username: String,
    val hashedPassword: String?,
    val externalId: String?,
    val role: Rolle
)


object UserRepository {
    private val users = ConcurrentHashMap<String, User>()

    init {
        val hashedPassword = hashPassword("passord123")
        users["admin"] = User(
            id = "1",
            username = "testadmin",
            hashedPassword = hashedPassword,
            externalId = null,
            role = Rolle.AdminNavInnlogget
        )
        users["bruker"] = User(
            id = "1",
            username = "testbruker",
            hashedPassword = hashedPassword,
            externalId = null,
            role = Rolle.InternNavInnlogget
        )
    }

    fun findByUsername(username: String): User? = users[username]

    fun save(user: User) {
        users[user.username] = user
    }
}
