const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

const { v4: uuidv4 } = require('uuid')
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const users = [{ username: "Juan", _id: "iddejuan" }, {username: "María", _id: "iddemaria"}]

//const users = []

app.post('/api/users', (req, res) => {
  const { username } = req.body
  const _id = uuidv4()

  let obj = {
    username, _id
  }

  const existing = users.filter(user => user.username === username)

  if (existing[0]) {
  
    obj = existing[0]
  
  } else {

    users.push(obj)
  
  }

  res.json(obj)
})

app.get('/api/users', (req, res) => {
  res.json(users)
})


const exercises = [{ "iddejuan": { description: "desc de Juan 1", duration: "20", date: new Date().toDateString() }},{ "iddejuan": { description: "desc de Juan 2", duration: "20", date: new Date().toDateString() }},{ "iddemaria": { description: "desc de María 3", duration: "20", date: new Date() }}]

//const exercises = []

app.post('/api/users/:_id/exercises', (req, res) => {
  const { _id } = req.params
  const { description, duration, date } = req.body
  
  const durationInt = parseInt(duration)
  const dateString = date ? new Date(date).toDateString() : new Date().toDateString()
  const user = users.filter(user => user._id === _id)

  if (!user[0]) {
    res.json({ error: `No existe un usuario con ID: ${_id}` })
    return
  }

  let objUser = {}
  Object.assign(objUser, user[0])

  let objExercise = { description, duration: durationInt, date: dateString }
  let obj = Object.assign(objUser, objExercise)

  exercises.push({ [_id]: objExercise })

  res.json(obj)
})

app.get('/api/users/:_id/logs', (req, res) => {
  const { _id } = req.params
  const user = users.filter(user => user._id === _id)

  let { from, to, limit } = req.query

  from = from ? new Date(from) : null
  to = to ? new Date(to) : null
  limit = limit ? parseInt(limit) : null

  if (!user[0]) {
    res.json({ error: `No existe un usuario con ID: ${_id}` })
    return
  }

  let arrayExercises = []

  exercises.filter(item => arrayExercises.push(item[_id]))
  arrayExercises = arrayExercises.filter(Boolean)

  if (from) {
    arrayExercises = arrayExercises.filter(exercise => new Date(exercise.date) >= from)
  }

  if (to) {
    arrayExercises = arrayExercises.filter(exercise => new Date(exercise.date) <= to)
  }

  if (limit) {
    arrayExercises = arrayExercises.filter((exercise, i) => (i + 1) <= limit)
  }

  let objUser = {}
  Object.assign(objUser, user[0])

  objUser.count = arrayExercises.length
  objUser.log = arrayExercises

  res.json(objUser)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
