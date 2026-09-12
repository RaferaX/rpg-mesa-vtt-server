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

  socket.on("tokenCriado", ({ campaignId, token }: { campaignId: string; token: any }) => {
    socket.to(campaignId).emit("novoToken", token)
  })

  socket.on("atualizarMapa", ({ campaignId, url }: { campaignId: string; url: string }) => {
    socket.to(campaignId).emit("mapaAtualizado", { url })
  })

  socket.on("mensagemChat", ({ campaignId, message }: { campaignId: string; message: any }) => {
    io.to(campaignId).emit("novaMensagem", message)
  })

  socket.on("desenharSeta", ({ campaignId, arrow }: { campaignId: string; arrow: any }) => {
    socket.to(campaignId).emit("setaDesenhada", arrow)
  })

  socket.on("removerSeta", ({ campaignId, arrowId }: { campaignId: string; arrowId: string }) => {
    socket.to(campaignId).emit("setaRemovida", { arrowId })
  })

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id)
  })

  socket.on("tokenRemovido", ({ campaignId, tokenId }: { campaignId: string; tokenId: string }) => {
  socket.to(campaignId).emit("tokenRemovidoConfirmado", { tokenId })
  })

  socket.on("tokenSaiuDeCena", ({ campaignId, tokenId }: { campaignId: string; tokenId: string }) => {
  socket.to(campaignId).emit("tokenSaiuDeCenaConfirmado", { tokenId })
})

})


const PORT = 4000
httpServer.listen(PORT, () => {
  console.log(`Servidor Socket.io rodando na porta ${PORT}`)
})