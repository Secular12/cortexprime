import defaultActorTypes from "../actor/defaultActorTypes.js"
import { localizer } from "../scripts/foundryHelpers.js"

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

    const settings = {
      actorTypes: game.settings.get('cortexprime', 'actorTypes'),
      cortexPrimeVersion: game.system.data.version
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

        try {
          data = JSON.parse(fileReader.result)
        } catch (error) {
          console.error(error)
          ui.notifications.error(localizer('CantReadImportFile'))
          return
        }

        if (!data?.cortexPrimeVersion && !data?.actorTypes) {
          ui.notifications.error(localizer('CantReadImportFile'))
        }

        if (game.system.data.version !== data?.cortexPrimeVersion) {
          ui.notifications.warning(localizer('ImportVersionWarning'))
        }

        let confirmed

        await Dialog.confirm({
          title: localizer('AreYouSure'),
          content: localizer('ConfirmImportMessage'),
          yes: () => { confirmed = true },
          no: () => { confirmed = false },
          defaultYes: false
        })

        if (confirmed) {
          await game.settings.set('cortexprime', 'importedSettings', { currentSetting: file.name })
          await game.settings.set('cortexprime', 'actorTypes', data.actorTypes)
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