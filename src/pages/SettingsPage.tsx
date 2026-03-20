import { useEffect, useState } from 'react'

type Settings = {
  dailyGoal: number
  theme: 'light' | 'dark' | 'auto'
  fontSize: 'small' | 'medium' | 'large'
}

const SETTINGS_KEY = 'wordcards.settings.v1'

const DEFAULT_SETTINGS: Settings = {
  dailyGoal: 20,
  theme: 'auto',
  fontSize: 'medium',
}

function loadSettings(): Settings {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY)
    if (saved) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }
    }
  } catch (error) {
    console.error('Failed to load settings:', error)
  }
  return DEFAULT_SETTINGS
}

function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  } catch (error) {
    console.error('Failed to save settings:', error)
  }
}

export function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [editingDailyGoal, setEditingDailyGoal] = useState(false)
  const [dailyGoalInput, setDailyGoalInput] = useState('')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const loaded = loadSettings()
    setSettings(loaded)
    applyTheme(loaded.theme)
    applyFontSize(loaded.fontSize)
    setTimeout(() => setIsVisible(true), 50)
  }, [])

  function applyTheme(theme: Settings['theme']): void {
    const root = document.documentElement
    if (theme === 'dark') {
      root.style.setProperty('--bg', '#1c1c1e')
      root.style.setProperty('--card-bg', '#2c2c2e')
      root.style.setProperty('--text', '#ffffff')
      root.style.setProperty('--muted', '#98989d')
      root.style.setProperty('--line', '#38383a')
    } else if (theme === 'light') {
      root.style.setProperty('--bg', '#f2f2f7')
      root.style.setProperty('--card-bg', '#ffffff')
      root.style.setProperty('--text', '#000000')
      root.style.setProperty('--muted', '#8e8e93')
      root.style.setProperty('--line', '#c6c6c8')
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      applyTheme(prefersDark ? 'dark' : 'light')
    }
  }

  function applyFontSize(fontSize: Settings['fontSize']): void {
    const root = document.documentElement
    const sizes = {
      small: '14px',
      medium: '16px',
      large: '18px',
    }
    root.style.setProperty('--base-font-size', sizes[fontSize])
  }

  function handleDailyGoalSave(): void {
    const value = parseInt(dailyGoalInput, 10)
    if (isNaN(value) || value < 1 || value > 100) {
      alert('请输入 1-100 之间的数字')
      return
    }
    const newSettings = { ...settings, dailyGoal: value }
    setSettings(newSettings)
    saveSettings(newSettings)
    setEditingDailyGoal(false)
  }

  function handleDailyGoalCancel(): void {
    setDailyGoalInput(settings.dailyGoal.toString())
    setEditingDailyGoal(false)
  }

  function handleThemeChange(theme: Settings['theme']): void {
    const newSettings = { ...settings, theme }
    setSettings(newSettings)
    saveSettings(newSettings)
    applyTheme(theme)
  }

  function handleFontSizeChange(fontSize: Settings['fontSize']): void {
    const newSettings = { ...settings, fontSize }
    setSettings(newSettings)
    saveSettings(newSettings)
    applyFontSize(fontSize)
  }

  return (
    <div className="tabshell">
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.96);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .settings-fade-up {
          animation: fadeInUp 0.4s ease-out forwards;
        }
        .settings-scale-in {
          animation: scaleIn 0.35s ease-out forwards;
        }
      `}</style>

      <section
        className="card"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.35s ease-out, transform 0.35s ease-out',
        }}
      >
        <div className="card__body">
          <h1 className="h1">设置</h1>
          <div className="muted" style={{ marginTop: 6 }}>
            自定义你的学习体验
          </div>
        </div>
      </section>

      <section
        className="card"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.4s ease-out 0.1s, transform 0.4s ease-out 0.1s',
        }}
      >
        <div className="card__body">
          <div className="row">
            <div>
              <div style={{ fontWeight: 700 }}>每日目标</div>
              <div className="muted-2" style={{ marginTop: 4 }}>
                {editingDailyGoal ? (
                  <input
                    type="number"
                    value={dailyGoalInput}
                    onChange={(e) => setDailyGoalInput(e.target.value)}
                    min="1"
                    max="100"
                    style={{
                      width: '80px',
                      padding: '4px 8px',
                      borderRadius: 8,
                      border: '1px solid var(--line)',
                      background: 'rgba(255,255,255,0.66)',
                      color: 'var(--text)',
                      fontWeight: 650,
                      outline: 'none',
                    }}
                  />
                ) : (
                  `${settings.dailyGoal} 个单词`
                )}
              </div>
            </div>
            {editingDailyGoal ? (
              <div className="row">
                <button
                  className="btn btn--ghost"
                  type="button"
                  onClick={handleDailyGoalCancel}
                >
                  取消
                </button>
                <button
                  className="btn btn--primary"
                  type="button"
                  onClick={handleDailyGoalSave}
                >
                  保存
                </button>
              </div>
            ) : (
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setDailyGoalInput(settings.dailyGoal.toString())
                  setEditingDailyGoal(true)
                }}
              >
                修改
              </button>
            )}
          </div>
        </div>
      </section>

      <section
        className="card"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.4s ease-out 0.2s, transform 0.4s ease-out 0.2s',
        }}
      >
        <div className="card__body">
          <div style={{ fontWeight: 700, marginBottom: 12 }}>主题</div>
          <div className="row">
            <button
              className={`btn settings-scale-in ${settings.theme === 'light' ? 'btn--primary' : ''}`}
              style={{ animationDelay: '0.2s' }}
              type="button"
              onClick={() => handleThemeChange('light')}
            >
              浅色
            </button>
            <button
              className={`btn settings-scale-in ${settings.theme === 'dark' ? 'btn--primary' : ''}`}
              style={{ animationDelay: '0.25s' }}
              type="button"
              onClick={() => handleThemeChange('dark')}
            >
              深色
            </button>
            <button
              className={`btn settings-scale-in ${settings.theme === 'auto' ? 'btn--primary' : ''}`}
              style={{ animationDelay: '0.3s' }}
              type="button"
              onClick={() => handleThemeChange('auto')}
            >
              自动
            </button>
          </div>
        </div>
      </section>

      <section
        className="card"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.4s ease-out 0.3s, transform 0.4s ease-out 0.3s',
        }}
      >
        <div className="card__body">
          <div style={{ fontWeight: 700, marginBottom: 12 }}>字体大小</div>
          <div className="row">
            <button
              className={`btn settings-scale-in ${settings.fontSize === 'small' ? 'btn--primary' : ''}`}
              style={{ animationDelay: '0.3s' }}
              type="button"
              onClick={() => handleFontSizeChange('small')}
            >
              小
            </button>
            <button
              className={`btn settings-scale-in ${settings.fontSize === 'medium' ? 'btn--primary' : ''}`}
              style={{ animationDelay: '0.35s' }}
              type="button"
              onClick={() => handleFontSizeChange('medium')}
            >
              中
            </button>
            <button
              className={`btn settings-scale-in ${settings.fontSize === 'large' ? 'btn--primary' : ''}`}
              style={{ animationDelay: '0.4s' }}
              type="button"
              onClick={() => handleFontSizeChange('large')}
            >
              大
            </button>
          </div>
        </div>
      </section>

      <section
        className="card"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.4s ease-out 0.4s, transform 0.4s ease-out 0.4s',
        }}
      >
        <div className="card__body">
          <button
            className="btn btn--ghost"
            type="button"
            onClick={() => {
              if (confirm('确定要重置所有设置吗？')) {
                setSettings(DEFAULT_SETTINGS)
                saveSettings(DEFAULT_SETTINGS)
                applyTheme(DEFAULT_SETTINGS.theme)
                applyFontSize(DEFAULT_SETTINGS.fontSize)
              }
            }}
            style={{ width: '100%', color: '#ff3b30' }}
          >
            重置所有设置
          </button>
        </div>
      </section>
    </div>
  )
}
