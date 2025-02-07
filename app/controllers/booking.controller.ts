// import type { HttpContext } from '@adonisjs/core/http'

import Booking from '#models/booking'
import { HttpContext } from '@adonisjs/core/http'

export default class BookingController {
  async delete({ params, auth, response }: HttpContext) {
    const booking = await Booking.find(params.id)
    if (booking !== null) {
      if (auth.user.email !== booking.email) {
        console.warn(
          `L'utilisateur ${auth.user.email} a tenté de supprimer une réservation pour l'utilisateur ${booking.email}`
        )
        return response.status(400).send('NOPE')
      }
      await booking.delete()
    } else {
      return response.status(404).send('')
    }
  }
}
