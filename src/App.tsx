import { useMemo, useState } from 'react'
import { BottomTabBar } from './components/BottomTabBar'
import { DashboardPage } from './pages/DashboardPage'
import { StudyPage } from './pages/StudyPage'
import { LibraryPage } from './pages/LibraryPage'
import { SettingsPage } from './pages/SettingsPage'
import './index.css'

function App() {
  const tabs = useMemo(
    () =>
      [
        { key: 'dashboard', label: '概览' },
        { key: 'study', label: '学习' },
        { key: 'library', label: '词库' },
        { key: 'settings', label: '设置' },
      ] as const,
    [],
  )
  const [active, setActive] =
    useState<(typeof tabs)[number]['key']>('dashboard')

  return (
    <div className="app">
      <div className="app__top">
        <div className="container">
          <header className="nav">
            <div className="nav__title">词卡</div>
            <div className="nav__subtitle">像 iOS 一样干净、专注地背单词</div>
          </header>
        </div>
      </div>

      <main className="app__main">
        <div className="container">
          {active === 'dashboard' ? <DashboardPage /> : null}
          {active === 'study' ? <StudyPage /> : null}
          {active === 'library' ? <LibraryPage /> : null}
          {active === 'settings' ? <SettingsPage /> : null}
        </div>
      </main>

      <BottomTabBar
        tabs={tabs}
        activeKey={active}
        onChange={(k) => setActive(k)}
      />
    </div>
  )
}

export default App
