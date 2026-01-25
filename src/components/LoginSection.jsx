import { useState } from 'react'

function LoginSection({ studentCount, onJoin }) {
  const [name, setName] = useState('')

  const handleJoin = () => {
    if (!name.trim()) {
      alert('請輸入姓名！')
      return
    }
    onJoin(name.trim())
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleJoin()
    }
  }

  return (
    <div className="login-box">
      <p>請輸入您的組別或姓名以加入：</p>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="例如：第一組"
        maxLength={10}
      />
      <button onClick={handleJoin} className="btn btn-join">
        進入教室
      </button>
      <p className="room-status">目前進度：{studentCount} / 20 組</p>
    </div>
  )
}

export default LoginSection
