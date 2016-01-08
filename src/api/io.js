import socketIo from 'socket.io'

import config from 'config'

class SocketServer {

  constructor () {
    this._io = socketIo({ serveClient: false })
    this._io.listen(config.socketPort)
  }

  /**
   * Emit an event to all connected clients with the fetched repository
   */
  repoFetched (repo) {
    this._io.emit('repoFetched', repo)
  }

}

let io = null

export const initSocketServer = () => {
  io = new SocketServer()
}

export const getSocketServer = () => {
  return io
}

export default getSocketServer()
