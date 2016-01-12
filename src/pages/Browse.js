import { connect } from 'react-redux'
import { values } from 'lodash'
import React, { Component } from 'react'

@connect(
  state => ({
    list: values(state.repos.all)
  })
)
class Browse extends Component {

  render () {
    const { list } = this.props

    return (
      <div>
        {list.map(repo => (
          <div key={repo._id}>
            {repo.name}
          </div>
        ))}
      </div>
    )
  }

}

export default Browse
