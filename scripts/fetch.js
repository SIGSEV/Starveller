//
//  Usage: npm run fetch <name ...>
//         npm run fetch -- [options] <name ...>
//
//  Options:
//
//    -h, --help     output usage information
//    -f, --force    Force all stars to be re-fetched
//

import program from 'commander'

import 'api/db'
import ghWorker from 'api/github.worker'

program
  .usage('[options] <name ...>')
  .option('-f, --force', 'Force all stars to be re-fetched')
  .parse(process.argv)

const tasks = program.args.map(name => ({ name, hard: !!program.force }))

if (tasks.length) {

  let exitCode = 0

  const onTaskFinished = err => { if (err) { exitCode = 1 } }
  const onAllTasksFinished = () => process.exit(exitCode)
  const addToWorker = task => ghWorker.push(task, onTaskFinished)

  tasks.forEach(addToWorker)
  ghWorker.onFinish(onAllTasksFinished)

} else {
  process.exit(0)
}
