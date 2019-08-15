#!/usr/bin/env node

const gulp = require('gulp');
const program = require('commander');
const path = require('path');

program.on('--help', () => {
  console.log();
});

program
  .command('start')
  .description('start libary.')
  .action(() => {
    require('../lib/devServer');
  });

program
  .command('init')
  .description('init your project.')
  .action(() => {
    const projectPath = path.join(process.cwd());
    const init = require('../lib/init');
    init(projectPath);
  });

program
  .command('analyzer')
  .description('analyzer your libary.');

program
  .command('build')
  .description('build your libary.');

program.parse(process.argv);

function runTask(toRun) {
  const metadata = { task: toRun };
  // Gulp >= 4.0.0 (doesn't support events)
  const taskInstance = gulp.task(toRun);
  if (taskInstance === undefined) {
    gulp.emit('task_not_found', metadata);
    return;
  }
  const start = process.hrtime();
  gulp.emit('task_start', metadata);
  try {
    taskInstance.apply(gulp);
    metadata.hrDuration = process.hrtime(start);
    gulp.emit('task_stop', metadata);
    gulp.emit('stop');
  } catch (err) {
    err.hrDuration = process.hrtime(start);
    err.task = metadata.task;
    gulp.emit('task_err', err);
  }
}

const task = program.args[0];
if (!task) {
  program.help();
} else if (!['start', 'init'].includes(task._name)) {
  console.log('maby-lib run', task);

  require('../gulpfile');

  runTask(task);
}

program
  .usage('<command>');
