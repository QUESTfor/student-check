function StudentCard({ student, isMe, onUpdateStatus }) {
  const isSent = student.status === '已寄出'

  return (
    <div className={`card ${isMe ? 'active' : ''}`}>
      <strong>
        {student.name} {isMe && '(我)'}
      </strong>
      <br />
      <span className={`status-tag ${isSent ? 'sent' : 'waiting'}`}>
        {student.status}
      </span>
      {isMe && (
        <div className="action-buttons">
          <button
            onClick={() => onUpdateStatus('已寄出')}
            className="btn btn-send"
          >
            已寄出
          </button>
          <button
            onClick={() => onUpdateStatus('尚未寄出')}
            className="btn btn-cancel"
          >
            尚未寄出
          </button>
        </div>
      )}
    </div>
  )
}

export default StudentCard
