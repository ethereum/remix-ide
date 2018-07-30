
# Team best practices

This document aims to address contibutors best practices of the following repositories:
 - remix-ide https://github.com/ethereum/remix-ide
 - remix https://github.com/ethereum/remix
 - remix-tests https://github.com/ethereum/remix-tests
 - remixd https://github.com/ethereum/remixd

This document is not in its final version, **a team meeting which aim to address new/old best practices, feedback, workflows, all kind of issues related to how the team work together occurs every 2 weeks.**
This document link to other specialised best practices (like coding best practices).

Related links:
 - Remix basic FAQ: https://hackmd.io/KVooMJhWRImCGq6zkDgW9A
 - Remix weekly agenda: https://hackmd.io/2nJJZmMPQwCN4qwkxmfXVQ?edit
 - Remix live: remix.ethereum.org
 - Remix alpha live: remix-alpha.ethereum.org
 - Remix-ide NPM module: https://www.npmjs.com/package/remix-ide
 - Remix-lib NPM module: https://www.npmjs.com/package/remix-lib
 - Remix-solidity NPM module: https://www.npmjs.com/package/remix-solidity
 - Remix-debug NPM module: https://www.npmjs.com/package/remix-debug
 - Remix documentation: http://remix.readthedocs.io/en/latest/
 - General gitter channel: https://gitter.im/ethereum/remix
 - Dev gitter channel: https://gitter.im/ethereum/remix-dev
 - Huboard (task management tool): https://huboard.com/ethereum/remix-ide

---

# Team communication

 ### 1) Team meetings:
 
 - A regular standup - each Tuesday 4pm CET - which aim to 
    - Update every contributor on what others are doing.
    - Update the prioritised issues / PRs list.
    - Address little issues (possibly related to the current ongoing milestone).
    - High level demo, explanation about specific points of the codebase or Ethereum related things.

 - A milestone standup - scheduled before the beginning of each milestone, roughly on a monthly basis - which aim to define what will be included in the **next milestone** and who will work on what. This standup also help to set a clear long term vision.
 
 - A retrospective standup - every 2 weeks - which aim to talk about **best practices in general**: what is good, what is bad, how we can improve workflows.

 - A tour standup - on a monthly basis and just after a milestone finished - which aim to demo, **explain in details** features, bug fixes or any part of the codebase.
 
 
 ### 2) Group meetings:
 
 - When a story / bug fix is divided in parts, there should be a kickstart meeting with all the developers involved, so that all the devs have an good overview / understanding on:
     - How the story fits into the Ethereum tech.
     - How the backend (if any) works / will work (could be a smart contract).
     - How the frontend works / will work.
     - What is the general vision of the UX design for this particular story.
     Later progress and discussion is updated directly on the issue or pull request (Github).
 

---

# Prerequisites:

Before starting coding, we should ensure all devs / contributors are aware of: 
- Where the codebase is.
- How to setup and get started (always up to date).
- How to run tests.
- Where to find documentation.
- How to reach us through the communication channels - https://gitter.im/ethereum/remix, https://gitter.im/ethereum/remix-dev.
- The following best practices:

---

# Story / Bug fix

- Prioritised list of PRs / issues are tracked in the Remix huboard.
- Every story can be executed by a single developer or a group of 2 or more developers (depending on the size and complexity)
- Each dev should take the part he/she feels the most confortable with.
- Later progress and discussion is updated directly on the issue or pull request (github).
- When a developer or team decides on the story they want to work on (at the start of milestone for instance), they assign themselves to the issue. 
- The issue whould be moved in Huboard to the column named `working` when the work actually starts.
- Updates of the documentation should be done together with the story.

---

# Pull Requests

 ### 1) PR Creator:
 
 - It is recommended to use the emoji responses to signal agreement or that you've seen a comment and will address it rather than replying. This reduces github inbox spam.
 - Mark unfinished pull requests with the `Work in Progress` label
 - Large pull requests (above 200-400 lines of code changed) cannot be effectively reviewed and should be split into smaller pieces.
 - Code should comply to the `JavaScript standard style` - https://www.npmjs.com/package/standard
 - You should not expect complete review on a pull request which is not passing CI.
 - You can obviously ask for feedback on your approach.
 - You should assign a reviewer.
 - Pull requests should be used as a reference to update coding best practices whenever it is needed.

 ### 2) Review:
 
 - Everyone is free to review any pull request.
 - You should add the label "change requested" or "accepted".
 - When reviewing people's code consider the following two comments.
    > I don't like the name of this function.

    vs.

    > What do you think about changing the name of this function to ....

    Your feedback will often be better received if you pose it in the form of a question.

 - Pull request should be reviewed to comply to coding best practices.
 - You should take the responsability of the PR you are reviewing.
 - You should make sure the app is viable after the PR is being merged.
 - Ideally You should have enough knowledge to be able to fix related bugs.
      
 ### 3) Merge:

 - Merging is possible after Review and Tests are ok and when the PR is approved.
 - If possible the build of the dev branch (master) should be triggered in the Travis CI.
 - After a merge and master being built in Travis, it is highly recommended to check the new code in `remix-alpha.ethereum.org`

---

# Milestone

 - A milestone is small and contains **only** items we are sure to finish.
 - The end of a milestone trigger a new release.
 - Milestone items and duration should take in account time spent in bugs fixing and support.
 - The team should commit to the milestone duration.
 - If a dev finish early he/she can help other to push remaining tasks.
 - If a dev finish early he/she can work on specifying / integrating the next milestone.
 - A milestone duration is fixed at the start of the milestone (but should not exceed 1 month).
 - Progress and issues regarding a milestone are discussed on regular standups.

---

# Releases
 
 ### 1) Process:
 - Should be documented and updated.
 - A new release is triggered:
    - after an important bug fix
    - at the end of a milestone
 - Pushing `remix-alpha.ethereum.org` should be done very frequently (if possible after each feature / bug fix completion.
 - We can release an `m.m.m-alpha.x` (whenever we need to release and for whatever reasons) being in between a feature / bug fix completion.
 - We release an `m.m.x` whenever there is a bug fix.
 - We release an `m.x.0` whenever there is a new feature.
 - We release an `x.0.0` after each milestone we consider being an important progress.
 - We release an `x.0.0` if there's an API breaking change in one of our libraries.
 - After a new release we should stay in alert for possible regression and better not release Friday at 5pm :)

 ### 2) Community:
 - Before the official release, we should select a group of power users and invite them to test and give feedbacks.
 - Users need to know upfront a new release is coming and we should prepare them for it by showcasing some new features they can expect and when it will happen (fixed date, published at least 1 week in advance).
 - Whenever we have a new release we have to communicate this efficiently (twitter, reddit, ...).

---

# Maintenance


### 1) Bugs:
- A critical bug should get the label `Blocker`, and every effort should be put to fix it.
- Addressing a non critical and non planned bug can be done:
  - After having notified in the `remix-dev` channel if the bug does not involves UX or public API changes.
  - After a dev meeting (e.g the regular standup) if the bug involves any UX or public API changes.

### 2) Support:

- We should all keep an eye on the public non dev channel and file user feedback.

### 3) Documentation:

- The documentation is done / updated just after the feature / release in a team effort.
- Documentation work is filable as a github issue.
- It is encouraged to find and link associated doc produced by the community (blog posts, videos, tutorials, ...)

---

# Coding best practices

 - https://github.com/ethereum/remix-ide/blob/master/best-practices.md

---


## Best practices to address later

### meeting:
 - Find a good calendar we can use to schedule meetings.
 - Retrospective meeting: Someone can be responsible to record the findings (of the retrospective meeting) so we can review them in the following meeting and see if they were addressed or not, and if not discuss why and take new actions. If the issue was addressed then it can be discarded.
 - pair programming meetings

### merge process:
 - All the contributors of the feature should be able to merge.
 - Review should have 3 phases (1. code should work, 2. code should fit with current best practices, 3. update documentation)
 - We should have a dedicated person to only do browser frontend tests and make it easy for others to run them
 
### release process:

 - We release an `x.0.0` if there's a fundamental change in our UX design, which means users will need to readapt the way they use the app
 - after a week finishes, we publish/release a new version as **remix-beta.ethereum.org** and inform users so early adopters can test. after another week, when then next finished work is released as **remix-beta.ethereum.org**, the previous one becomes **remix.ethereum.org** and all users can start using it
 - a bot to automatically notify users about upcoming features on all channels whenever **remix-beta.ethereum.org** is updated
 - in case it's a major version increase - this announcement should be specially marked so ppl can check early instead of being confronted with drastic changes when **remix.ethereum.org** updates
### maintenance:
 - Setting up a "bug" time where we each take a bug for which:
     - We feel confortable to deal with
     or
     - We don't feel confortable but interested in fixing it - that will need the help of another dev
### documentation:
 - We set up a special day where we address all the necessary documentation work in a team effort.
 - Change to markdown or gitbook

### support:
 - Remix channel - we rotate and each day one or two are responsible for support (It would also be important to know for those of us who are contracted, how this can be billed.). If they don't know the answer they ping team member who they think could answer. That team member checks the support chat that day only if she/he is mentioned.
 - We should have a FAQ where basic answer are written down so we can drop the link regularly in the channel
 - People should be pointed to the appropriate `best practice.md` files by team members

### code best practices:
 - for code quality: use codeclimate and address issues
 - defining all global variables on top of the page
 - 80-10 characters per line
 - alphabetically list dependencies and separate npm from local for better readability
 - Use code documentation tool
 - Write modular code.
### community
 - This should be a Remix team work, from time to time (maybe once every 6 months) we could also invite other EF members for a focus group. And every 6 months we could also organize a focus group of selected users from Remix channel. 
### security
 - https://github.com/pipermerriam/ethereum-dev-tactical-manual/blob/master/opsec.md
### bug bounty program
 - https://github.com/pipermerriam/ethereum-dev-tactical-manual/blob/master/bug-bounty-program.md

