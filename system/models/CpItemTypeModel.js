import { localizer } from '../scripts/foundryHelpers.js'

const fields = foundry.data.fields

export default class CpItemTypeModel extends foundry.abstract.DataModel {
  static defineSchema() {
    return {
      types: new fields.ArrayField(
        new fields.SchemaField({
          id: new fields.StringField({
            blank: false,
            nullable: false,
            required: true,
            trim: true,
          }),
          title: new fields.StringField({
            blank: false,
            initial: localizer('NewItemType'),
            nullable: false,
            required: true,
            trim: true,
          }),
          acceptedItemTypes: new fields.ArrayField(new fields.SchemaField({
            id: new fields.StringField({
              blank: false,
              nullable: false,
              required: true,
              trim: true,
            }),
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
