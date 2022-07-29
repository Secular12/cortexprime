import defaultActorTypes from "../actor/defaultActorTypes.js"
import { localizer, setCssVars } from "../scripts/foundryHelpers.js"

export default class ImportExportSettings extends FormApplication {
  constructor() {
    super()
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: 'import-export-settings',
      template: 'systems/cortexprime/templates/import-export-settings.html',
      title: localizer('ImportExportSettings'),
      classes: ['cortexprime', 'import-export-settings'],
      width: 'auto',
      height: 'auto',
      top: 200,
      left: 400,
      resizable: true,
      closeOnSubmit: false,
      submitOnClose: true,
      submitOnChange: true
    })
  }

  getData() {
    return game.settings.get('cortexprime', 'importedSettings')
  }

  async _updateObject(event, formData) {
  }

  activateListeners(html) {
    super.activateListeners(html)
    html.find('.export-settings').click(this._exportSettings.bind(this))
    html.find('.import-settings').change(this._importSettings.bind(this))
    html.find('.reset-settings').click(this._resetSettings.bind(this))
  }

  async _exportSettings(event) {
    event.preventDefault()

    const { current, custom } = await game.settings.get('cortexprime', 'themes')

    const settings = {
      actorTypes: game.settings.get('cortexprime', 'actorTypes'),
      cortexPrimeVersion: game.system.data.version,
      theme: { current, custom }
    }

    await saveDataToFile(JSON.stringify(settings), 'json', 'my-cortex-prime-settings.json')
  }

  async _importSettings(event) {
    event.preventDefault()
    const file = $(event.currentTarget).prop('files')[0]

    if (file) {
      const fileReader = new FileReader()

      fileReader.onload = async () => {
        let data
        let warning

        try {
          data = JSON.parse(fileReader.result)
        } catch (error) {
          console.error(error)
          ui.notifications.error(localizer('CantReadImportFile'))
          return
        }

        if (!data?.cortexPrimeVersion && !data?.actorTypes) {
          ui.notifications.error(localizer('CantReadImportFile'))
          return
        }

        if (game.system.data.version !== data?.cortexPrimeVersion) {
          warning = localizer('ImportVersionWarning')
        }

        let confirmed

        await Dialog.confirm({
          title: localizer('AreYouSure'),
          content: `<div>${warning ? '<p class="my-2 pa-2 ba-2-primary">' + warning + '</p>' : ''}<p class="my-2">${localizer('ConfirmImportMessage')}</p></div>`,
          yes: () => { confirmed = true },
          no: () => { confirmed = false },
          defaultYes: false
        })

        if (confirmed) {
          await game.settings.set('cortexprime', 'importedSettings', { currentSetting: file.name })
          await game.settings.set('cortexprime', 'actorTypes', data.actorTypes)

          const themeSettings = await game.settings.get('cortexprime', 'themes')

          const { current, custom } = data.theme ?? {}

          themeSettings.current = current ?? 'Default'
          themeSettings.custom = custom ?? themeSettings.custom

          await game.settings.set('cortexprime', 'themes', themeSettings)

          const theme = themeSettings.current === 'custom' ? themeSettings.custom : themeSettings.list[themeSettings.current]

          setCssVars(theme)

          ui.notifications.info(localizer('ImportSuccessMessage'))

          this.render(true)
        }
      }

      fileReader.readAsText(file)
    }
  }

  async _resetSettings (event) {
    event.preventDefault()

    let confirmed

    await Dialog.confirm({
      title: localizer('AreYouSure'),
      content: localizer('ConfirmResetSettingsMessage'),
      yes: () => { confirmed = true },
      no: () => { confirmed = false },
      defaultYes: false
    })

    if (confirmed) {
      await game.settings.set('cortexprime', 'importedSettings', { currentSetting: localizer('Default') })
      await game.settings.set('cortexprime', 'actorTypes', defaultActorTypes)
      ui.notifications.info(localizer('ResetSuccessMessage'))

      this.render(true)
    }
  }
}