
import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http';
export default class UserController {
  
  async list() {
    return await User.all();
  }

  async getById({ params }: HttpContext) {
    return await User.find(params.id);
  }
}
