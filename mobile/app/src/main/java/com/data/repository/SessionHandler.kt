package com.data.repository

import com.data.local.TaskDao
import com.domain.repository.SessionRepository
import javax.inject.Inject

class SessionHandler @Inject constructor(
    val sessionRepository: SessionRepository,
    private val taskDao: TaskDao
) {
    suspend fun logoutOrSwitchUser() {
        sessionRepository.clearToken()
        taskDao.clearAll()
    }
}