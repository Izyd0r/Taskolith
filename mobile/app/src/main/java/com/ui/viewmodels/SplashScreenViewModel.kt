package com.ui.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.di.MainDispatcher
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class SplashScreenViewModel @Inject constructor(
    @MainDispatcher private val dispatcher: CoroutineDispatcher
) : ViewModel() {

    private val _isSplashDone = MutableStateFlow(false)
    val isSplashDone: StateFlow<Boolean> = _isSplashDone

    init {
        viewModelScope.launch(dispatcher) {
            delay(2000)
            _isSplashDone.value = true
        }
    }
}