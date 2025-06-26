package com.taskolithmobile.integration

import kotlinx.coroutines.test.StandardTestDispatcher
import kotlinx.coroutines.test.TestDispatcher

object SharedTestDispatchers {
    val testDispatcher: TestDispatcher = StandardTestDispatcher()
}