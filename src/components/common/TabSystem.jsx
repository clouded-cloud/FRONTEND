import React from 'react'

function TabSystem({ tabs, activeTab, onTabChange, children }) {
  return (
    <div className="tab-system">
      <div className="tabs">
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </div>
        ))}
      </div>
      <div className="tab-content">
        {children}
      </div>
    </div>
  )
}

export default TabSystem