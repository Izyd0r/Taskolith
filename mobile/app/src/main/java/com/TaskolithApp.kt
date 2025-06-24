package com

import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.navigation.compose.rememberNavController
import com.ui.navigation.NavGraph
import com.ui.screens.SplashScreen
import com.ui.theme.TaskolithTheme
import kotlinx.serialization.Serializable
import kotlinx.serialization.Serializer

@Preview(showBackground = true)
@Composable
fun TaskolithApp() {
    val navController = rememberNavController()
    TaskolithTheme {
        Surface(
            modifier = Modifier.fillMaxSize(),
            color = MaterialTheme.colorScheme.background
        ) {
            NavGraph(navController = navController)
        }
    }
}