package no.nais.cloud.testnais.sandbox.bachelorurlforkorter.auth

import at.favre.lib.crypto.bcrypt.BCrypt

fun hashPassword(password: String): String {
    return BCrypt.withDefaults().hashToString(12, password.toCharArray()) // 12 rounds for security
}

fun verifyPassword(inputPassword: String, storedHashedPassword: String?): Boolean {
    if (storedHashedPassword == null) return false
    return BCrypt.verifyer().verify(inputPassword.toCharArray(), storedHashedPassword).verified
}
