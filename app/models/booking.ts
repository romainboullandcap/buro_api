import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Booking extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare date: Date

  @column({columnName : 'desktopId'})
  declare desktopId: number

  // redondant mais nécessaire selon Lucid? 
  @column({columnName : 'userId'})
  declare userId : number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  declare email: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
