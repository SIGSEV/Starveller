import { debounce, values } from 'lodash'
import r from 'superagent'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

if (process.env.BROWSER) { require('styles/RepoSearch.scss') }

@connect(
  state => ({
    repos: values(state.repos.all)
  })
)
class RepoSearch extends Component {

  static propTypes = {
    onSelect: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props)
  }

  getOptions (input, done) {

    const fromCache = this.props.repos
      .map(r => ({ value: r, label: r.name }))

    if (input.length < 3) {
      return done(null, {
        options: fromCache
      })
    }

    r.get(`https://api.github.com/search/repositories?q=${input}&sort=stars`)
      .end((err, res) => {
        if (err) { return done(err) }
        const { items } = res.body

        const fromGithub = items
          .map(r => {
            const repo = {
              label: r.full_name,
              value: {
                name: r.full_name,
                summary: {
                  starsCount: r.stargazers_count
                }
              }
            }
            return repo
          })

        const options = [
          ...fromGithub,
          ...fromCache
        ]

        done(null, { options })
      })
  }

  render () {
    return (
      <div className='RepoSearch'>
        <input placeholder='Search for a repo, user...' type='text' />
      </div>
    )
  }

}

export default RepoSearch
