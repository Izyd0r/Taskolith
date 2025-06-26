package com.data.remote.dto

data class RegisterRequest(
    val firstName: String,
    val lastName: String,
    val username: String,
    val email: String,
    val password: String
)

data class RegisterResponse(
    val userId: String,
    val token: String
)