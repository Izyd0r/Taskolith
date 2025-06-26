package com.data.repository

import android.content.Context
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey
import com.domain.repository.SessionRepository
import java.io.IOException
import java.security.GeneralSecurityException

// TODO: CHANGE TOKEN SAVING MECHANISM SO IT WILL NO LONGER USE DEPRECATED LIBRARIES AND USE REFRESH TOKEN
// for now it takes one token and doesn't refresh
class SessionManagerImpl(context: Context) : SessionRepository {

    companion object {
        private const val FILENAME = "session_prefs"
        private const val KEY_ACCESS_TOKEN = "ACCESS_TOKEN" // TODO: CREATE NEW KEY AND HIDE IT
    }

    private val masterKey = try {
        MasterKey.Builder(context)
            .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
            .build()
    } catch (e: GeneralSecurityException) {
        throw RuntimeException("Failed to create MasterKey", e)
    } catch (e: IOException) {
        throw RuntimeException("Failed to create MasterKey", e)
    }

    private val sharedPreferences = try {
        EncryptedSharedPreferences.create(
            context,
            FILENAME,
            masterKey,
            EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
            EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
        )
    } catch (e: GeneralSecurityException) {
        throw RuntimeException("Failed to create EncryptedSharedPreferences", e)
    } catch (e: IOException) {
        throw RuntimeException("Failed to create EncryptedSharedPreferences", e)
    }


    override fun saveToken(accessToken: String) {
        sharedPreferences.edit()
            .putString(KEY_ACCESS_TOKEN, accessToken)
            .apply()
    }

    override fun getAccessToken(): String? {
        return sharedPreferences.getString(KEY_ACCESS_TOKEN, null)
    }

    override fun clearToken() {
        sharedPreferences.edit()
            .clear()
            .apply()
    }
}