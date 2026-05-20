const { execSync } = require('child_process');
const cwd = 'd:\\Dim\\sertim\\sertim-ipp';
function run(cmd){
  try{
    const out = execSync(cmd, { cwd, encoding: 'utf8' });
    console.log('> ' + cmd);
    if(out) console.log(out.trim());
    return out.trim();
  }catch(e){
    console.error('! ' + cmd);
    if(e.stdout) console.error(e.stdout.toString());
    if(e.stderr) console.error(e.stderr.toString());
    else console.error(e.message);
    throw e;
  }
}

try{
  run('git status --porcelain --branch');
  run('git remote -v');
  try{
    run('git remote get-url beemou');
    console.log("remote 'beemou' exists");
  }catch(err){
    run('git remote add beemou https://github.com/beemou8/ipp.git');
    console.log("remote 'beemou' added");
  }
  const branch = run('git rev-parse --abbrev-ref HEAD');
  console.log('BRANCH='+branch);
  const porcelain = run('git status --porcelain');
  if(porcelain){
    run('git add -A');
    try{
      run('git commit -m "Sync: push workspace to beemou8/ipp"');
    }catch(e){
      console.log('commit skipped or failed');
    }
  } else {
    console.log('no changes to commit');
  }
  try{
    run('git push -u beemou '+branch+':main');
  }catch(e){
    console.error('Push failed — check auth or remote branch.');
  }
}catch(e){
  console.error('Script failed', e.message);
  process.exit(1);
}
