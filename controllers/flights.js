import { Destination } from '../models/destination.js'
import { Flight } from '../models/flight.js'

function index(req, res) {
  //we look thru our model to find any {} flights 
  Flight.find({}, function(err, flights){
    //renders index function that shows all flights
    res.render('flights/index', {
      title: 'All Flights',
      //not only brings title but also the flights that we found
      flights
    })
  })
}

function newFlight(req, res) {
  //renders the form to gather info for new flight
  res.render('flights/new', {
    //title for our view 
    title: 'Add Flight'
  })
}

function create(req, res) {
  console.log(req.body)
  //if the key is left blank delete
  for (let key in req.body) {
    if (req.body[key] === '') delete req.body[key]
  }
  //create a variable to hold the req.body from the model
  const flight = new Flight(req.body)
  //save the new flight
  flight.save(function(err){
    if (err) {
      console.log('error: ', err)
      //redirect if errror to try again
      return res.redirect('/flights/new')
    }
    //take to back to index view
  })
  res.redirect('/flights')
}

function show(req, res) {
  Flight.findById(req.params.id)
  .populate('destinations')
  .exec (function(err, flight) {
    Destination.find({_id: {$nin: flight.destinations}}, function(err, destinations) {
      res.render('flights/show', {
        title: 'Flight Details',
        flight,
        destinations
      })
    })
  })
}

function createTicket(req, res) {
  Flight.findById(req.params.id, function(err, flight) {
    console.log("id here", req.params.id)
    console.log('flight', flight)
    console.log(req.body)
    flight.tickets.push(req.body)
    flight.save(function(err) {
      console.log(err)
      res.redirect(`/flights/${flight._id}`)
    })
  })
}

function addAirport(req, res) {
  Flight.findById(req.params.id, function (err, flight) {
    flight.destinations.push(req.body.destinationId)
    flight.save(function(err) {
      res.redirect(`/flights/${flight._id}`)
    })
  })
}

export {
  index,
  newFlight as new,
  create,
  show,
  createTicket,
  addAirport
}