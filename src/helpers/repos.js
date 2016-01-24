import _ from 'lodash'
import moment from 'moment'

export const getReposBoundaries = (repos) => {
  return {
    minStars: 0,
    maxStars: _.max(repos, repo => repo.summary.starsCount).summary.starsCount,
    minDate: new Date(_.min(repos, repo => new Date(repo.summary.createdAt).getTime()).summary.createdAt),
    maxDate: new Date()
  }
}

export const getBars = (repo, n) => {
  if (!repo.stars || !repo.stars.byDay) { return }

  const out = _.reduce(repo.stars.byDay, (res, e) => {
    if (res.length === n) { return res }
    return [...res, e.stars]
  }, [])

  for (let i = out.length; i < n; ++i) { out.unshift(0) }
  return out
}

export const reduceStars = (stars, slices = 10) => {
  if (stars.length <= slices) { return [...stars] }

  const daysBySlice = Math.ceil((stars.length - 2) / slices)

  // star accumulator, i'm pretty proud this var name
  let starAcc = 0

  return stars.reduce((acc, el, i) => {
    // always push first element
    if (i === 0) {
      acc.push(el)
    } else {
      const curDate = moment(el[0])
      const lastEl = acc[acc.length - 1]
      const lastDate = moment(lastEl[0])
      const diffWithLast = curDate.diff(lastDate, 'days')

      if (diffWithLast > daysBySlice || i === stars.length - 1) {
        acc.push([el[0], starAcc + el[1]])
      }
    }
    starAcc += el[1]
    return acc
  }, [])
}
