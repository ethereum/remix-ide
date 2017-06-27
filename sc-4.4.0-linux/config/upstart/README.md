Upstart is an event-based replacement for the `/sbin/init` Linux daemon that handles starting of tasks and services during boot, stopping them during shutdown, and supervising them while the system is running. For more information check out http://upstart.ubuntu.com.

Upstart will automatically start the Sauce Connect service, monitor each client, and tranparently restart the client if the client gets disconnected or a tunnel goes down.

Sauce Connect is a secure tunneling application that enables the Sauce Labs browser cloud to connect with websites you want to test that are hosted on your local machine or behind a firewall.

These instructions will help you set up Sauce Connect so that the starting and stopping of tunnels is controlled by Upstart.

1. Install the Sauce connect binary to `/usr/local/bin/sc`.
2. Copy the `sc_worker.conf` & `sc.conf` files to `/etc/init`.
   This will create two new upstart services, `sc_worker` and `sc.conf`. `sc_worker` manages individual Sauce Connect instance, while `sc.conf` manages multiple-instances started with `sc_worker`, allowing you to start multiple instances on the same server.
3. Check that the services are installed correctly with the `initctl list` command:
```
    $ initctl list | grep '^sc'
    sc_worker stop/waiting
    sc stop/waiting
```
4. Create a file named `/etc/default/sc` to store Sauce Connect's configuration options.
   It should look something like that:
```
    SAUCE_USERNAME=username
    SAUCE_ACCESS_KEY=fd698b0a-744c-4205-pa3d-16e2734127bf
```
Single Instance
---------------

Once that's done you can start and stop invidual Sauce Connect instance like this:
```
    $ sudo start sc_worker SE_PORT=8888
    sc_worker (8888) start/running, process 8856
```
The value `SE_PORT` corresponds to the Selenium port, each instance must have a
unique Seleniun port to listen on.

Let's check that our instace was started properly:

    $ status sc_worker SE_PORT=8888
    sc_worker (8888) start/running, process 8856

Looks all good, you now have a single instance of Sauce Connect running. If the
tunnel closes or anything unexpected happens upstart will automatically restart
Sauce Connect to re-establish connectivity.

Multiple Instances
------------------

While single instance setups are perfectly acceptable for small scale operations, you should set up multiple instances of Sauce Connect with High Availability to improve reliability & performance. For more information about the High Availability configuration for Sauce Connect, check our our documentation wiki: https://wiki.saucelabs.com/display/DOCS/Sauce+Connect

To use multiple instances, edit `/etc/default/sc` and add the parameter `SE_PORTS`
like this:
```
    SAUCE_USERNAME=username
    SAUCE_ACCESS_KEY=fd698b0a-744c-4205-pa3d-16e2734127bf
    SE_PORTS='8000 8001 8002 8003'
```
This will create four Sauce Connect instances, listening on port 8000, 8001, 8002,
& 8003. Let's try it out with the `sc` service:
```
    $ sudo start sc
    sc start/running
```
Let's check the status of the `sc_worker` services:
```
    $ initctl list | grep sc_worker
    sc_worker (8001) start/running, process 8503
    sc_worker (8000) start/running, process 8500
    sc_worker (8003) start/running, process 8512
    sc_worker (8002) start/running, process 8508
```
Stopping those instances is the same as starting them:
```
    $ sudo stop sc
    sc stop/waiting
    $ initctl list | grep sc_worker
    sc_worker stop/waiting
```
