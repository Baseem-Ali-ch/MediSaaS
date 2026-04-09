import { Router } from 'express'
import authRoutes from './auth.routes'
import adminRoutes from './owner.routes'
import patientRoutes from './patient.routes'

const router = Router()

router.use('/auth', authRoutes)
router.use('/admin', adminRoutes)
router.use('/patients', patientRoutes)

export default router