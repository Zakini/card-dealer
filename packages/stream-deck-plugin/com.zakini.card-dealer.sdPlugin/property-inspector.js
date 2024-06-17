/// <reference path="libs/js/property-inspector.js" />

const displayCurrentSettings = (settings) => {
  for (const settingName in settings) {
    const el = document.querySelector(`input[name=${settingName}]`)
    if (!el) continue

    if (el.type !== 'file') {
      el.value = settings[settingName]
      continue
    }

    const infoEl = document.querySelector(`label.sdpi-file-info[for=${settingName}]`)
    if (!infoEl) continue

    if (el.multiple) {
      infoEl.textContent = [
        `${settings[settingName].length} file(s) selected`,
        ...settings[settingName],
      ].join('\n\n')
    } else {
      infoEl.textContent = settings[settingName]
    }
  }
}

// Keep fields up to date with current settings
$PI.onConnected((e) => {
  $PI.onDidReceiveSettings($PI.actionInfo.action, (e) => {
    displayCurrentSettings(e.payload.settings)
  })

  displayCurrentSettings(e.actionInfo.payload.settings)
})

const inputChanged = (event) => {
  const settingName = event.target.name
  let settingValue

  if (event.target.type !== 'file') {
    settingValue = event.target.value
  } else {
    const filePaths = Array.from(event.target.files).map(f => decodeURIComponent(f.name))

    if (event.target.multiple) {
      settingValue = filePaths
    } else {
      settingValue = filePaths[0] ?? null
    }
  }

  $PI.setSettings({ ...($PI.actionInfo.payload.settings ?? {}), [settingName]: settingValue })
  // Fetch settings again so that UI updates
  $PI.getSettings()
}

// TODO do this for all inputs?
document.querySelector('input[name=cardBack]')?.addEventListener('change', inputChanged)
document.querySelector('input[name=cardFaces]')?.addEventListener('change', inputChanged)
