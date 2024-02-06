import { randomUUID } from 'crypto'
import { FastifyInstance } from 'fastify'
import z from 'zod'
import { prisma } from '../lib/prisma'


export async function voteOnPoll(app: FastifyInstance) {
   app.post('/polls/:pollId/votes', async (req, reply) => {
    const voteOnPollBody = z.object({
      pollOptionId: z.string().uuid()
    })

    const voteOnPollParams = z.object({
      pollId: z.string().uuid()
    })

    const {pollOptionId} = voteOnPollBody.parse(req.body)
    const {pollId} = voteOnPollParams.parse(req.params)

    let { sessionId } = req.cookies

    if(sessionId) {
      const userPreviousVoteOnPoll = await prisma.vote.findUnique({
        where: {
          sessionId_pollId: {
            sessionId,
            pollId,
          }
        }
      })

      if(userPreviousVoteOnPoll && userPreviousVoteOnPoll.pollOptionId !== pollOptionId) {
        // delete previous vote
        await prisma.vote.delete({
          where: {
            id: userPreviousVoteOnPoll.id
          }
        })
      } else {
        return reply.status(400).send({message: "You've already voted on this poll"})
      }
    }

    if(!sessionId) {
      sessionId = randomUUID()

      reply.setCookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
        signed: true,
        httpOnly: true,
      })
    }

    const vote = await prisma.vote.create({
      data: {
        sessionId,
        pollId,
        pollOptionId,
      }
    })


    return reply.status(201).send(vote)
   })
  }
