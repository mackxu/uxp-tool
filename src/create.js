import { select } from '@inquirer/prompts';
import { Command } from 'commander';
import { error } from './utils/console.js';
import ora from 'ora';
import download from 'download';
import { resolve } from 'path';

export async function create(name) {
  try {
    const tpl = await selectTemplate();
    if (!tpl) return;
    await downloadTpl(tpl, resolve(name));
  } catch (e) {
    console.log(e);
  }
}

async function selectTemplate() {
  const tplPrefix = 'uxp';
  const names = await getTemplates(tplPrefix);
  if (names.length === 0) {
    console.log(error(`Error: ${tplPrefix} template not found!`));
    return;
  }
  return await select({
    message: 'select template: ',
    choices: names.map((name) => ({ value: name })),
  });
}

async function getTemplates(tplPrefix) {
  const spinner = ora('Loading templates').start();
  try {
    const repos = await fetch(
      `https://api.github.com/search/repositories?q=owner:mackxu ${tplPrefix}`,
    ).then((res) => res.json());
    spinner.succeed();
    return repos.items.map((repo) => repo.name);
  } catch (e) {
    spinner.fail();
    throw new Error('loading templates error');
  }
}

async function downloadTpl(name, dist) {
  const spinner = ora(`Loading template`).start();
  try {
    await download(
      `https://api.github.com/repos/mackxu/${name}/zipball`,
      dist,
      { extract: true, strip: 1 },
    );
    spinner.succeed();
  } catch (err) {
    spinner.fail();
    throw err;
  }
}

// npm run dev -- name
if (process.env.npm_command === 'run-script') {
  console.log(111);
  const program = new Command();
  program.parse();
  create(program.args.at(0));
}
