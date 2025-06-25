package com.taskolithmobile.viewmodel

import com.ui.viewmodels.RegisterScreenViewModel
import kotlinx.coroutines.test.runTest
import org.junit.Assert.*
import org.junit.Before
import org.junit.Rule
import org.junit.Test
import app.cash.turbine.test

class RegisterScreenViewModelTests {

    @get:Rule
    val mainDispatcherRule = MainDispatcherRule()

    private lateinit var viewModel: RegisterScreenViewModel

    @Before
    fun setup() {
        viewModel = RegisterScreenViewModel()
    }

    @Test
    fun `initial state - all fields are empty and button is disabled`() {
        assert(viewModel.firstNameState.value.text.isEmpty())
        assert(viewModel.lastNameState.value.text.isEmpty())
        assert(viewModel.usernameState.value.text.isEmpty())
        assert(viewModel.emailState.value.text.isEmpty())
        assert(viewModel.passwordState.value.text.isEmpty())
        assert(viewModel.confirmPasswordState.value.text.isEmpty())

        assertFalse("Register button should be disabled initially", viewModel.isRegisterEnabled.value)
    }

    @Test
    fun `onFirstNameChange - when empty - sets error`() {
        viewModel.onFirstNameChange("")
        assertNotNull("Error should be set for empty first name", viewModel.firstNameState.value.error)
        assertEquals("First name is required", viewModel.firstNameState.value.error)
    }

    @Test
    fun `onFirstNameChange - when valid - error is null`() {
        viewModel.onFirstNameChange("John")
        assertNull("Error should be null for valid first name", viewModel.firstNameState.value.error)
    }

    @Test
    fun `onEmailChange - when invalid format - sets error`() {
        viewModel.onEmailChange("invalid-email")
        assertEquals("Email must be a valid format", viewModel.emailState.value.error)
    }

    @Test
    fun `onEmailChange - when valid format - error is null`() {
        viewModel.onEmailChange("test@example.com")
        assertNull(viewModel.emailState.value.error)
    }

    @Test
    fun `onPasswordChange - when too short - sets error`() {
        viewModel.onPasswordChange("Pass1!")
        assertEquals("Password must be at least 8 characters", viewModel.passwordState.value.error)
    }

    @Test
    fun `onPasswordChange - when missing uppercase - sets error`() {
        viewModel.onPasswordChange("password123!")
        assertEquals("Password needs at least one uppercase letter", viewModel.passwordState.value.error)
    }

    @Test
    fun `onPasswordChange - when missing special char - sets error`() {
        viewModel.onPasswordChange("Password123")
        assertEquals("Password needs at least one of (!?*.@)", viewModel.passwordState.value.error)
    }

    @Test
    fun `onPasswordChange - when valid - error is null`() {
        viewModel.onPasswordChange("Password123!")
        assertNull(viewModel.passwordState.value.error)
    }

    @Test
    fun `onConfirmPasswordChange - when passwords do not match - sets error`() {
        viewModel.onPasswordChange("Password123!")
        viewModel.onConfirmPasswordChange("DIFFERENT_PASSWORD")
        assertEquals("Passwords do not match", viewModel.confirmPasswordState.value.error)
    }

    @Test
    fun `onConfirmPasswordChange - when passwords match - error is null`() {
        viewModel.onPasswordChange("Password123!")
        viewModel.onConfirmPasswordChange("Password123!")
        assertNull(viewModel.confirmPasswordState.value.error)
    }

    @Test
    fun `onPasswordChange - after confirm password entered - revalidates confirm password`() {
        viewModel.onPasswordChange("Password123!")
        viewModel.onConfirmPasswordChange("Password123!")
        assertNull("Confirm password should have no error initially", viewModel.confirmPasswordState.value.error)
        viewModel.onPasswordChange("NewPassword456!")
        assertEquals("Passwords do not match", viewModel.confirmPasswordState.value.error)
    }

    @Test
    fun `isRegisterEnabled - when all fields are valid - becomes true`() = runTest {
        val viewModel = RegisterScreenViewModel()

        viewModel.isRegisterEnabled.test {
            assertEquals("Initial state should be false", false, awaitItem())
            viewModel.onFirstNameChange("John")
            viewModel.onLastNameChange("Doe")
            viewModel.onUsernameChange("johndoe")
            viewModel.onEmailChange("john.doe@example.com")
            viewModel.onPasswordChange("Password123!")
            viewModel.onConfirmPasswordChange("Password123!")
            assertEquals("State should become true after all fields are valid", true, awaitItem())
            cancelAndIgnoreRemainingEvents()
        }
    }

    @Test
    fun `isRegisterEnabled - when one field becomes invalid - becomes false`() = runTest {
        val viewModel = RegisterScreenViewModel()
        viewModel.isRegisterEnabled.test {
            assertEquals("Initial state should be false", false, awaitItem())
            viewModel.onFirstNameChange("John")
            viewModel.onLastNameChange("Doe")
            viewModel.onUsernameChange("johndoe")
            viewModel.onEmailChange("john.doe@example.com")
            viewModel.onPasswordChange("Password123!")
            viewModel.onConfirmPasswordChange("Password123!")
            assertEquals("State should be true after filling all fields", true, awaitItem())
            viewModel.onEmailChange("invalid-email")
            assertEquals("State should become false after making email invalid", false, awaitItem())
            cancelAndIgnoreRemainingEvents()
        }
    }
}