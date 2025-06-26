package com.ui.viewmodels

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.List
import androidx.compose.material.icons.filled.AccountCircle
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.List
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.lifecycle.ViewModel
import com.di.MainDispatcher
import com.domain.repository.SessionRepository
import com.example.taskolithmobile.R
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import javax.inject.Inject

sealed class BottomNavItem(val route: String, val titleResId: Int, val icon: ImageVector) {
    data object Tasks : BottomNavItem("tasks", R.string.bottom_nav_tasks, Icons.AutoMirrored.Filled.List)
    data object Profile : BottomNavItem("profile", R.string.bottom_nav_profile, Icons.Default.AccountCircle)
}

@HiltViewModel
class TasksScreenViewModel @Inject constructor(
    private val sessionRepository: SessionRepository,
    @MainDispatcher private val dispatcher: CoroutineDispatcher
) : ViewModel() {

    private val _selectedTab = MutableStateFlow<BottomNavItem>(BottomNavItem.Tasks)
    val selectedTab = _selectedTab.asStateFlow()

    fun onTabSelected(tab: BottomNavItem) {
        _selectedTab.value = tab
    }
}