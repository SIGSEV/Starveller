import React, { Component } from 'react'

if (process.env.BROWSER) { require('styles/Badge.scss') }

class Badge extends Component {

  state = {
    loaded: false
  }

  componentDidMount () {
    const { src } = this.props
    const img = new Image()
    img.onload = () => {
      this.setState({ loaded: true })
    }
    img.src = src
  }

  render () {
    const { loaded } = this.state
    const { src } = this.props

    return (
      <div className='Badge'>
        {loaded
          ? <img src={src} />
          : <div className='Badge-placeholder' />}
      </div>
    )
  }

}

export default Badge
