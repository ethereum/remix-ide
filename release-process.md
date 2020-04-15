This document includes:
 - how to update remix.ethereum.org.
 - how to update remix-alpha.ethereum.org.
 - how to release remix IDE.

# remix IDE release

 - git fetch origin master
 - git checkout origin/master
 - git checkout -b bumpVersion
 - update package.json version
 - remove package-lock.json version and generate a new one with `npm install`
 - merge PR
 - git fetch origin master
 - git checkout origin/master
 - git tag v(version-number)
 - git push --tags
 - github-changes -o ethereum -r remix-ide -a --only-pulls --use-commit-body --only-merges --between-tags previous_version...next_version
 - publish a release in github using the changelog
 - rm -rf node_modules
 - npm install
 - remove all soljson.js files in root folder
 - npm run build
 - npm publish
 - after remix_live is updated, drop the zip (from https://github.com/ethereum/remix-live/) to the release.

# remix-ide beta release
 - git fetch origin master
 - git checkout origin/master
 - git checkout -b bumpVersion
 - update package.json version to the new version "vx.x.x-beta.1"
 - remove package-lock/json version and generate a new one with `npm install`
 - merge PR
 - git fetch origin master
 - git checkout origin/master
 - git tag v(version-number) (with "vx.x.x-beta.1")
 - git push --tags
 - github-changes -o ethereum -r remix-ide -a --only-pulls --use-commit-body --only-merges --between-tags previous_version...next_version
 - publish a beta release in github using the changelog
 - drop zip file to the beta release (from https://github.com/ethereum/remix-live-alpha)
 
# remix.ethereum.org update

This is not strictly speaking a release. Updating the remix site is done through the Travis build:

 - git co -b remix_live origin/remix_live
 - git reset --hard -master-commit-hash-
 - git push -f origin remix_live

 CircleCI will build automaticaly and remix.ethereum.org will be updated

# remix-alpha.ethereum.org update

remix-alpha.ethereum.org is automaticaly updated every time commits are pushed to master
 
