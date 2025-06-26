package com.taskolithmobile.viewmodel

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
}