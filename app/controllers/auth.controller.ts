import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'
import { registerValidator } from './validator.js'
import { JwtGuard } from '../guards/jwt.guard.js'

export default class AuthController {
  async login({ request, auth }: HttpContext) {
    const { email, password } = request.all()
    const user = await User.verifyCredentials(email, password)
    const guard: JwtGuard<any> = await auth.use('jwt')
    return guard.generate(user)
  }

  async register({ request, response }: HttpContext) {
    const payload = await request.validateUsing(registerValidator)
    const user = await User.create(payload)
    return response.created(user)
  }
}
