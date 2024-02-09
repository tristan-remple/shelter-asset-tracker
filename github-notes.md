# Workflow
- PM creates issues
- PM assigns team members to issues
- team members create branch from issue (on the github interface)
- team member: `git checkout -b MyNewBranch`
- team member does work, commits, and pushes
- `git add --all` -> `git commit -m "message"` -> `git push`
- all of these actions will default to the branch you're in
- check your branch with `git status`
- when you are done working on the issue and your work is commited, open a pull request
- on github, click `branches` -> MyNewBranch -> `contribute` -> `open pull request`
- the pull request submits your code to the PM for review
- PM can approve the request, comment on it, or close it
- once the pull request is approved and the issue resolved, the branch will no longer be connected to the issue, but it will still exist
- while it is possible to continue working on it, you should instead check out a new issue to do new work

# Notes
- always `git pull origin main` when you start working
- never push directly to origin main