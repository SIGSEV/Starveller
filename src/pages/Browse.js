import React, { Component } from 'react'
import { Link } from 'react-router'

class Browse extends Component {

  render () {
    return (
      <div className='z' style={{ minHeight: 400 }}>
        {'Here you will be able to browse awesome repos.'}
        <Link to='/' style={{ marginTop: '1em' }}>
          <i className='octicon octicon-chevron-left' />
          {' Back to home'}
        </Link>
      </div>
    )
  }

}

export default Browse
