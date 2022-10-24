const fields = foundry.data.fields

export default class ActorCharacterModel extends foundry.abstract.DataModel {
  static defineSchema() {
    return {
      actorType: new fields.StringField({
        blank: false,
        nullable: true,
        required: true,
      }),
      name: new fields.StringField({
        blank: false,
        nullable: false,
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
        nullable: true,
        positive: true,
        required: true,
      })
    }
  } 
}
