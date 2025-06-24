package com.ui.screens

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.navigation.NavController

@Composable
fun RegisterScreen(
    navController: NavController
) {
    Box(modifier = Modifier.fillMaxSize().testTag("RegisterScreen")) {
        Text("Register")
    }
}