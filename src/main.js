import { Command } from 'commander';
import { create } from './create.js';
import { pkg } from './utils/constants.js';

const program = new Command();

program
  .command('create [options]')
  .alias('c')
  .description('create uxp project')
  .action(create);

program.name(pkg.name).description(pkg.description).version(pkg.version);

program.parse();
