package com.taskolithmobile.viewmodel

import com.domain.repository.SessionRepository

class FakeSessionRepository : SessionRepository {
    override fun saveToken(accessToken: String) {
        TODO("Not yet implemented")
    }

    override fun getAccessToken(): String? {
        TODO("Not yet implemented")
    }

    override fun clearToken() {
        TODO("Not yet implemented")
    }
}