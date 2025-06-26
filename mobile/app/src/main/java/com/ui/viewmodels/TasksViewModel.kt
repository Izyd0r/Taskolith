package com.ui.viewmodels

import android.util.Log
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.List
import androidx.compose.material.icons.filled.AccountCircle
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.data.remote.dto.CreateTaskRequest
import com.data.remote.dto.UpdateTaskRequest
import com.di.MainDispatcher
import com.domain.model.Task
import com.domain.repository.SessionRepository
import com.domain.repository.TasksRepository
import com.example.taskolithmobile.R
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.CoroutineDispatcher
import com.utils.toIsoDateString
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import javax.inject.Inject

sealed class BottomNavItem(val route: String, val titleResId: Int, val icon: ImageVector) {
    data object Tasks : BottomNavItem("tasks", R.string.bottom_nav_tasks, Icons.AutoMirrored.Filled.List)
    data object Profile : BottomNavItem("profile", R.string.bottom_nav_profile, Icons.Default.AccountCircle)
}

@HiltViewModel
class TasksViewModel @Inject constructor(
    private val tasksRepository: TasksRepository,
    private val sessionRepository: SessionRepository,
    @MainDispatcher private val dispatcher: CoroutineDispatcher
) : ViewModel() {

   val tasksState: StateFlow<List<Task>> = tasksRepository.observeTasks()
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )

    private val _errorState = MutableStateFlow<String?>(null)
    val errorState = _errorState.asStateFlow()

    init {
        refreshTasks()
    }

    fun addTask(title: String, description: String, dueDate: String) {
        viewModelScope.launch(dispatcher) {
            try {
                _errorState.value = null
                val token = sessionRepository.getAccessToken() ?: return@launch
                val formatedDate = dueDate.toIsoDateString()
                val request = CreateTaskRequest(title, description, formatedDate)
                val response = tasksRepository.createTask(token, request)
                Log.d("TasksViewModel", "Task created successfully: $response")
                refreshTasks()
            } catch (e: Exception) {
                _errorState.value = "Failed to add task: ${e.message}"
                Log.d("TasksViewModel","Failed to add task: ${e.message}")
            }
        }
        refreshTasks()
    }

    fun refreshTasks() {
        viewModelScope.launch(dispatcher) {
            try {
                val token = sessionRepository.getAccessToken() ?: return@launch
                tasksRepository.refreshTasks(token)
            } catch (e: Exception) {
                Log.e("TasksViewModel", "Failed to refresh tasks: ${e.message}")
                _errorState.value = "Failed to refresh tasks."
            }
        }
    }

    fun onDeleteClick(task: Task) {
        viewModelScope.launch(dispatcher) {
            try {
                val token = sessionRepository.getAccessToken() ?: return@launch
                Log.d("TasksViewModel", "Deleting task with id: ${task.id}")
                tasksRepository.deleteTask(token, task.id)
            } catch (e: Exception) {
                Log.e("TasksViewModel", "Failed to delete task: ${e.message}")
                _errorState.value = "Failed to delete task."
            }
        }
        refreshTasks()
    }

    fun onCompleteClick(task: Task) {
        viewModelScope.launch(dispatcher) {
            try {
                val token = sessionRepository.getAccessToken() ?: return@launch
                val request = UpdateTaskRequest(
                    taskId = task.id,
                    title = null,
                    description = null,
                    dueDate = null,
                    isCompleted = true
                )
                tasksRepository.updateTask(token, request)
            } catch (e: Exception) {
                Log.e("TasksViewModel", "Failed to complete task: ${e.message}")
                _errorState.value = "Failed to complete task."
            }
        }
        refreshTasks()
    }

}