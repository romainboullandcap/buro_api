import Booking from '#models/booking'
import Desktop from '#models/desktop'
import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { TransactionClientContract } from '@adonisjs/lucid/types/database'
export default class DesktopController {

  trx! : TransactionClientContract;
  
  async list() {
    return await Desktop.query().preload('bookings', (postsQuery) => {
      postsQuery.preload('user')});
  }

  async bookList({ request, response, auth }: HttpContext) {
    const bookingList: Booking[] = []
    
    this.trx = await db.transaction()
    try {
      for (const date of request.body().dateList) {
        try {
          const createdBooking = await this.makeBooking(
            request.body().desktopId,
            (auth.user as User).id,
            date
          )
          bookingList.push(createdBooking)
        } catch (err) {
          console.log('catch error', err)
          return response.status(400).send(err.message)
        }        
    }
    await this.trx.commit()
  } catch (error) {
    await this.trx.rollback()
    return response.status(400).send(error.message)
  }
    return response.status(200).send(bookingList)
  }

  async makeBooking(desktopId: number, userId: number, date: Date): Promise<Booking> {
    /*const error = await this.checkBooking(desktopId, email, date)
    if (error) {
      throw new Error(error)
    }*/
    console.log("Make booking date", date)

    const bookingList = await this.trx.insertQuery<Booking>()
    .table('bookings')
    .returning(['id', 'desktopId', 'userId', 'date'])
    .insert({
      desktopId: desktopId,
      userId: userId,
      date: date,
      created_at : new Date(),
      updated_at : new Date(),
    });

    console.log('booking created ', bookingList)
    return bookingList[0];
  }

  // vérification des contraintes en amont de la bdd pour pouvoir générer un message user friendly
  async checkBooking(desktopId: number, userId: number, date: Date): Promise<string | undefined> {
    // check if desktop exists
    if (desktopId) {
      const desktop = await Desktop.find(desktopId)
      if (desktop === null) {
        return 'Le bureau spécifié est inconnu'
      }
    } else {
      return 'Aucun bureau spécifié'
    }

    // check if user can make booking
    const existingBookingForDesktop = await Booking.findBy({
      desktop_id: desktopId,
      date: date,
    })
    console.log("existingBookingForDesktop", existingBookingForDesktop)
    if (existingBookingForDesktop !== null) {
      if (existingBookingForDesktop.user.id === userId) {
        return 'Vous avez déjà une réservation pour ce bureau et ce jour'
      } else {
        return 'Le bureau est déjà réservé'
      }
    }

    // rechercher une réservation pour l'utilisateur et la date
    const existingBookingForUser = await Booking.findBy({
      userId: userId,
      date: date,
    })

    if (existingBookingForUser !== null) {
      const desktop = await Desktop.find(existingBookingForUser!.desktopId)
      return `Vous avez déjà une réservation le ${date.toLocaleString()} pour le bureau ${desktop!.id}`
    }
    return ''
  }
}
