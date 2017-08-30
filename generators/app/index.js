'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

const mkdirp = require('mkdirp');
const _ = require('lodash');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the superior ' + chalk.red('generator-jiewj-webpack') + ' generator!'
    ));

    const prompts = [
      {
        type: 'input',
        name: 'projectName',
        message: 'Your project name',
        default: this.appname.replace(' ','-') // Default to current folder
      },
      {
        type: 'input',
        name: 'projectDesc',
        message: 'Please input project description:',
        default: this.appname
      },
      {
        type: 'input',
        name: 'projectMain',
        message: 'Main file(index.js)',
        default: 'index.js'
      },
      {
        type: 'input',
        name: 'projectAuthor',
        message: 'Author(jiewj)',
        default: 'jiewj'
      }];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    mkdirp('src');
    let readmeTpl = _.template(this.fs.read(this.templatePath('README.md')));
    this.fs.write(this.destinationPath('README.md'), readmeTpl({
      projectName: this.props.projectName,
      generatorName: 'generator-jiewj-webpack',
      yoName: 'jiewj-webpack'
    }));

    let date = new Date;
    let licenseTpl = _.template(this.fs.read(this.templatePath('LICENSE')));
    this.fs.write(this.destinationPath('LICENSE'), licenseTpl({
      year: date.getFullYear(),
      author: this.props.projectAuthor
    }));

    let indexTpl = _.template(this.fs.read(this.templatePath('index_tmpl.html')));
    this.fs.write(this.destinationPath('src/index.html'), indexTpl({
      title: this.props.projectName
    }));



    let pkg = this.fs.readJSON(this.templatePath('package_tmpl.json'));

    pkg.keywords = pkg.keywords || [];
    pkg.keywords.push('generator-jiewj-webpack');

    pkg.name = this.props.projectName;
    pkg.description = this.props.projectDesc;
    pkg.main = this.props.projectMain;
    pkg.author = this.props.projectAuthor;
    pkg.license = this.props.projectLicense;
    pkg.repository.url = `https://github.com/${pkg.author}/${pkg.name}.git`;

    this.fs.writeJSON(this.destinationPath('package.json'), pkg);

    this.fs.copy(
      this.templatePath('config'),
      this.destinationPath('config')
    );
    this.fs.copy(
      this.templatePath('gitignore_tmpl'),
      this.destinationPath('.gitignore')
    );
    this.fs.copy(
      this.templatePath('babelrc_tmpl'),
      this.destinationPath('.babelrc')
    );
    this.fs.copy(
      this.templatePath('webpack_tmpl.js'),
      this.destinationPath('webpack.config.js')
    );
  }

  install() {
    this.npmInstall();
  }
};
