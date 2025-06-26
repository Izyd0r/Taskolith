package com.ui.viewmodels

import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.data.remote.dto.RegisterRequest
import com.data.repository.SessionHandler
import com.di.MainDispatcher
import com.domain.repository.AuthRepository
import com.domain.repository.SessionRepository
import com.ui.state.RegisterUiState
import com.ui.state.TextFieldState
import dagger.hilt.android.lifecycle.HiltViewModel
import jakarta.inject.Inject
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

@HiltViewModel
class RegisterScreenViewModel @Inject constructor(
    private val authRepository: AuthRepository,
    private val sessionHandler: SessionHandler,
    @MainDispatcher private val dispatcher: CoroutineDispatcher
) : ViewModel() {

    private val _firstNameState = MutableStateFlow(TextFieldState())
    val firstNameState: StateFlow<TextFieldState> = _firstNameState.asStateFlow()

    private val _lastNameState = MutableStateFlow(TextFieldState())
    val lastNameState: StateFlow<TextFieldState> = _lastNameState.asStateFlow()

    private val _usernameState = MutableStateFlow(TextFieldState())
    val usernameState: StateFlow<TextFieldState> = _usernameState.asStateFlow()

    private val _emailState = MutableStateFlow(TextFieldState())
    val emailState: StateFlow<TextFieldState> = _emailState.asStateFlow()

    private val _passwordState = MutableStateFlow(TextFieldState())
    val passwordState: StateFlow<TextFieldState> = _passwordState.asStateFlow()

    private val _confirmPasswordState = MutableStateFlow(TextFieldState())
    val confirmPasswordState: StateFlow<TextFieldState> = _confirmPasswordState.asStateFlow()

    private val _registerUiState = MutableStateFlow<RegisterUiState>(RegisterUiState.Idle)
    val registerUiState: StateFlow<RegisterUiState> = _registerUiState.asStateFlow()

    private val firstFiveFieldsFlow = combine(
        _firstNameState, _lastNameState, _usernameState, _emailState, _passwordState
    ) { fName, lName, uName, email, pass ->
        listOf(fName, lName, uName, email, pass)
    }

    val isRegisterEnabled: StateFlow<Boolean> = combine(
        firstFiveFieldsFlow, _confirmPasswordState
    ) { firstFiveStates, confirmPassState ->
        val firstFiveAreValid = firstFiveStates.all { it.text.isNotBlank() && it.error == null }
        val confirmPassIsValid = confirmPassState.text.isNotBlank() && confirmPassState.error == null
        firstFiveAreValid && confirmPassIsValid
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.Lazily,
        initialValue = false
    )

    fun onFirstNameChange(text: String) {
        val error = if (text.isEmpty()) "First name is required"
        else if (text.length > 20) "First name must not exceed 20 characters"
        else null
        _firstNameState.value = TextFieldState(text, error)
    }

    fun onLastNameChange(text: String) {
        val error = if (text.isEmpty()) "Last name is required"
        else if (text.length > 20) "Last name must not exceed 20 characters"
        else null
        _lastNameState.value = TextFieldState(text, error)
    }

    fun onUsernameChange(text: String) {
        val error = if (text.isEmpty()) "Username is required"
        else if (text.length > 20) "Username must not exceed 20 characters"
        else null
        _usernameState.value = TextFieldState(text, error)
    }

    fun onEmailChange(text: String) {
        val emailRegex = """^(?!.*\.\.)(?!\.)(?!.*\.${'$'})[a-zA-Z0-9]+([._+-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$""".toRegex()
        val error = if (text.isEmpty()) "Email is required"
        else if (text.length > 256) "Email is too long"
        else if (!emailRegex.matches(text)) "Email must be a valid format"
        else null
        _emailState.value = TextFieldState(text, error)
    }

    fun onPasswordChange(text: String) {
        val error = when {
            text.isEmpty() -> "Password is required"
            text.length < 8 -> "Password must be at least 8 characters"
            text.length > 100 -> "Password must not exceed 100 characters"
            !text.any { it.isUpperCase() } -> "Password needs at least one uppercase letter"
            !text.any { it.isLowerCase() } -> "Password needs at least one lowercase letter"
            !text.any { it.isDigit() } -> "Password needs at least one number"
            !text.any { it in "!?.@*" } -> "Password needs at least one of (!?*.@)"
            else -> null
        }
        _passwordState.value = TextFieldState(text, error)

        if (_confirmPasswordState.value.text.isNotEmpty()) {
            onConfirmPasswordChange(_confirmPasswordState.value.text)
        }
    }

    fun onConfirmPasswordChange(text: String) {
        val error = when {
            text.isEmpty() -> "Confirm password is required"
            text != _passwordState.value.text -> "Passwords do not match"
            else -> null
        }
        _confirmPasswordState.value = TextFieldState(text, error)
    }

    fun onRegisterClick() {
        if (_registerUiState.value == RegisterUiState.Loading) return

        val request = RegisterRequest(
            firstName = _firstNameState.value.text,
            lastName = _lastNameState.value.text,
            username = _usernameState.value.text,
            email = _emailState.value.text,
            password = _passwordState.value.text
        )

        viewModelScope.launch(dispatcher) {
            _registerUiState.value = RegisterUiState.Loading

            try {
                sessionHandler.logoutOrSwitchUser()
                val response = authRepository.registerUser(request)
                sessionHandler.sessionRepository.saveToken(response.token)
                _registerUiState.value = RegisterUiState.Success
                Log.d("RegisterVM", "Success and token saved: ${response.token}")

            } catch (e: Exception) {
                _registerUiState.value = RegisterUiState.Error(e.message)
                Log.e("RegisterVM", "Error: ${e.message}")
            }
        }
    }
}