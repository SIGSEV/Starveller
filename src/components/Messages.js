import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
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
      <ReactCSSTransitionGroup
        className='Messages--container'
        transitionName='messagesTransition'
        transitionEnterTimeout={500}
        transitionLeaveTimeout={500}>
        {messages.map(({ data, id, type }) => {
          const className = `Message Message-${type}`

          return (
            <div
              key={id}>
              <div
                onClick={this._remove.bind(this, id)}
                className={className}>
                {data}
              </div>
            </div>
          )
        })}
      </ReactCSSTransitionGroup>
    )
  }

}

export default Messages
