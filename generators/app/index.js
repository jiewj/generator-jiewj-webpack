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
        default: this.appname.replace(/ /g, '-') // Default to current folder
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
      },
      {
        type: 'input',
        name: 'typeScript',
        message: 'typescript?(y/n)',
        default: 'y'
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
    pkg.repository.url = `https://github.com/${pkg.author}/${pkg.name}.git`;
    pkg.dependencies = {
      "babel-core": "^6.25.0",
      "babel-loader": "^7.1.1",
      "babel-plugin-transform-runtime": "^6.23.0",
      "babel-preset-es2015": "^6.24.1",
      "babel-preset-stage-0": "^6.24.1",
      "copyfiles": "^1.2.0",
      "css-loader": "^0.28.4",
      "extract-text-webpack-plugin": "^3.0.0",
      "file-loader": "^0.11.2",
      "html-webpack-plugin": "^2.29.0",
      "node-sass": "^4.5.3",
      "postcss-loader": "^2.0.6",
      "postcss-pxtorem": "^4.0.1",
      "rimraf": "^2.6.1",
      "sass-loader": "^6.0.6",
      "style-loader": "^0.18.2",
      "url-loader": "^0.5.9",
      "webpack": "^3.4.1"
    };
    pkg.devDependencies = {
      "webpack-dev-server": "^2.6.1",
    };

    if (this.props.typeScript == 'y') {
      pkg.dependencies = Object.assign({}, pkg.dependencies, {
        "@types/node": "^8.0.17",
        "ts-loader": "^2.3.2",
        "typescript": "^2.4.2"
      });
      this.fs.copy(
        this.templatePath('tsconfig.json'),
        this.destinationPath('tsconfig.json')
      );
    }
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
