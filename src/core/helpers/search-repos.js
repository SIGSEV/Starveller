import r from 'superagent'
import { sortBy } from 'lodash'

const github = 'https://api.github.com'

const transformGithubRepo = repo => ({
  name: repo.full_name,
  stars: repo.stargazers_count,
  desc: repo.description
})

const searchRepos = term => Promise.all([

  // Github repos results

  new Promise((resolve, reject) => {

    let url

    if (term[term.length - 1] === '/') {
      url = `${github}/users/${term.substr(0, term.length - 1)}/repos`
    } else {

      const query = term.indexOf('/') !== -1
        ? `q=${term.substr(term.indexOf('/') + 1)}+user:${term.substring(0, term.indexOf('/'))}`
        : `q=${term}`

      url = `${github}/search/repositories?${query}&sort=stars&per_page=10'`

    }

    r.get(url)
      .end((err, res) => {
        if (err) { return reject(err) }
        const items = res.body.items || sortBy(res.body, repo => -repo.stargazers_count)
        resolve(items.map(transformGithubRepo))
      })
  })

])
  .then(([githubRepos]) => {
    const res = [
      ...githubRepos
    ]
    return res
  })

export default searchRepos
