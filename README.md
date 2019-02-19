```
# Add your initials, used for branching naming, et al
export INITIALS=xx

# General
alias l="ls -1FG"
alias g='npm run ghendi'
alias m='time mocha test'

# Find variations
f() { find . -name "*$@*" -print; } # Find all files under the current directory
ff() { find . -type f -print | grep -v node_ | grep -v .git ; }
ffjs() { find . -type f -name "*.js" -print | grep -v node_ | grep -v .git; }
fs() { find . -name "$@"'*' -print | grep -v node_ | grep -v .git; } # Find file whose name starts with a given string
fe() { find . -name '*'"$@" -print | grep -v node_ | grep -v .git; } # Find file whose name ends with a given string
fjs() { echo "find . -name '*.js' | grep -v node_ | grep -v .git | xargs grep $@ 2>/dev/null"; find . -name '*.js' | grep -v node_ | grep -v .git | xargs grep $@ 2>/dev/null; }
fall() { echo "find . | grep -v node_ | grep -v .git | grep -v TAG | xargs grep $@ 2>/dev/null"; find . | grep -v node_ | grep -v .git | grep -v TAG | xargs grep $@ 2>/dev/null; }

# Docker
dclean() { echo "docker stop \$(docker ps -a -q); docker rm \$(docker ps -a -q)"; docker stop $(docker ps -a -q); docker rm $(docker ps -a -q); }
drun() { echo "docker run -d --name $@"; docker run -d --name "$@"; }
dsh() { echo "docker exec -it $@ /bin/bash"; docker exec -it "$@" /bin/bash; }

# Git
gb() { echo "git branch -avv"; git branch -avv; }
gbd() { echo "git branch -D $INITIALS/$@"; git branch -D "$INITIALS/$@"; }
gbehind() { echo "git log --pretty=format:'%Cblue%ad %Creset%s%Cgreen [%cn] %Cred%d' --decorate --date=short -n 25 ^$(git rev-parse --abbrev-ref HEAD) master"; git log --pretty=format:"%Cblue%ad %Creset%s%Cgreen [%cn] %Cred%d" --decorate --date=short -n 25 ^$(git rev-parse --abbrev-ref HEAD) master; }
gc() { echo "git add -A && git commit -am $@"; git add -A && git commit -am "$@"; }
gca() { echo "git commit --amend"; git commit --amend; }
gco() { echo "git checkout -b $INITIALS/$1 2>/dev/null || git checkout $INITIALS/$1"; git checkout -b $INITIALS/$1 2>/dev/null || git checkout $INITIALS/$1; }
gcom() { echo "git checkout master"; git checkout master; }
gcommits() { echo "git shortlog --summary --numbered"; git shortlog --summary --numbered; }
gd() { echo "git diff $@"; git diff $@; }
gl() { echo "git log --pretty=format:'%Cblue%ad %Cgreen%an %Creset%s %Cred%d' --decorate --date=short -n 20"; git log --pretty=format:'%Cblue%ad %Cgreen%an %Creset%s %Cred%d' --decorate --date=short -n 20; }
gls() { echo "git log --pretty=format:'%Cblue%ad %Cgreen%an %Creset%s' --decorate -n 20 --stat --date=short"; git log --pretty=format:'%Cblue%ad %Cgreen%an %Creset%s %Cred%d' --decorate --date=short -n 20 --stat; }
gls() { echo "git log --pretty=format:'%Cblue%ad %Cgreen%cn %Creset%s' --decorate -n 20 --stat --date=short"; git log --pretty=format:'%Cblue%ad %Cgreen%cn %Creset%s %Cred%d' --decorate --date=short -n 20 --stat; }
gm() { echo "git pull --rebase --prune && git merge --squash --ff-only $INITIALS/$1"; git pull --rebase --prune && git merge --squash --ff-only $INITIALS/$1; }
gp() { echo "git push origin $(git rev-parse --abbrev-ref HEAD) && vot"; git push origin $(git rev-parse --abbrev-ref HEAD) && vot; }
gpf() { echo "git push -f origin $(git rev-parse --abbrev-ref HEAD) && vot"; git push -f origin $(git rev-parse --abbrev-ref HEAD) && vot; }
gpr() { echo "git pull --rebase --prune"; git pull --rebase --prune; }
gprb() { echo "git fetch && git rebase origin/master"; git fetch && git rebase origin/master; }
grc() { echo "git add . && git rebase --continue"; git add . && git rebase --continue; }
grh() { echo "git reset HEAD^"; git reset HEAD^; }
s() { echo "git status --short"; git status --short; }

# Colors
tput sgr0; # reset colors
bold=$(tput bold);
reset=$(tput sgr0);
# Solarized colors, taken from http://git.io/solarized-colors.
black=$(tput setaf 0);
blue=$(tput setaf 33);
cyan=$(tput setaf 37);
green=$(tput setaf 64);
orange=$(tput setaf 166);
purple=$(tput setaf 125);
red=$(tput setaf 124);
violet=$(tput setaf 61);
white=$(tput setaf 15);
yellow=$(tput setaf 136);

# cd / prompt
cd() { builtin cd "$@"; l; }                # Always list directory contents upon 'cd'
function get_git_info() {
    name=$(git symbolic-ref --quiet --short HEAD 2>/dev/null || git rev-parse --short HEAD 2>/dev/null)
    if [ -n "$name" ]; then
        branch_name="${white}/${cyan}$name"
    else
        branch_name=''
    fi
}
export PROMPT_COMMAND="get_git_info; $PROMPT_COMMAND"
PS1="\n${white}["                       # [
PS1+="${orange}\u"                      # username
PS1+="${white}@"                        # @
PS1+="${orange}\h"                      # host
PS1+="\$branch_name"                    # /branch_name
PS1+="${white}]"                        # ]
PS1+=" ${white}\w ${white}> "           # working directory
PS1+="\n";                              # newline
PS1+="$ ";                              # $
export PS1;
```

- My typical branch based development flow on a repo requiring PRs:
  1. `cd REPOSITORY`
  1. `gco BRANCH_NAME` (git checkout -b $INITIALS/BRANCH_NAME)
  1. Make changes & test
  1. `s` (git status -s)
  1. `gc COMMIT_MESSAGE` (git add . && git commit -m COMMIT_MESSAGE)
  1. `gprb` (git fetch && git rebase origin/master)
  1. `gp` (git push origin BRANCH_NAME)
  1. `cpr` (create a PR request using $VELOX/apim-ci/cpr.js)
  1. `gcom` (git checkout -b master)

- What I do if a subsequent rebase is required for the branch/PR:
  1. `cd REPOSITORY`
  1. `gco BRANCH_NAME` (git checkout -b $INITIALS/BRANCH_NAME)
  1. `gprb` (git fetch && git rebase origin/master)
  1. `gpf` (git push -f origin $INITIALS/BRANCH_NAME)
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
