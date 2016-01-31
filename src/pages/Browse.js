import _ from 'lodash'
import { connect } from 'react-redux'
import { values } from 'lodash'
import React, { Component } from 'react'
import { prefetch } from 'react-fetcher'

import RepoItem from 'components/RepoItem'

import { fetchAllRepos } from 'actions/repos'

if (process.env.BROWSER) {
  require('styles/Browse.scss')
}

@prefetch(({ dispatch }) => dispatch(fetchAllRepos()))
@connect(
  state => ({
    list: values(state.repos.all),
    loading: state.loader.repos
  })
)
class Browse extends Component {

  render () {
    const { list, loading } = this.props

    const sortedList = _.orderBy(list, 'summary.starsCount', 'desc')

    return (
      <div className='container'>

        <h1>{'Browse all repos'}</h1>

        <p className='mb2' style={{ color: 'orangered' }}>{'Due to Github API limitations, we cannot fetch repo with more than 40.000 stars for the moment. Dont try, bro.'}</p>

        <div className='repos-list-container'>
          <div className='repos-list-filter'>
            <h3>{'Languages'}</h3>
            <ul className='languages'>
              <li>{'Javascript'}</li>
              <li>{'Ruby'}</li>
              <li>{'Python'}</li>
              <li>{'HTML'}</li>
              <li>{'PHP'}</li>
              <li>{'Go'}</li>
            </ul>
          </div>
          <div className='repos-list-list'>
            {!loading && sortedList.map(repo => (
              <RepoItem key={repo._id} repo={repo} />
            ))}
            {loading && Array.apply(null, { length: Math.ceil(window.innerHeight / 166) }).map((e, i) => (
                <RepoItem key={i} blank />
              )
            )}
          </div>
        </div>

      </div>
    )
  }

}

export default Browse
