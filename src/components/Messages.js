import React, { Component } from 'react'
import { connect } from 'react-redux'

import { removeMessage } from 'actions/messages'

if (process.env.BROWSER) { require('styles/Messages.scss') }

@connect(
  ({ messages }) => ({ messages })
)
class Messages extends Component {

  _remove (id) {
    this.props.dispatch(removeMessage(id))
  }

  render () {
    const { messages } = this.props

    return (
      <div className='Messages--container'>
        {messages.map(({ data, id, type }) => {
          const className = `Message Message-${type}`

          return (
            <div
              onClick={this._remove.bind(this, id)}
              className={className}
              key={id}>
              {data}
            </div>
          )
        })}
      </div>
    )
  }

}

export default Messages
