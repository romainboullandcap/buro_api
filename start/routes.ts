/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const DesktopController = () => import('#controllers/desktop.controller')
const BookingController = () => import('#controllers/booking.controller')
const UserController = () => import('#controllers/user.controller')
const AuthController = () => import('#controllers/auth.controller')

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

// allow all
router.post('/login', [AuthController, 'login'])
router.post('/register', [AuthController, 'register'])

// only authenticated user
router.group(() => { 
  router.get('desktop', [DesktopController, 'list']);
  router.get('user', [UserController, 'list']);
  router.get('user/:id', [UserController, 'getById']);
  router.delete('booking/:id', [BookingController, 'delete']); // ajouter middleware.accessControl
}).use(middleware.auth());
router
  .group(() => {
    router.post('desktop/bookList', [DesktopController, 'bookList'])
  })
  .use([middleware.auth()])

