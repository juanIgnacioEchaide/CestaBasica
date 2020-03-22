import { Router } from 'express'
import { healthCheck, signin, signup, donate, commitment, checklist } from '../rules'
import { authRequired } from '../middlewares'

export const router = Router()

router.get('/health-check', (req, res) => res.status(200).json(healthCheck()))

router.post('/sign-up', (req, res) => signup(req.body)
  .then(user => res.status(201).json(user))
  .catch(err => {
    console.log(err)
    res.status(500).json({ message: err.message })
  }))

router.post('/sign-in', (req, res) =>
  signin(req.body)
    .then(signinData => res.status(200).json(signinData))
    .catch(err => {
      console.log(err)
      res.status(401).json({ message: err.message })
    }))

// entregar p/ familia
router.post('/donations/:donationId/donate', authRequired('leader'), (req, res) =>
  donate(req.body, req.file)
    .then(donationData => res.status(200).json(donationData))
    .catch(err => {
      console.log(err)
      res.status(401).json({ message: err.message })
    }))

router.post('/commitment', (req, res) =>
  commitment(req.body)
    .then(() => res.status(201).end())
    .catch(err => {
      console.log(err)
      res.status(401).json({ message: err.message })
    }))

router.post('/checklist', (req, res) =>
  checklist(req.body)
    .then(() => res.status(201).end())
    .catch(err => {
      console.log(err)
      res.status(401).json({ message: err.message })
    }))
