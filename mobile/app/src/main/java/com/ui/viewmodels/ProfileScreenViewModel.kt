package com.ui.viewmodels

import androidx.lifecycle.ViewModel
import com.di.MainDispatcher
import com.domain.repository.SessionRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import javax.inject.Inject

@HiltViewModel
class ProfileScreenViewModel @Inject constructor(
    private val sessionRepository: SessionRepository,
    @MainDispatcher private val dispatcher: CoroutineDispatcher
) : ViewModel() {

    private val _selectedTab = MutableStateFlow<BottomNavItem>(BottomNavItem.Tasks)
    val selectedTab = _selectedTab.asStateFlow()

    fun onTabSelected(tab: BottomNavItem) {
        _selectedTab.value = tab
    }
}