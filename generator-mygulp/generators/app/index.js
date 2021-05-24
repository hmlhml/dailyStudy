'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the primo ${chalk.red('generator-mygulp')} generator!`
      )
    );

    const prompts = [
      {
        type: 'confirm',
        name: 'install',
        message: 'Would you like to enable this option?',
        default: true
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    this.fs.copy(
      this.templatePath('**'),   // 将templates里所有的内容拷贝
      this.destinationPath('./') // 到当前目录
    );
  }

  install() {
    this.installDependencies();
  }
};
