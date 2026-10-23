const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

const type = process.argv.slice(2)[0];
const buildDirectory = path.join(process.cwd(), 'dist/')

const execShellCommand = (cmd, cwd = process.cwd()) => {
  return new Promise((resolve, reject) => {
    childProcess.exec(cmd, {
      cwd
    }, (error, stdout, stderr) => {
      if (error) {
        console.warn(error);
      }
      resolve(stdout ? stdout : stderr);
    });
  });
}

const ImportGlobPlugin = require('esbuild-plugin-import-glob').default;

const esbuildOptions = {
  platform: 'node',
  entryPoints: [path.join(process.cwd(), 'backend/main.js')],
  bundle: true,
  outfile: path.join(buildDirectory, 'index.js'),
  external: ['pg-hstore'],
  minify: true,
  sourcemap: true,
  plugins: [
    ImportGlobPlugin(),
  ]
}

const doBuild = async () => {
  if (fs.existsSync(buildDirectory)) {
    fs.rmSync(buildDirectory, { recursive: true }, () => { });
  }

  fs.mkdirSync(buildDirectory);

  require('esbuild').build({
    ...esbuildOptions,
  }).catch(() => process.exit(1));

  execShellCommand('quasar build', './frontend').then(async (resp) => {

    if (!resp.includes('Build succeeded')) {
      return console.error('Frontend build error.')
    }

    console.log('Frontend build success.');

    fs.rename('./frontend/dist/spa', path.join(buildDirectory, 'front'), () => { })

  });

}

const doDev = async () => {
  if (!fs.existsSync(buildDirectory)) {
    fs.mkdirSync(buildDirectory);
  }

  require('esbuild').build({
    ...esbuildOptions,
    watch: {
      async onRebuild(error, result) {
        if (error) console.error('watch build failed:', error)
        else {
          console.log('watch build succeeded:', result)
        }
      },
    }
  }).catch(() => process.exit(1))
}

const buildBackend = async () => {
  if (!fs.existsSync(buildDirectory)) {
    fs.mkdirSync(buildDirectory);
  }

  require('esbuild').build({
    ...esbuildOptions,
  }).catch(() => process.exit(1))
}

if (type === 'build') doBuild();
else if (type === 'dev') doDev();
else if (type === 'buildBackend') buildBackend();
