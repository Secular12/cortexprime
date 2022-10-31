import { localizer } from '../scripts/foundryHelpers.js'

const fields = foundry.data.fields

export default class CpActorTypeModel extends foundry.abstract.DataModel {
  static defineSchema() {
    return {
      characters: new fields.ArrayField(
        new fields.SchemaField({
          hasNotes: new fields.BooleanField({
            initial: true,
            nullable: false,
            required: true,
          }),
          hasPlotPoints: new fields.BooleanField({
            initial: true,
            nullable: false,
            required: true,
          }),
          name: new fields.StringField({
            blank: false,
            initial: localizer('NewCharacterType'),
            nullable: false,
            required: true,
            trim: true,
          })
        }),
        {
          initial: [],
          nullable: false,
          required: true,
        }
      )
    }
  } 
}
