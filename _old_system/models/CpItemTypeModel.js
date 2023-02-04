import { localizer } from '../scripts/foundryHelpers.js'

const fields = foundry.data.fields

export default class CpItemTypeModel extends foundry.abstract.DataModel {
  static defineSchema() {
    return {
      types: new fields.ArrayField(
        new fields.SchemaField({
          acceptedItemTypes: new fields.ArrayField(new fields.StringField({
              blank: false,
              nullable: false,
              required: true,
              trim: true,
            }), {
            initial: [],
            nullable: false,
            required: true,
          }),
          allowMultipleDice: new fields.BooleanField({
            initial: false,
            nullable: false,
            required: true,
          }),
          defaultDieRatings: new fields.ArrayField(new fields.NumberField({
            initial: 8,
            integer: true,
            max: 12,
            min: 4,
            nullable: false,
            required: true,
          }), {
            initial: [],
            nullable: false,
            required: true,
          }),
          hasConsumableDice: new fields.BooleanField({
            initial: false,
            nullable: false,
            required: true,
          }),
          hasDescription: new fields.BooleanField({
            initial: false,
            nullable: false,
            required: true,
          }),
          hasDescriptors: new fields.BooleanField({
            initial: false,
            nullable: false,
            required: true,
          }),
          hasDice: new fields.BooleanField({
            initial: true,
            nullable: false,
            required: true,
          }),
          hasLabel: new fields.BooleanField({
            initial: false,
            nullable: false,
            required: true,
          }),
          hasTags: new fields.BooleanField({
            initial: false,
            nullable: false,
            required: true,
          }),
          id: new fields.StringField({
            blank: false,
            nullable: false,
            required: true,
            trim: true,
          }),
          identifier: new fields.StringField({
            blank: false,
            initial: null,
            nullable: true,
            required: true,
            trim: true,
          }),
          isLockable: new fields.BooleanField({
            initial: false,
            nullable: false,
            required: true,
          }),
          maximumDieRating: new fields.NumberField({
            initial: 4,
            integer: true,
            max: 12,
            min: 4,
            nullable: true,
            required: false,
          }),
          minimumDieRating: new fields.NumberField({
            initial: 4,
            integer: true,
            max: 12,
            min: 4,
            nullable: true,
            required: false,
          }),
          title: new fields.StringField({
            blank: false,
            initial: localizer('NewItemType'),
            nullable: false,
            required: true,
            trim: true,
          }),
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
