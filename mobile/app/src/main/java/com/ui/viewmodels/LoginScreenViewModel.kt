package com.ui.viewmodels
import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.data.remote.dto.LoginRequest
import com.data.remote.dto.RegisterRequest
import com.di.MainDispatcher
import com.domain.repository.AuthRepository
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
    @MainDispatcher private val dispatcher: CoroutineDispatcher
) : ViewModel() {

    private val _usernameState = MutableStateFlow(TextFieldState())
    val usernameState: StateFlow<TextFieldState> = _usernameState.asStateFlow()

    private val _passwordState = MutableStateFlow(TextFieldState())
    val passwordState: StateFlow<TextFieldState> = _passwordState.asStateFlow()

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
        val request = LoginRequest(
            username = _usernameState.value.text,
            password = _passwordState.value.text
        )

        viewModelScope.launch(dispatcher) {
            try {
                val response = authRepository.loginUser(request)
                Log.d("Register", "Success your JWT is: ${response.token}")
            } catch (e: Exception) {
                Log.e("Register", "Error: ${e.message}")
            }
        }
    }
}