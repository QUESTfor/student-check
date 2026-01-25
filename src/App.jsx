import { useState, useEffect, useRef } from 'react'
import { db, studentsRef, ref, update, get, remove, onValue } from './firebase'
import LoginSection from './components/LoginSection'
import StudentCard from './components/StudentCard'
import AdminZone from './components/AdminZone'
import './App.css'

function App() {
  const [currentUserId, setCurrentUserId] = useState(() => {
    return localStorage.getItem('my_student_id')
  })
  const [students, setStudents] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const initialLoadDone = useRef(false)

  useEffect(() => {
    let timeoutId = null

    // Set a timeout to handle cases where Firebase doesn't respond
    timeoutId = setTimeout(() => {
      if (!initialLoadDone.current) {
        console.error('Firebase connection timeout')
        setError('連線逾時，請檢查網路連線後重新載入')
        setLoading(false)
      }
    }, 10000) // 10 second timeout

    const unsubscribe = onValue(
      studentsRef,
      (snapshot) => {
        // Clear timeout since we got a response
        if (timeoutId) {
          clearTimeout(timeoutId)
          timeoutId = null
        }

        const data = snapshot.val()

        // Smart merge strategy: preserve existing data during updates
        // to prevent blank flashes during network operations
        setStudents((prevStudents) => {
          if (data === null) {
            // Only clear if this is not the initial load or if we've confirmed data is truly empty
            if (initialLoadDone.current) {
              return {}
            }
            // For initial load, check if we had cached data
            return prevStudents
          }

          // Merge new data with existing data to prevent blank states
          // New data takes precedence, but we don't lose existing entries during transition
          return { ...prevStudents, ...data }
        })

        // After successful data fetch, clear the entire state to match server
        // This ensures deleted items are removed after merge
        if (data !== null) {
          setStudents(data)
        } else if (initialLoadDone.current) {
          setStudents({})
        }

        setLoading(false)
        setError(null)
        initialLoadDone.current = true
      },
      (err) => {
        // Clear timeout since we got a response (even if error)
        if (timeoutId) {
          clearTimeout(timeoutId)
          timeoutId = null
        }

        console.error('Firebase connection error:', err)
        setError('無法連接到伺服器，請檢查網路連線')
        setLoading(false)
      }
    )

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      unsubscribe()
    }
  }, [])

  const studentCount = Object.keys(students).length

  const handleJoin = async (name) => {
    const snapshot = await get(studentsRef)
    const count = snapshot.exists() ? Object.keys(snapshot.val()).length : 0

    if (count >= 20 && !currentUserId) {
      alert('教室已滿 20 人！')
      return
    }

    const userId = name
    localStorage.setItem('my_student_id', userId)
    setCurrentUserId(userId)

    await update(ref(db, 'students/' + userId), {
      name: name,
      status: '尚未寄出'
    })
  }

  const handleUpdateStatus = async (newStatus) => {
    if (!currentUserId) return
    await update(ref(db, 'students/' + currentUserId), { status: newStatus })
  }

  const handleResetMe = async () => {
    if (!currentUserId) {
      localStorage.removeItem('my_student_id')
      setCurrentUserId(null)
      return
    }

    if (confirm('確定要刪除此玩家並重新登入嗎？')) {
      await remove(ref(db, 'students/' + currentUserId))
      localStorage.removeItem('my_student_id')
      setCurrentUserId(null)
    }
  }

  const handleResetAllStatus = async () => {
    const snapshot = await get(studentsRef)
    if (snapshot.exists()) {
      const studentsData = snapshot.val()
      const updates = {}
      Object.keys(studentsData).forEach((id) => {
        updates[`students/${id}/status`] = '尚未寄出'
      })
      await update(ref(db), updates)
      alert('所有狀態已重置為「尚未寄出」！')
    } else {
      alert('目前沒有任何組別資料。')
    }
  }

  const handleClearAllData = async () => {
    await remove(ref(db, 'students/'))
    alert('所有數據已清空！')
    localStorage.removeItem('my_student_id')
    setCurrentUserId(null)
  }

  return (
    <div className="container">
      {currentUserId && (
        <button className="reset-btn" onClick={handleResetMe}>
          退出 / 更換姓名
        </button>
      )}

      <h2>🎓 學生準備狀態確認表</h2>

      {!currentUserId && (
        <LoginSection studentCount={studentCount} onJoin={handleJoin} />
      )}

      <div className="grid">
        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>載入中...</p>
          </div>
        )}

        {error && !loading && (
          <div className="error-state">
            <p>⚠️ {error}</p>
            <button className="btn btn-join" onClick={() => window.location.reload()}>
              重新載入
            </button>
          </div>
        )}

        {!loading && !error && studentCount === 0 && (
          <div className="empty-state">
            <p>目前沒有學生加入</p>
            <p className="hint">請在上方輸入姓名加入教室</p>
          </div>
        )}

        {!loading && !error && Object.entries(students).map(([id, student]) => (
          <StudentCard
            key={id}
            student={student}
            isMe={id === currentUserId}
            onUpdateStatus={handleUpdateStatus}
          />
        ))}
      </div>

      <AdminZone
        onResetAllStatus={handleResetAllStatus}
        onClearAllData={handleClearAllData}
      />
    </div>
  )
}

export default App
