import { Flight } from '../models/flight.js'
import { Destination } from '../models/destination.js'

function newDestination (req, res) {
  res.render('destinations/new', {
    title: 'Add Destination'
  })
}

function create (req, res) {
  for (let key in req.body) {
    if (req.body[key] === '') delete req.body[key]
  }
  const destination = new Destination(req.body)
  destination.save(function(err) {
    if (err) {
      return res.redirect('/destinations/new')
    }
  })
  res.redirect('/flights')
}

export {
  newDestination as new,
  create
}