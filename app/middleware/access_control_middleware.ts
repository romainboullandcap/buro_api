import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { errors } from '@adonisjs/auth'
import Booking from '#models/booking'

export default class AccessControlMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    // check if user is making booking for himself
    const email = await this.getEmailForRequest(ctx)
    if (ctx.auth.user.email !== email) {
      console.warn(
        `L'utilisateur ${ctx.auth.user.email} a tenté de créer une réservation pour l'utilisateur ${email}`
      )
      throw new errors.E_UNAUTHORIZED_ACCESS('Unauthorized access 🩻💣🚔', {
        guardDriverName: 'AccessControlMiddleware',
      })
    }
    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }

  async getEmailForRequest(ctx: HttpContext) {
    console.log('params', ctx.request.parsedUrl.path)
    if (ctx.request.parsedUrl.path === '/desktop/book' && ctx.request.method() === 'POST') {
      return ctx.request.body().email
    } else if (
      ctx.request.parsedUrl.path?.startsWith('/booking') &&
      ctx.request.method() === 'DELETE'
    ) {
      const booking = await Booking.find(ctx.request.params().id)

      if (booking !== null) {
        console.log('booking', booking.email)
        return booking.email
      } else {
        return 'booking_inconnu'
      }
    }
    return 'inconnu pour route'
  }
}
