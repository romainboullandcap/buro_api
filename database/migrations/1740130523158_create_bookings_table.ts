import Booking from '#models/booking'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'bookings'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('userId').unsigned().references('users.id').onDelete('CASCADE')
      table.dropColumn('email')
      
    })
    await Booking.truncate();
  }

  async down() {
    
  }
}