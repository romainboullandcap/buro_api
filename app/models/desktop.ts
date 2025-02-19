import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Booking from './booking.js'

export default class Desktop extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare x_coord: number

  @column()
  declare y_coord: number

  @column()
  declare angle: number

  @hasMany(() => Booking, { foreignKey: 'desktopId', localKey : 'id' })
  declare bookings: HasMany<typeof Booking>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
