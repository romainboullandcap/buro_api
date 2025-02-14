import Booking from '#models/booking'
import Desktop from '#models/desktop'
import { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class DesktopController {
  async index() {
    return await Desktop.query().preload('bookings')
  }

  async bookList({ request, response }: HttpContext) {
    const bookingList: Booking[] = []
    for (const date of request.body().dateList) {
      try {
        const createdBooking = await this.makeBooking(
          request.body().desktopId,
          request.body().email,
          date
        )
        bookingList.push(createdBooking)
      } catch (err) {
        console.log(' catch error', err)
        return response.status(400).send(err.message)
      }
    }
    return response.status(200).send(bookingList)
  }

  async makeBooking(desktopId: number, email: string, date: Date): Promise<Booking> {
    const error = await this.checkBooking(desktopId, email, date)
    if (error) {
      throw new Error(error)
    }
    const booking = await Booking.create({
      desktop_id: desktopId,
      email: email,
      date: this.getSearchDate(date),
    })
    console.log('booking created ', booking.desktop_id, booking.date, booking.email)
    return booking
  }

  async book({ request, response }: HttpContext) {
    return this.makeBooking(
      request.body().desktopId,
      request.body().email,
      request.body().date
    ).catch((error) => {
      console.log('error', error)
      return response.status(400).send(error.message)
    })
  }

  async checkBooking(desktopId: number, email: string, date: Date): Promise<string | undefined> {
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
    const searchDate = this.getSearchDate(date)
    console.log('searchDate', searchDate)
    const existingBookingForDesktop = await Booking.findBy({
      desktop_id: desktopId,
      date: searchDate,
    })
    if (existingBookingForDesktop !== null) {
      if (existingBookingForDesktop.email === email) {
        return 'Vous avez déjà une réservation pour ce bureau et ce jour'
      } else {
        return 'Le bureau est déjà réservé'
      }
    }

    // rechercher une réservation pour l'utilisateur et la date
    const existingBookingForUser = await Booking.findBy({
      email: email,
      date: searchDate,
    })

    if (existingBookingForUser !== null) {
      const desktop = await Desktop.find(existingBookingForUser!.desktop_id)
      return `Vous avez déjà une réservation le ${this.getDateString(searchDate)} pour le bureau ${desktop!.id}`
    }
    return ''
  }

  getSearchDate(date: Date): DateTime {
    const dateX: Date = new Date(date)
    let searchDate = DateTime.fromISO(dateX.toISOString(), {
      zone: 'Europe/Paris',
      locale: 'fr-FR',
    })
    // normaliser la partie heure (si le front ne l'a pas fait)
    return searchDate.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
  }

  getDateString(date: DateTime) {
    return date.toLocaleString()
  }
}
