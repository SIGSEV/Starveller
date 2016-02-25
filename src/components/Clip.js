import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addMessage } from 'actions/messages'

const Clipboard = process.env.BROWSER
  ? require('clipboard')
  : null

@connect()
class Clip extends Component {

  copyToClipboard = (e) => {
    const { text } = this.props
    const clipboard = new Clipboard(e.target, { text })
    const destroyClipboard = () => clipboard.destroy()

    clipboard.on('success', () => {
      this.props.dispatch(addMessage({ type: 'info', data: 'Copied!' }))
      destroyClipboard()
    })

    clipboard.on('error', destroyClipboard)
    clipboard.onClick(e)
  };

  render () {
    return (
      <div className='ClipButton' onClick={this.copyToClipboard} style={this.props.style}>
        <span className='octicon octicon-clippy' />
      </div>
    )
  }

}

export default Clip
