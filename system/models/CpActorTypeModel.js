import { localizer } from '../scripts/foundryHelpers.js'

const fields = foundry.data.fields

export default class CpActorTypeModel extends foundry.abstract.DataModel {
  static defineSchema() {
    return {
      types: new fields.ArrayField(
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
          id: new fields.StringField({
            blank: false,
            nullable: false,
            required: true,
            trim: true,
          }),
          title: new fields.StringField({
            blank: false,
            initial: localizer('NewActorType'),
            nullable: false,
            required: true,
            trim: true,
          }),
          sets: new fields.ArrayField(new fields.SchemaField({
            id: new fields.StringField({
              blank: false,
              nullable: false,
              required: true,
              trim: true,
            }),
            title: new fields.StringField({
              blank: false,
              initial: localizer('NewSet'),
              nullable: false,
              required: true,
              trim: true,
            })
          }), {
            initial: [],
            nullable: false,
            required: true,
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
