package no.nais.cloud.testnais.sandbox.bachelorurlforkorter.auth

import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonProperty
import com.nimbusds.jose.JWSAlgorithm
import com.nimbusds.jose.JWSHeader
import com.nimbusds.jose.JWSVerifier
import com.nimbusds.jose.crypto.MACSigner
import com.nimbusds.jose.crypto.MACVerifier
import com.nimbusds.jwt.JWTClaimsSet
import com.nimbusds.jwt.SignedJWT
import io.javalin.http.Context
import io.javalin.http.UnauthorizedResponse
import jakarta.servlet.http.Cookie
import mu.KotlinLogging
import no.nais.cloud.testnais.sandbox.bachelorurlforkorter.Rolle
import java.net.URLDecoder
import java.net.URLEncoder
import java.nio.charset.StandardCharsets
import java.util.Date

data class LoginRequest @JsonCreator constructor(
    @JsonProperty("username") val username: String,
    @JsonProperty("password") val password: String
)

private val logger = KotlinLogging.logger {}

object Auth {

    private const val SECRET_KEY = "U29tZXN1cGVyc2VjdXJlcGFzc3BocmFzZQ==\n"
    private const val TOKEN_EXPIRATION_TIME = 1000 * 60 * 60

    fun loggInn(ctx: Context) {
        val loginRequest = ctx.bodyAsClass(LoginRequest::class.java)
        val user = UserRepository.findByUsername(loginRequest.username)
            ?: throw UnauthorizedResponse("Invalid credentials")

        if (!verifyPassword(loginRequest.password, user.hashedPassword)) {
            throw UnauthorizedResponse("Invalid credentials")
        }

        val token = createJwtToken(user)

        val encodedToken = URLEncoder.encode(token, StandardCharsets.UTF_8.toString())

        ctx.header("Set-Cookie",
            "session_token=$encodedToken; Path=/; Max-Age=${TOKEN_EXPIRATION_TIME / 3600}; Secure; HttpOnly; SameSite=Strict"
        )

        logger.info("Innlogging suksessfull for: {}", loginRequest.username)

        ctx.status(204)
    }

    fun hentInnloggetBruker(ctx: Context): Context {
        val token = ctx.cookie("session_token") ?: return ctx.status(401)

        val decodedToken = URLDecoder.decode(token, StandardCharsets.UTF_8.toString())
        val signedJWT = SignedJWT.parse(decodedToken)

        val expiration = signedJWT.jwtClaimsSet.expirationTime
        if (expiration.before(Date())) {
            return ctx.status(401)
        }

        val username = signedJWT.jwtClaimsSet.subject
        return ctx.status(200).json(mapOf("username" to username))
    }


    fun loggUt(ctx: Context) {
        ctx.removeCookie("session_token")
        ctx.status(204)
    }


    fun createJwtToken(user: User): String {
        val signer = MACSigner(SECRET_KEY.toByteArray()) // HMAC signer

        val jwtClaims = JWTClaimsSet.Builder()
            .subject(user.username)
            .claim("role", user.role.name)
            .issueTime(Date())
            .expirationTime(Date(System.currentTimeMillis() + TOKEN_EXPIRATION_TIME))
            .issuer("n.av")
            .build()

        val signedJWT = SignedJWT(JWSHeader(JWSAlgorithm.HS256), jwtClaims)
        signedJWT.sign(signer)

        return signedJWT.serialize()
    }

    fun validateJwtToken(ctx: Context): Pair<String, Rolle>? {
        val token = ctx.cookie("session_token")?.let {
            URLDecoder.decode(it, StandardCharsets.UTF_8.toString())
        } ?: return null

        return try {
            val signedJWT = SignedJWT.parse(token)
            val verifier: JWSVerifier = MACVerifier(SECRET_KEY.toByteArray())

            if (!signedJWT.verify(verifier)) {
                return null // Invalid signature
            }

            val expiration = signedJWT.jwtClaimsSet.expirationTime
            if (expiration.before(Date())) {
                return null // Token expired
            }

            val username = signedJWT.jwtClaimsSet.subject
            val roleName = signedJWT.jwtClaimsSet.getStringClaim("role")
            val role = Rolle.valueOf(roleName)

            Pair(username, role)
        } catch (e: Exception) {
            logger.warn("Feil ved validering av session token: {}", e.message)
            null // Invalid token
        }
    }

}