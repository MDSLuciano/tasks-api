import fastify from 'fastify'
import { transactionRoutes } from './routes/transactionRoutes'
import fastifyCors from '@fastify/cors'
import { ZodError } from 'zod'

const app = fastify()

app.addHook('preHandler', async(request)=>{
    console.log(`${request.method}: ${request.url}`)
})

app.register(fastifyCors, {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
});




// Registrando a rota
app.register(transactionRoutes, { prefix: '/transactions' })

app.setErrorHandler((error, _, reply) =>{
    if(error instanceof ZodError){
        return reply
        .status(400)
        .send({ message: 'Validation error.', issues: error.format() })
    }

    console.log(error)

    return reply.status(500).send({ message: 'Internal server error.' })
})

app.listen({ port: 3333 }).then(() => {
	console.log(`HTTP server running!`)
})