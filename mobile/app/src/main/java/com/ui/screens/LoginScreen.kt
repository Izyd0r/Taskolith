package com.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import androidx.navigation.compose.rememberNavController
import com.ui.components.AppButton
import com.ui.components.AppTextField
import com.ui.navigation.Screen
import com.ui.state.LoginUiState
import com.ui.state.RegisterUiState
import com.ui.theme.Satoshi
import com.ui.theme.TaskolithTheme
import com.ui.viewmodels.LoginScreenViewModel

@Composable
fun LoginScreen(
    navController: NavController,
    viewModel: LoginScreenViewModel = hiltViewModel()
) {
    val usernameState by viewModel.usernameState.collectAsState()
    val passwordState by viewModel.passwordState.collectAsState()
    val isButtonEnabled by viewModel.isLoginEnabled.collectAsState()
    val loginUiState by viewModel.loginUiState.collectAsState()

    val scrollState = rememberScrollState()

    LaunchedEffect(key1 = loginUiState) {
        when (val state = loginUiState) {
            is LoginUiState.Success -> {
                navController.navigate(Screen.Main.route) {
                    popUpTo(Screen.Auth.route) { inclusive = true }
                }
            }
            is LoginUiState.Error -> {
                /*TODO: ADD SNACK BAR OR SOMETHING ELSE*/
            }
            else -> { /* Do nothing for Idle or Loading */ }
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .testTag("LoginScreen")
            .verticalScroll(scrollState)
            .padding(horizontal = 24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "Log In",
            style = MaterialTheme.typography.headlineLarge.copy(
                fontFamily = Satoshi,
                fontWeight = FontWeight.Black,
                fontSize = 70.sp
            ),
            textAlign = TextAlign.Center,
            modifier = Modifier.padding(top = 40.dp)
        )

        Spacer(modifier = Modifier.height(8.dp))

        HorizontalDivider(
            modifier = Modifier.fillMaxWidth(),
            thickness = 2.dp,
            color = MaterialTheme.colorScheme.onSurface
        )

        Spacer(modifier = Modifier.height(24.dp))

        AppTextField(
            value = usernameState.text,
            onValueChange = viewModel::onUsernameChange,
            label = "Username",
            isError = usernameState.error != null,
            errorMessage = usernameState.error
        )
        Spacer(modifier = Modifier.height(16.dp))

        AppTextField(
            value = passwordState.text,
            onValueChange = viewModel::onPasswordChange,
            label = "Password",
            isError = passwordState.error != null,
            errorMessage = passwordState.error,
            isPassword = true
        )
        Spacer(modifier = Modifier.height(60.dp))

        AppButton(
            text = "Login",
            onClick = viewModel::onLoginClick,
            enabled = isButtonEnabled
        )
    }
}

@Preview(
    showBackground = true,
    showSystemUi = true,
    device = "spec:width=411dp,height=891dp,dpi=420"
)
@Composable
fun LoginScreenPreview() {
    TaskolithTheme {
        LoginScreen(navController = rememberNavController())
    }
}