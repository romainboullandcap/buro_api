import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Booking extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column.date({
    serialize: (value) => value,
    consume: (value) => value,
  })
  declare date: DateTime

  @column()
  declare desktop_id: number

  @column()
  declare email: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
