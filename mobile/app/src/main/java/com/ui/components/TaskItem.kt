package com.ui.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.IconButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.domain.model.Task
import com.ui.theme.TaskolithTheme
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.UUID

@Composable
fun TaskItem(
    task: Task,
    onSettingsClick: (Task) -> Unit,
    onDeleteClick: (Task) -> Unit,
    onCompleteClick: (Task) -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 8.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceVariant
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier.padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = task.title,
                    style = MaterialTheme.typography.headlineSmall,
                    fontWeight = FontWeight.Bold
                )
                Spacer(modifier = Modifier.weight(1f))
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    IconButton(
                        onClick = { onSettingsClick(task) },
                        colors = IconButtonDefaults.iconButtonColors(
                            containerColor = Color.Black,
                            contentColor = Color.White
                        )
                    ) {
                        Icon(Icons.Default.Settings, contentDescription = "Task Settings")
                    }
                    IconButton(
                        onClick = { onDeleteClick(task) },
                        colors = IconButtonDefaults.iconButtonColors(
                            containerColor = Color(0xFFFA8072),
                            contentColor = Color.White
                        )
                    ) {
                        Icon(Icons.Default.Delete, contentDescription = "Delete Task")
                    }
                }
            }

            Text(
                text = task.description,
                style = MaterialTheme.typography.bodyMedium,
                maxLines = 3,
                overflow = TextOverflow.Ellipsis,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )

            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "To date: ${task.dueDate.formatDate()}",
                    style = MaterialTheme.typography.bodySmall
                )
                Spacer(modifier = Modifier.weight(1f))

                if (!task.isCompleted) {
                    Button(
                        onClick = { onCompleteClick(task) },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = Color.Black,
                            contentColor = Color.White
                        )
                    ) {
                        Text("Complete")
                    }
                }
            }
        }
    }
}

fun String.formatDate(): String {
    return try {
        val parser = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.getDefault())
        val formatter = SimpleDateFormat("dd.MM.yyyy", Locale.getDefault())
        formatter.format(parser.parse(this) ?: Date())
    } catch (e: Exception) {
        this
    }
}


@Preview(showBackground = true)
@Composable
fun TaskItemPreview() {
    TaskolithTheme {
        TaskItem(
            task = Task(
                id = UUID.randomUUID().toString(),
                title = "Title",
                description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse condimentum convallis lorem eu euismod. Lorem ipsum do...",
                dueDate = "2025-06-21T10:00:00",
                isCompleted = false,
                created = "2025-06-21T10:00:00"
            ),
            onSettingsClick = {},
            onDeleteClick = {},
            onCompleteClick = {}
        )
    }
}