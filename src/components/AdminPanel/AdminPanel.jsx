import React, { useState } from 'react'
import TabSystem from '../common/TabSystem'
import UserManagement from './UserManagement'
import AddUserForm from './AddUserForm'
import Alert from '../common/Alert'

function AdminPanel() {
  const [activeTab, setActiveTab] = useState('users')

  const tabs = [
    { id: 'users', label: 'Manage Users' },
    { id: 'add-user', label: 'Add User' }
  ]

  return (
    <div className="admin-panel">
      <Alert />
      <TabSystem
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'add-user' && <AddUserForm />}
      </TabSystem>
    </div>
  )
}

export default AdminPanel