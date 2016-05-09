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

  /**
   *  Emit an event to all connected client with a repo id and current fetch progress
   */
  repoProgress (data) {
    this._io.emit('repoProgress--update', data)
  }

}

let io = null

export const initSocketServer = () => io = new SocketServer()

export const getSocketServer = () => io

export default getSocketServer()
