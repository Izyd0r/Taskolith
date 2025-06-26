package com.ui.screens

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.Divider
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavController
import androidx.navigation.compose.rememberNavController
import com.ui.components.BottomNavBar
import com.ui.theme.Satoshi
import com.ui.theme.TaskolithTheme
import com.ui.viewmodels.BottomNavItem
import com.ui.viewmodels.TasksScreenViewModel

@Composable
fun TasksScreen(
    navController: NavController,
    viewModel: TasksScreenViewModel = hiltViewModel()
) {
    Column(
        modifier = Modifier.fillMaxSize()
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "My Tasks",
                style = MaterialTheme.typography.headlineLarge.copy(
                    fontFamily = Satoshi,
                    fontWeight = FontWeight.Bold
                ),
                fontWeight = FontWeight.Bold
            )

            Spacer(modifier = Modifier.weight(1f))

            IconButton(onClick = { /* TODO: Handle add task click */ }) {
                Icon(
                    imageVector = Icons.Default.Add,
                    contentDescription = "Add new task"
                )
            }
        }

        HorizontalDivider()

        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            contentAlignment = Alignment.Center
        ) {
            Text(text = "Your tasks will appear here.")
        }
    }
}


@Preview(showBackground = true, showSystemUi = true)
@Composable
fun TasksScreenPreview() {
    TaskolithTheme {
        TasksScreen(navController = rememberNavController())
    }
}