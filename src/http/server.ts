import fastify from 'fastify'

import { createPoll } from '../routes/create-poll'
import { getPoll } from '../routes/get-poll-by-id'

const app = fastify()

app.register(createPoll)
app.register(getPoll)

app.listen({port: 3001}).then(() => {
  console.log("RUNNING")
})