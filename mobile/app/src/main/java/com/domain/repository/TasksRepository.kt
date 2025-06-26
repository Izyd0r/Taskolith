package com.domain.repository

import com.data.remote.dto.CreateTaskRequest
import com.data.remote.dto.CreateTaskResponse
import com.data.remote.dto.UpdateTaskRequest
import com.domain.model.Task
import kotlinx.coroutines.flow.Flow

interface TasksRepository {

    suspend fun createTask(token: String, request: CreateTaskRequest): CreateTaskResponse

    /**
     * Observes the list of tasks from the local database.
     * The returned Flow will automatically emit a new list whenever the data changes.
     */
    fun observeTasks(): Flow<List<Task>>

    /**
     * Fetches the latest tasks from the remote API and updates the local database.
     */
    suspend fun refreshTasks(token: String)

    /**
     * Fetches a single task by its ID directly from the local database.
     */
    suspend fun getTaskById(taskId: String): Task?

    /**
     * Updates a task by calling the remote API and then refreshing the local data.
     */
    suspend fun updateTask(token: String, request: UpdateTaskRequest)

    /**
     * Deletes a task by calling the remote API and then removing it from the local database.
     */
    suspend fun deleteTask(token: String, taskId: String)
}