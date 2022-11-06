const fields = foundry.data.fields

export default class CpItemAssetModel extends foundry.abstract.DataModel {
  static defineSchema() {
    return {
      assetType: new fields.StringField({
        blank: false,
        initial: null,
        nullable: true,
        required: true,
        trim: true,
      }),
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
    }
  }
}