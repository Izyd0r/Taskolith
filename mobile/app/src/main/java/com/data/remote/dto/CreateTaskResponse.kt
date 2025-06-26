package com.data.remote.dto

data class CreateTaskResponse(
    val userId: String,
    val taskId: String,
    val title: String,
    val description: String,
    val dueDate: String,
    val created: String,
    val completed: Boolean
)