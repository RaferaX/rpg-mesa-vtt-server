import { createServer } from "http"
import { Server } from "socket.io"

const httpServer = createServer()

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
})

io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id)

  socket.on("entrarMesa", ({ campaignId, userName }: { campaignId: string; userName: string }) => {
    socket.data.userName = userName
    socket.join(campaignId)
    console.log(`${userName} entrou na mesa ${campaignId}`)

    socket.to(campaignId).emit("jogadorEntrou", { userName })
  })

  socket.on("sairMesa", (campaignId: string) => {
    socket.to(campaignId).emit("jogadorSaiu", { userName: socket.data.userName })
    socket.leave(campaignId)
  })

  socket.on("moverToken", ({ campaignId, tokenId, x, y }: { campaignId: string; tokenId: string; x: number; y: number }) => {
    socket.to(campaignId).emit("tokenMovido", { tokenId, x, y })
  })

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id)
  })
})

const PORT = 4000
httpServer.listen(PORT, () => {
  console.log(`Servidor Socket.io rodando na porta ${PORT}`)
})