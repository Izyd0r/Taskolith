package com.ui.viewmodels
import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.data.remote.dto.LoginRequest
import com.data.remote.dto.RegisterRequest
import com.di.MainDispatcher
import com.domain.repository.AuthRepository
import com.domain.repository.SessionRepository
import com.ui.state.LoginUiState
import com.ui.state.TextFieldState
import dagger.hilt.android.lifecycle.HiltViewModel
import jakarta.inject.Inject
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

@HiltViewModel
class LoginScreenViewModel @Inject constructor(
    private val authRepository: AuthRepository,
    private val sessionRepository: SessionRepository,
    @MainDispatcher private val dispatcher: CoroutineDispatcher
) : ViewModel() {

    private val _usernameState = MutableStateFlow(TextFieldState())
    val usernameState: StateFlow<TextFieldState> = _usernameState.asStateFlow()

    private val _passwordState = MutableStateFlow(TextFieldState())
    val passwordState: StateFlow<TextFieldState> = _passwordState.asStateFlow()

    private val _loginUiState = MutableStateFlow<LoginUiState>(LoginUiState.Idle)
    val loginUiState: StateFlow<LoginUiState> = _loginUiState.asStateFlow()

    val isLoginEnabled: StateFlow<Boolean> = combine(
        _usernameState, _passwordState
    ) { username, password ->
        val isUsernameValid = username.text.isNotBlank() && username.error == null
        val isPasswordValid = password.text.isNotBlank() && password.error == null
        isUsernameValid && isPasswordValid
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), false)

    fun onUsernameChange(text: String) {
        val error = if (text.isEmpty()) "Username is required"
        else if (text.length > 20) "Username must not exceed 20 characters"
        else null
        _usernameState.value = TextFieldState(text, error)
    }

    fun onPasswordChange(text: String) {
        val error = if (text.isEmpty()) "Password is required" else null
        _passwordState.value = TextFieldState(text, error)
    }

    fun onLoginClick() {
        if (_loginUiState.value == LoginUiState.Loading) return

        val request = LoginRequest(
            username = _usernameState.value.text,
            password = _passwordState.value.text
        )

        viewModelScope.launch(dispatcher) {
            _loginUiState.value = LoginUiState.Loading

            try {
                val response = authRepository.loginUser(request)
                sessionRepository.saveToken(response.token)
                _loginUiState.value = LoginUiState.Success
                Log.d("Register", "Success your JWT is: ${response.token}")
            } catch (e: Exception) {
                _loginUiState.value = LoginUiState.Error(e.message)
                Log.e("Register", "Error: ${e.message}")
            }
        }
    }
}