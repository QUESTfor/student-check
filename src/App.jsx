import { useState, useEffect } from 'react'
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

  useEffect(() => {
    const unsubscribe = onValue(studentsRef, (snapshot) => {
      const data = snapshot.val()
      setStudents(data || {})
    })

    return () => unsubscribe()
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
        {Object.entries(students).map(([id, student]) => (
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
