Systemd is a system and service manager for Linux that, among other things, can be used to control the starting and stopping of services. For more information check out https://www.freedesktop.org/wiki/Software/systemd/

Sauce Connect is a secure tunneling application that allows the Sauce Labs browser cloud to connect to websites you want to test that are hosted on localhost or behind a firewall. For more information check out the Sauce Labs documentation wiki: https://wiki.saucelabs.com/display/DOCS/Sauce+Connect

These instructions will show you how to set up systemd with Sauce Connect to manage the starting and stopping of Sauce Connect tunnels.

Systemd will automatically start the Sauce Connect service, monitor each client, and tranparently restart the client if the client gets disconnected or a tunnel goes down.

Setting Up systemd
----------------

1. Copy the files `sc.service` & `sc@.service` to `/etc/systemd/system`.
2. Create a directory `sc.service.wants` in `/etc/systemd/system`.
   You'll have to create symbolic links inside this directory to set up new instances of Sauce
Connect. For example, if you'd like to have two Sauce Connect instances listening on
port 8000 & 8001:
```
    $ cd /etc/systemd/system/
    $ sudo mkdir -p ./sc.service.wants
    $ sudo ln -s /etc/systemd/system/sc@.service ./sc.service.wants/sc@8000.service
    $ sudo ln -s /etc/systemd/system/sc@.service ./sc.service.wants/sc@8001.service
```
3. Add your Saucelabs credentials to `/etc/systemd/system/sc@.service` in the
   service section like this:
```
    Environment=SAUCE_USERNAME=myusername
    Environment=SAUCE_ACCESS_KEY=fd69b0a8-337c-3303-b1bd-xxxxxxxxxxx
```

Starting and Stopping the Service
---------------------
After you have configured the instances, you can start up the new service:
```
    # This is important otherwise systemd won't pick up the new configuration
    $ sudo systemctl daemon-reload
    $ sudo systemctl start sc
    $ sudo systemctl status sc
    ● sc.service - Sauce Connect workers hypervisor
       Loaded: loaded (/etc/systemd/system/sc.service; disabled; vendor preset: enabled)
       Active: active (exited) since Wed 2016-04-06 17:44:37 PDT; 6s ago
    ...

    $ sudo systemctl status 'sc@*'
    ● sc@8000.service - Sauce Connect worker service on port 8000
       Loaded: loaded (/etc/systemd/system/sc@.service; enabled; vendor preset: enabled)
       Active: active (running) since Wed 2016-04-06 17:44:37 PDT; 23s ago
    ...
    Apr 06 17:44:50 usery-BigFatServerzz sc[6772]: 20160406 174450.926 [06772] Sauce Connect is up, you may start your tests.
```
To stop all the instances:
```
    $ sudo systemctl stop sc
```
Managing Individual Instances
-----------------------------
You can also manage invididual instance without impacting the other instances by using the syntax `sc@<PORT NUMBER>`. For example, here's how you'd manage the instance listening on port 8000:
```
    $ sudo systemctl status 'sc@8000.service'
    ● sc@8000.service - Sauce Connect worker service on port 8000
       Loaded: loaded (/etc/systemd/system/sc@.service; enabled; vendor preset: enabled)
       Active: active (running) since Wed 2016-04-06 17:44:37 PDT; 5min ago
    ...


    # This won't affect the other instances
    $ sudo systemctl restart 'sc@8000.service'
    
```
Systemd Tips and Tricks
=====================

When working with systemd I recommend making an alias for systemctl to automate
the configuration reload:

    function sd() {
        sudo systemctl daemon-reload > /dev/null
        sudo systemctl $@
    }

When debugging problems with a unit:

    $ systemctl status unit
    $ journalctl -xe -u unit
