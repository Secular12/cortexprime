const fields = foundry.data.fields

export default class CpActorCharacterModel extends foundry.abstract.DataModel {
  static defineSchema() {
    return {
      characterType: new fields.StringField({
        blank: false,
        nullable: true,
        required: true,
      }),
      notes: new fields.ArrayField(
        new fields.SchemaField({
          name: new fields.StringField({
            blank: true,
            nullable: true,
            required: true,
          })
        }),
        {
          required: true,
          nullable: false,
        }
      ),
      plotPoints: new fields.NumberField({
        integer: true,
        nullable: false,
        required: true,
      })
    }
  } 
}
