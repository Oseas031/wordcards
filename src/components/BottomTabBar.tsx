type TabKey = 'dashboard' | 'study' | 'library' | 'settings'

export function BottomTabBar(props: {
  tabs: readonly { key: TabKey; label: string }[]
  activeKey: TabKey
  onChange: (key: TabKey) => void
}) {
  return (
    <nav className="tabbar" aria-label="底部导航">
      <div className="tabbar__inner">
        {props.tabs.map((t) => {
          const active = t.key === props.activeKey
          return (
            <button
              key={t.key}
              type="button"
              className={active ? 'tabbar__item is-active' : 'tabbar__item'}
              onClick={() => props.onChange(t.key)}
              aria-current={active ? 'page' : undefined}
            >
              <span className="tabbar__dot" aria-hidden="true" />
              <span className="tabbar__label">{t.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

