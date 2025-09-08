const StatsCard = ({ label, value, icon: Icon, color }) => {
  return (
    <div className="bg-surface rounded-lg p-4 shadow-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-text-secondary text-sm mb-1">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className={`p-2 rounded-lg bg-gray-700`}>
          <Icon size={20} className={color} />
        </div>
      </div>
    </div>
  )
}

export default StatsCard