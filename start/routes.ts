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
const AuthController = () => import('#controllers/auth.controller')

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

// allow all
router.post('/login', [AuthController, 'login'])
router.post('/register', [AuthController, 'register'])

// allow all
router.get('desktop', [DesktopController, 'index']).use(middleware.auth())
router
  .group(() => {
    router.post('desktop/bookList', [DesktopController, 'bookList'])
  })
  .use([middleware.auth(), middleware.accessControl()])

router.delete('booking/:id', [BookingController, 'delete']).use([middleware.auth()])
