import fastifyCookie from '@fastify/cookie'
import fastify from 'fastify'

import { createPoll } from '../routes/create-poll'
import { getPoll } from '../routes/get-poll-by-id'
import { voteOnPoll } from '../routes/vote-on-poll'

const app = fastify()

app.register(fastifyCookie, {
  secret: 'polls-app-unique-id-secret',
  hook: 'onRequest',
})

app.register(createPoll)
app.register(getPoll)
app.register(voteOnPoll)

app.listen({port: 3001}).then(() => {
  console.log("RUNNING")
})