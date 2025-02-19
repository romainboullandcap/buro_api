import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'bookings'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.unique(['desktop_id', 'date'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}