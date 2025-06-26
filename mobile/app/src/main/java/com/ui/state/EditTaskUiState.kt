package com.ui.state

data class EditTaskUiState(
    val title: String = "",
    val description: String = "",
    val dueDate: String = "",
    val isLoading: Boolean = false,
    val error: String? = null,
    val updateSuccess: Boolean = false,
    val taskId: String = ""
)
