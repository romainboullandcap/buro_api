// import type { HttpContext } from '@adonisjs/core/http'

import Booking from "#models/booking";
import User from "#models/user";
import { HttpContext } from "@adonisjs/core/http";

export default class BookingController {
  async delete({ params, auth, response }: HttpContext) {
    const booking = await Booking.find(params.id);
    if (booking !== null) {
      const user: User = auth.user;
      if (user.id !== booking.userId) {
        console.warn(
          `L'utilisateur ${user.email} a tenté de supprimer une réservation pour l'utilisateur id ${booking.userId}`
        );
        return response.status(400).send("NOPE");
      }
      await booking.delete();
    } else {
      return response.status(404).send("La réservation n'existe pas ");
    }
  }
}
