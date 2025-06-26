package com.ui.viewmodels

import android.util.Log
import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.data.remote.dto.UpdateTaskRequest
import com.di.MainDispatcher
import com.domain.model.Task
import com.domain.repository.SessionRepository
import com.domain.repository.TasksRepository
import com.ui.components.formatDate
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import com.ui.state.EditTaskUiState
import com.utils.toIsoDateString
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class EditTaskViewModel @Inject constructor(
    private val tasksRepository: TasksRepository,
    private val sessionRepository: SessionRepository,
    @MainDispatcher private val dispatcher: CoroutineDispatcher,
    savedStateHandle: SavedStateHandle
) : ViewModel() {

    private val taskId: String = savedStateHandle.get<String>("taskId")!!

    private val _uiState = MutableStateFlow(EditTaskUiState())
    val uiState = _uiState.asStateFlow()

    init {
        loadTaskDetails()
    }

    private fun loadTaskDetails() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true) }
            val task = tasksRepository.getTaskById(taskId)
            if (task != null) {
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        title = task.title,
                        description = task.description,
                        dueDate = task.dueDate.formatDate()
                    )
                }
            } else {
                _uiState.update { it.copy(isLoading = false, error = "Task not found.") }
            }
        }
    }

    fun onTitleChange(newTitle: String) {
        _uiState.update { it.copy(title = newTitle) }
    }

    fun onDescriptionChange(newDescription: String) {
        _uiState.update { it.copy(description = newDescription) }
    }

    fun onDateChange(newDate: String) {
        _uiState.update { it.copy(dueDate = newDate) }
    }

    fun applyChanges() {
        viewModelScope.launch(dispatcher) {
            _uiState.update { it.copy(isLoading = true, error = null) }
            val token = sessionRepository.getAccessToken() ?: return@launch

            try {
                val parsedDate = (_uiState.value.dueDate).toIsoDateString()

                val request = UpdateTaskRequest(
                    taskId = taskId,
                    title = _uiState.value.title,
                    description = _uiState.value.description,
                    dueDate = parsedDate,
                    isCompleted = null
                )
                Log.d("EditTaskViewModel", "Sending update: $request")
                tasksRepository.updateTask(token, request)
                _uiState.update { it.copy(isLoading = false, updateSuccess = true) }

            } catch (e: Exception) {
                _uiState.update { it.copy(isLoading = false, error = "Failed to update task.") }
            }
        }
    }

    fun onDeleteClick() {
        val task = _uiState.value.taskId ?: return

        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            val token = sessionRepository.getAccessToken() ?: return@launch
            try {
                tasksRepository.deleteTask(token, taskId)
                _uiState.update { it.copy(isLoading = false, updateSuccess = true) }
            } catch (e: Exception) {
                Log.e("EditTaskViewModel", "Error deleting task: ${e.message}")
                _uiState.update { it.copy(isLoading = false, error = "Failed to delete task.") }
            }
        }
    }
}