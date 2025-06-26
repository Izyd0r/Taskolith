package com.data.repository

import android.util.Log
import com.data.local.TaskDao
import com.data.mappers.toDomain
import com.data.remote.api.TasksApiService
import com.data.remote.dto.CreateTaskRequest
import com.data.remote.dto.CreateTaskResponse
import com.data.remote.dto.UpdateTaskRequest
import com.domain.model.Task
import com.domain.repository.TasksRepository
import com.utils.toIsoDateString
import kotlinx.coroutines.flow.Flow
import javax.inject.Inject

class TasksRepositoryImpl @Inject constructor(
    private val apiService: TasksApiService,
    private val taskDao: TaskDao
) : TasksRepository {

    override fun observeTasks(): Flow<List<Task>> {
        return taskDao.observeAllTasks()
    }

    override suspend fun refreshTasks(token: String) {
        try {
            val remoteTasks = apiService.getTasks("Bearer $token").tasks.map { it.toDomain() }
            taskDao.upsertAll(remoteTasks)
        } catch (e: Exception) {
            throw e
        }
    }

    override suspend fun getTaskById(taskId: String): Task? {
        return taskDao.getTaskById(taskId)
    }

    override suspend fun updateTask(token: String, request: UpdateTaskRequest) {
        apiService.updateTask("Bearer $token", request)
        refreshTasks(token)
    }

    override suspend fun deleteTask(token: String, taskId: String) {
        Log.d("TaskRepo", "Deleting remote task with id: $taskId")
        apiService.deleteTask("Bearer $token", taskId)
        Log.d("TaskRepo", "Remote task deleted. Deleting locally.")
        taskDao.deleteTaskById(taskId)
        Log.d("TaskRepo", "Local task deleted.")
        refreshTasks(token)
    }

    override suspend fun createTask(token: String, request: CreateTaskRequest): CreateTaskResponse {
        try {
            val response = apiService.createTask("Bearer $token", request)

            val task = Task(
                id = response.taskId,
                title = response.title,
                description = response.description,
                dueDate = response.dueDate.toIsoDateString(),
                isCompleted = response.completed,
                created = response.created.toIsoDateString()
            )

            Log.d("TaskRepo", "Attempting to upsert task: ${task.id}")
            taskDao.upsert(task)
            Log.d("TaskRepo", "Upsert complete")
            return response
        } catch (e: Exception) {
            throw e
        }
    }
}