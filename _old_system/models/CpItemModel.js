const fields = foundry.data.fields

export default class CpItemModel extends foundry.abstract.DataModel {
  static defineSchema() {
    return {
      description: new fields.StringField({
        blank: true,
        initial: null,
        nullable: true,
        required: false,
        trim: false,
      }),
      isLocked: new fields.BooleanField({
        initial: false,
        nullable: false,
        required: true,
      }),
      dice: new fields.ArrayField(new fields.NumberField({
        initial: 4,
        integer: true,
        max: 12,
        min: 4,
        nullable: true,
        required: false,
      }), {
        initial: [],
        nullable: false,
        required: true,
      }),
      label: new fields.StringField({
        blank: true,
        initial: null,
        nullable: true,
        required: false,
        trim: true,
      }),
      parentItemId: new fields.StringField({
        blank: false,
        initial: null,
        nullable: true,
        required: true,
        trim: true,
      }),
      setId: new fields.StringField({
        blank: false,
        initial: null,
        nullable: true,
        required: true,
        trim: true,
      }),
      itemTypeId: new fields.StringField({
        blank: false,
        initial: null,
        nullable: true,
        required: true,
        trim: true,
      }),
    }
  }
}