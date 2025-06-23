package com.ui.screens

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.offset
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.ui.theme.Satoshi
import com.ui.viewmodels.SplashScreenViewModel
import androidx.compose.ui.Alignment
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.ui.navigation.Screen


@Composable
fun SplashScreen(
    navController: NavController,
    splashViewModel: SplashScreenViewModel = viewModel()
) {
    val isDone by splashViewModel.isSplashDone.collectAsState()

    LaunchedEffect(isDone) {
        if(isDone) {
            navController.navigate(Screen.Auth.route)
        }
    }

    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    )
    {
        Text(
            text = "Taskolith",
            modifier = Modifier
                .testTag("appName")
                .offset(y = (-100).dp),
            style = MaterialTheme.typography.displayLarge,
            fontFamily = Satoshi,
            fontWeight = FontWeight.Black,
            fontSize = 86.sp
        )
    }
}