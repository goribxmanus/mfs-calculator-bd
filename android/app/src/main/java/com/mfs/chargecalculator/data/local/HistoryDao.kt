package com.mfs.chargecalculator.data.local

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Transaction
import kotlinx.coroutines.flow.Flow

@Dao
interface HistoryDao {

    @Query("SELECT * FROM calculation_history ORDER BY timestamp DESC LIMIT 100")
    fun getRecentHistory(): Flow<List<HistoryEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(entity: HistoryEntity): Long

    @Query("DELETE FROM calculation_history WHERE id NOT IN (SELECT id FROM calculation_history ORDER BY timestamp DESC LIMIT 100)")
    suspend fun trimOldRecords()

    @Transaction
    suspend fun insertAndTrim(entity: HistoryEntity) {
        insert(entity)
        trimOldRecords()
    }

    @Query("DELETE FROM calculation_history")
    suspend fun clearAll()
}
