package com.data.remote.dto

data class LoginRequest(
    val username: String,
    val password: String
)

data class LoginResponse(
    val username: String,
    val token: String
)