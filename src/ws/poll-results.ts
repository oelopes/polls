import { FastifyInstance } from "fastify";
import { z } from "zod";
import { votingPubSub } from "../utils/votes-pub-sub";

export async function pollResults(app: FastifyInstance) {
  app.get('/polls/:pollId/results', {websocket: true}, (connection, request) => {
    // Message comming from front-end
    // connection.socket.on('message', (message: string) => {
    //   connection.socket.send('you sent:' + message)
    // })

    const getPollParams = z.object({
      pollId: z.string().uuid(),
    })

    const {pollId} = getPollParams.parse(request.params)

    votingPubSub.subscribe(pollId, (message) => {
      connection.socket.send(JSON.stringify(message))
    })
  })
}