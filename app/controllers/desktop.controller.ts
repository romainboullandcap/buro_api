import Booking from '#models/booking'
import Desktop from '#models/desktop'
import { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import type { Request } from '@adonisjs/http-server'

export default class DesktopController {
  async index() {
    return await Desktop.query().preload('bookings')
  }

  async book({ request, response }: HttpContext) {
    console.log('book')
    const error = await this.checkBooking(request)
    if (error) {
      return response.status(400).send(error)
    }
    const booking = await Booking.create({
      desktop_id: request.body().desktopId,
      email: request.body().email,
      date: this.getSearchDate(request),
    })
    console.log('booking created ', booking.desktop_id, booking.date, booking.email)
    return booking
  }

  async checkBooking(request: any): Promise<string | undefined> {
    // check if desktop exists
    if (request.body().desktopId) {
      const desktop = await Desktop.find(request.body().desktopId)
      if (desktop === null) {
        return 'Le bureau spécifié est inconnu'
      }
    } else {
      return 'Aucun bureau spécifié'
    }

    // check if user can make booking
    const searchDate = this.getSearchDate(request)
    console.log('searchDate', searchDate)
    const existingBookingForDesktop = await Booking.findBy({
      desktop_id: request.body().desktopId,
      date: searchDate,
    })
    if (existingBookingForDesktop !== null) {
      if (existingBookingForDesktop.email === request.body().email) {
        return 'Vous avez déjà une réservation pour ce bureau et ce jour'
      } else {
        return 'Le bureau est déjà réservé'
      }
    }

    // rechercher une réservation pour l'utilisateur et la date
    const existingBookingForUser = await Booking.findBy({
      email: request.body().email,
      date: searchDate,
    })

    if (existingBookingForUser !== null) {
      const desktop = await Desktop.find(existingBookingForUser!.desktop_id)
      return 'Vous avez déjà une réservation pour ce jour sur le bureau: ' + desktop!.name
    }
    return ''
  }

  getSearchDate(request: Request): DateTime {
    let searchDate = DateTime.fromISO(request.body().date, { zone: 'Europe/Paris' })
    // normaliser la partie heure (si le front ne l'a pas fait)
    return searchDate.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
  }
}
