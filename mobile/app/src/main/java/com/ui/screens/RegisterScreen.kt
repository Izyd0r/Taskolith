package com.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import com.ui.viewmodels.RegisterScreenViewModel
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.compose.rememberNavController
import com.ui.components.AppButton
import com.ui.components.AppTextField
import com.ui.theme.Satoshi
import com.ui.theme.TaskolithTheme

@Composable
fun RegisterScreen(
    navController: NavController,
    viewModel: RegisterScreenViewModel = hiltViewModel()
) {
    val firstNameState by viewModel.firstNameState.collectAsState()
    val lastNameState by viewModel.lastNameState.collectAsState()
    val usernameState by viewModel.usernameState.collectAsState()
    val emailState by viewModel.emailState.collectAsState()
    val passwordState by viewModel.passwordState.collectAsState()
    val confirmPasswordState by viewModel.confirmPasswordState.collectAsState()
    val isButtonEnabled by viewModel.isRegisterEnabled.collectAsState()

    val scrollState = rememberScrollState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .testTag("RegisterScreen")
            .verticalScroll(scrollState)
            .padding(horizontal = 24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "Sign Up",
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
            value = firstNameState.text,
            onValueChange = viewModel::onFirstNameChange,
            label = "First Name",
            isError = firstNameState.error != null,
            errorMessage = firstNameState.error
        )
        Spacer(modifier = Modifier.height(16.dp))

        AppTextField(
            value = lastNameState.text,
            onValueChange = viewModel::onLastNameChange,
            label = "Last Name",
            isError = lastNameState.error != null,
            errorMessage = lastNameState.error
        )
        Spacer(modifier = Modifier.height(16.dp))

        AppTextField(
            value = usernameState.text,
            onValueChange = viewModel::onUsernameChange,
            label = "Username",
            isError = usernameState.error != null,
            errorMessage = usernameState.error
        )
        Spacer(modifier = Modifier.height(16.dp))

        AppTextField(
            value = emailState.text,
            onValueChange = viewModel::onEmailChange,
            label = "Email",
            isError = emailState.error != null,
            errorMessage = emailState.error
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
        Spacer(modifier = Modifier.height(16.dp))

        AppTextField(
            value = confirmPasswordState.text,
            onValueChange = viewModel::onConfirmPasswordChange,
            label = "Confirm Password",
            isError = confirmPasswordState.error != null,
            errorMessage = confirmPasswordState.error,
            isPassword = true
        )
        Spacer(modifier = Modifier.height(60.dp))

        AppButton(
            text = "Register",
            onClick = viewModel::onRegisterClick,
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
fun RegisterScreenPreview() {
    TaskolithTheme {
        RegisterScreen(navController = rememberNavController())
    }
}