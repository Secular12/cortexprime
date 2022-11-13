const fields = foundry.data.fields

export default class CpActorModel extends foundry.abstract.DataModel {
  static defineSchema() {
    return {
      actorTypeId: new fields.StringField({
        blank: false,
        initial: null,
        nullable: true,
        required: true,
        trim: true,
      }),
      notes: new fields.ArrayField(
        new fields.SchemaField({
          title: new fields.StringField({
            blank: true,
            nullable: true,
            required: true,
          })
        }),
        {
          initial: [],
          nullable: false,
          required: true,
        }
      ),
      plotPoints: new fields.NumberField({
        initial: 0,
        integer: true,
        min: 0,
        nullable: false,
        required: true,
      })
    }
  } 
}
