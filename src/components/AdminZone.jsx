function AdminZone({ onResetAllStatus, onClearAllData }) {
  const handleResetAllStatus = () => {
    const password = prompt('請輸入管理員密碼以重置所有狀態：')
    if (password === 'admin123') {
      if (confirm('這將把所有組別的狀態重置為「尚未寄出」，確定嗎？')) {
        onResetAllStatus()
      }
    } else if (password !== null) {
      alert('密碼錯誤！')
    }
  }

  const handleClearAllData = () => {
    const password = prompt('請輸入管理員密碼以清空所有數據：')
    if (password === 'admin123') {
      if (confirm('警告：這將刪除所有組別的資料，確定嗎？')) {
        onClearAllData()
      }
    } else if (password !== null) {
      alert('密碼錯誤！')
    }
  }

  return (
    <div className="admin-zone">
      <button onClick={handleResetAllStatus} className="btn-admin">
        🔄 重置所有狀態為尚未寄出 (管理員專用)
      </button>
      <button onClick={handleClearAllData} className="btn-admin">
        ⚠ 清除所有姓名 (管理員專用)
      </button>
    </div>
  )
}

export default AdminZone
