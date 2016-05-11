import React, { Component } from 'react'
import { Link } from 'react-router'

class Fail extends Component {

  render () {
    return (
      <div className='z' style={{ minHeight: 500 }}>
        <h1>
          {'You have nothing to do here.'}
          <br />
          {'Little hack3r.'}
        </h1>
        <Link to='/'>
          <i className='octicon octicon-chevron-left' />
          {' Back to safety'}
        </Link>
      </div>
    )
  }

}

export default Fail
