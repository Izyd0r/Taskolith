package com.taskolithmobile.viewmodel

import com.data.remote.dto.LoginRequest
import com.data.remote.dto.LoginResponse
import com.data.remote.dto.RegisterRequest
import com.data.remote.dto.RegisterResponse
import com.domain.repository.AuthRepository

class FakeAuthRepository : AuthRepository {

    override suspend fun registerUser(request: RegisterRequest): RegisterResponse {
        return RegisterResponse(
            userId = "fake-user-id-12345",
            token = "fake.jwt.token.for.testing.purposes"
        )
    }

    override suspend fun loginUser(request: LoginRequest): LoginResponse {
        TODO("Not yet implemented")
    }
}