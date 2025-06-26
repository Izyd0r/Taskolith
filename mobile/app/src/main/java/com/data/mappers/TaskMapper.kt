package com.data.mappers


import com.data.remote.dto.TaskDto
import com.domain.model.Task

fun TaskDto.toDomain(): Task {
    return Task(
        id = this.id,
        title = this.title,
        description = this.description,
        dueDate = this.dueDate,
        isCompleted = this.isCompleted,
        created = this.createdDate
    )
}