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
      identifier: new fields.StringField({
        blank: false,
        initial: null,
        nullable: true,
        required: true,
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
      type: new fields.StringField({
        blank: false,
        initial: null,
        nullable: true,
        required: true,
        trim: true,
      }),
    }
  }
}