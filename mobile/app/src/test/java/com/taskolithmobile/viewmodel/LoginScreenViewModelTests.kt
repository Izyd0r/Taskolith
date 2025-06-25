package com.taskolithmobile.viewmodel

import app.cash.turbine.test
import com.ui.viewmodels.LoginScreenViewModel
import kotlinx.coroutines.test.runTest
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Before
import org.junit.Rule
import org.junit.Test

class LoginScreenViewModelTests {

    @get:Rule
    val mainDispatcherRule = MainDispatcherRule()

    private lateinit var viewModel: LoginScreenViewModel

    @Before
    fun setup() {
        viewModel = LoginScreenViewModel()
    }

    @Test
    fun `initial state - all fields are empty and button is disabled`() {
        assert(viewModel.usernameState.value.text.isEmpty())
        assert(viewModel.passwordState.value.text.isEmpty())
        assertFalse("Login button should be disabled initially", viewModel.isLoginEnabled.value)
    }

    @Test
    fun `onUsernameChange - when empty - sets error`() {
        viewModel.onUsernameChange("")
        assertNotNull("Error should be set for empty username", viewModel.usernameState.value.error)
        assertEquals("Username is required", viewModel.usernameState.value.error)
    }

    @Test
    fun `onUsernameChange - when too long - sets error`() {
        val longUsername = "thisusernameistoolongforvalidation"
        viewModel.onUsernameChange(longUsername)
        assertNotNull("Error should be set for long username", viewModel.usernameState.value.error)
        assertEquals("Username must not exceed 20 characters", viewModel.usernameState.value.error)
    }

    @Test
    fun `onUsernameChange - when valid - error is null`() {
        viewModel.onUsernameChange("valid_user")
        assertNull("Error should be null for valid username", viewModel.usernameState.value.error)
    }

    @Test
    fun `onPasswordChange - when empty - sets error`() {
        viewModel.onPasswordChange("")
        assertNotNull("Error should be set for empty password", viewModel.passwordState.value.error)
        assertEquals("Password is required", viewModel.passwordState.value.error)
    }

    @Test
    fun `onPasswordChange - when valid - error is null`() {
        viewModel.onPasswordChange("any_password")
        assertNull("Error should be null for valid password", viewModel.passwordState.value.error)
    }

    @Test
    fun `isLoginEnabled - when all fields are valid - becomes true`() = runTest {
        val viewModel = LoginScreenViewModel()

        viewModel.isLoginEnabled.test {
            assertEquals("Initial state should be false", false, awaitItem())

            viewModel.onUsernameChange("valid_user")
            viewModel.onPasswordChange("any_password")

            assertEquals("State should become true after both fields are valid", true, awaitItem())

            cancelAndIgnoreRemainingEvents()
        }
    }

    @Test
    fun `isLoginEnabled - when one field becomes invalid - becomes false`() = runTest {
        val viewModel = LoginScreenViewModel()

        viewModel.isLoginEnabled.test {
            assertEquals("Initial state should be false", false, awaitItem())

            viewModel.onUsernameChange("valid_user")
            viewModel.onPasswordChange("any_password")

            assertEquals("State should be true after filling all fields", true, awaitItem())

            viewModel.onUsernameChange("")

            assertEquals("State should become false after making username invalid", false, awaitItem())

            cancelAndIgnoreRemainingEvents()
        }
    }

    @Test
    fun `isLoginEnabled - remains false if only username is valid`() = runTest {
        val viewModel = LoginScreenViewModel()

        viewModel.isLoginEnabled.test {
            assertEquals("Initial state should be false", false, awaitItem())

            viewModel.onUsernameChange("valid_user")
            expectNoEvents()

            cancelAndIgnoreRemainingEvents()
        }
    }
}