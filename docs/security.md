Using Remix Safely
==================

- It is dangerous to send transactions on contracts you don't understand (even if it's a get rich quick scheme that you've copied & pasted from a Discord DM or a youtube video and you really really want to get rich).  

- Check our [article](https://medium.com/remix-ide/remix-in-youtube-crypto-scams-71c338da32d?source=friends_link&sk=bb6efbbf88bc3e496611943d282ad797) on a current scam promoting "liquidity front runner bots".

- Always check that you are loading Remix over HTTPS unless you have a specific reason for accessing it with HTTP (e.g. for using Remix locally or for a connection you trust).

- Make sure all your imports include the **version number** otherwise you don't know what version of files you are getting and the builds are not reproducible.

So **do not** use an import like this:<br>
`import "@openzeppelin/contracts/token/ERC20/ERC20.sol";`

Rather, **use one** like this:<br>
`import "@openzeppelin/contracts@4.7.3/token/ERC20/ERC20.sol";`

- When connecting a contract to an existing deployment, ensure that the thing you are connecting to is correct AND is the correct version.

- Always be sure to address or understand every warning.

- Remix is a subdomain of ethereum.org - so the only valid Remix urls are:
    - remix.ethereum.org
    - remix-alpha.ethereum.org
    - remix-beta.ethereum.org  

If you are directed to some site that looks like Remix but has a **similar but different URL** - it is NOT Remix and is likely a scam.

### Remix's ease makes its users a target
Because Remix has no setup, it has a large community of noobies to smart contract development. This is great, but it provides a target audience for scammers exploit. Without Remix, the scammers would first need to instruct victims to set up a local dev environment, which would severely limit the success rate of the scam.

**Scams lose their effectiveness when potential victims are educated about scams and about how to read and understand code. Learn Solidity and learn it well!** 

For Solidity Tutorials in Remix, go to the LearnEth plugin.

