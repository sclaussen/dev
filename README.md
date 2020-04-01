In ~/.zshrc:
```
# Add your initials, used for branching naming, et al
export INITIALS=xx

# Git aliases
function gco() { echo "git checkout -b $INITIALS/$1 2>/dev/null || git checkout $INITIALS/$1"; git checkout -b $INITIALS/$1 2>/dev/null || git checkout $INITIALS/$1; }
function gc() { echo "git add -A && git commit -am $@"; git add -A && git commit -am "$@"; }
function gpr() { echo "git pull --rebase --prune"; git pull --rebase --prune; }
function gp() { echo "git push origin $(git rev-parse --abbrev-ref HEAD) && vot"; git push origin $(git rev-parse --abbrev-ref HEAD) && vot; }
function gcom() { echo "git checkout master"; git checkout master; }
function gpf() { echo "git push -f origin $(git rev-parse --abbrev-ref HEAD) && vot"; git push -f origin $(git rev-parse --abbrev-ref HEAD) && vot; }
function gprb() { echo "git fetch && git rebase origin/master"; git fetch && git rebase origin/master; }
function grc() { echo "git add . && git rebase --continue"; git add . && git rebase --continue; }
function s() { echo "git status --short"; git status --short; }
function gm() { echo "git pull --rebase --prune && git merge --squash --ff-only $INITIALS/$1"; git pull --rebase --prune && git merge --squash --ff-only $INITIALS/$1; }
```


- My typical branch based development flow on a repo requiring PRs:
  1. `cd REPOSITORY`
  1. `gco BRANCH_NAME` (git checkout -b $INITIALS/BRANCH_NAME)
  1. Make changes & test
  1. `s` (git status -s)
  1. `gc COMMIT_MESSAGE` (git add . && git commit -m COMMIT_MESSAGE)
  1. `gprb` (git fetch && git rebase origin/master)
  1. `gp` (git push origin BRANCH_NAME)
  1. `cpr` (create a PR request using $VELOX/apim-ci/cpr.js) [NOTE: Not included here]
  1. `gcom` (git checkout -b master)

- What I do if a subsequent rebase is required for the branch/PR:
  1. `cd REPOSITORY`
  1. `gco BRANCH_NAME` (git checkout -b $INITIALS/BRANCH_NAME)
  1. `gprb` (git fetch && git rebase origin/master)
  1. `gpf` (git push -f origin $INITIALS/BRANCH_NAME)
  1. `gcom` (git checkout -b master)

- What if the gpr results in a merge conflict?
  1. `cd REPOSITORY`
  1. `gco BRANCH_NAME` (git checkout -b $INITIALS/BRANCH_NAME)
  1. Make changes & test
  1. `s` (git status -s)
  1. `gc COMMIT_MESSAGE` (git add . && git commit -m COMMIT_MESSAGE)
  1. `gprb` (git fetch && git rebase origin/master)
  1. Resolve merge conflict [NOTE: New Step]
  1. `grc` [NOTE: New Step]
  1. `gp` (git push origin BRANCH_NAME)
  1. `cpr` (create a PR request using $VELOX/apim-ci/cpr.js) [NOTE: Not included here]
  1. `gcom` (git checkout -b master)

- Merging locally into master:
  1. `cd REPOSITORY`
  1. `gco BRANCH_NAME` (git checkout -b $INITIALS/BRANCH_NAME)
  1. `gprb` (git fetch && git rebase origin/master)
  1. `gcom` (git checkout -b master)
  1. `gpr` (git pull --rebase)
  1. `gm BRANCH_NAME` (git merge --squash --ff-only $INITIALS/$1)
  1. `gp` (git push origin master)

- My typical development flow on a repo w/out PRs (on master):
  1. `cd REPOSITORY`
  1. Make changes & test
  1. `gpr` (git pull --rebase --prune)
  1. `gp` (git push origin master)

- My typical development flow on a repo w/out PRs (on master) when a merge conflict occurs:
  1. `cd REPOSITORY`
  1. Make changes & test
  1. `gpr` (git pull --rebase --prune)
  1. Resolve merge conflict
  1. `grc`
  1. `gp` (git push origin master)
