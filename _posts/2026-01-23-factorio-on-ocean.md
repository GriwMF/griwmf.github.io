---
layout: post
title: "Running Factorio on DigitalOcean"
date: 2026-01-23 13:00:00 -0000
categories: games devops
tags: [factorio, digitalocean, server, linux, gaming]
---

Factorio is the game that can teach you a lot about architecture. Starting simple, you always underestimate the complexity of your factory. Each time you rebuild it hoping this one would be "it" until it's not. I was leaning too much on the side of simplicity and minimalism, and my factory taught me that we always need to look for balance. Sometimes scaling your system requires full architectural redesign. It works the same way in software development. Keep in mind, though, that in the world of startups, the small working MVP is still better than the over-engineered perfect system that never ships.

Anyway, let's get back to the topic. I wanted to play Factorio with my friends, so I decided to rent a server on DigitalOcean. This way it will be always online, anyone can join anytime and everybody shares the same world and progress.

## Choosing the Droplet
Actually, it's not that clear what kind of server you need for Factorio. There are different recommendations on the internet and they are constantly optimizing the game. Also price changes drastically depending on the droplet type. The idea now is to start with the smallest one - it should be enough to configure and test the connection, but not for actual gaming. I think we can then test and ugrade it until we find the one that works for 2-4 players. Speaking of today, it would be 512 MB / 1 CPU, 10 GB SSD Disk, 500 GB transfer for $4/month (wasn't a perfect decision as you can see below).

It's my first time using DigitalOcean, but creating a droplet was pretty straightforward. Choose the plan, add SSH keys and pick the image. I want to use Debian by the way. Two reasons - one I don't like that they ship Snap packages by default in Ubuntu, and second - I never used Debian on its own, so it's a good opportunity to try it out.

> **DigitalOcean NOTE:** I'm not able to find dark mode for the website. Do they have it? Darkreader works fine, but still I fell they should have it.
> The droplet system seems to try to be simple, but it's a bit comfusing at first. You have only predefined plans, you can then resize the droplet between those plans, but you can keep the disk size. And if you've increased the disk size, you can't go back. As for me the AWS/Oracle way of defining your own configuration seems more natural.
> Oh, yeah, if you are new to DigitalOcean, you can use my [referral link](https://m.do.co/c/123c3d010fd7) to get $200 credit for 60 days and try it out.

I've probably missed it, but I haven't seen a note on how to connect to the droplet on the page. Or maybe it's only in the documentation. Anyway, there is an IP address assigned to your droplet on the dashboard, and I've guessed correctly that simple `ssh root@your_droplet_ip` would work. You should've added your SSH key during the droplet creation of course.

## Setting up Factorio Server
Docker is an obvious easy way to run it. However, I have limited disk space and just want more control over the installation for fun. So I decided to install it manually.
I'm going to follow the official [Dedicated/Headless server guide](https://wiki.factorio.com/Multiplayer) with minimal adjustments. I need to generate a custom map with specific settings like more density of resources and add some mods.
As we're on root user, we should probably create a separate user for running the game server. It's a boring part but we'll do it anyway. Let's call it `factorio`.

```bash
adduser --system --group --home /opt/factorio --shell /bin/bash factorio
```

It will create a system user with no password, corresponding group and home directory. System users are used for running services and daemons, so they don't have login capabilities. We need --shell to be able to run commands as this user later.

Now let's switch to this user and download the Factorio server files.
```bash
su - factorio
wget https://factorio.com/get-download/stable/headless/linux64 -O factorio.tar.xz
tar -xvf factorio.tar.xz
mv factorio/* .
rmdir factorio
rm factorio.tar.xz
```

Now we have the game files in `/opt/factorio`. Let's run the server to ensure everything works.
```bash
./bin/x64/factorio --create ./saves/my-save.zip
./bin/x64/factorio --start-server ./saves/my-save.zip
```

And here we actually hit the first problem. The server won't start because of insufficient memory. So we need to upgrade our droplet to at least 1 GB of RAM. I've upgraded to 1 GB of RAM for $6/month plan using web dashboard. After the resize, the server started just fine.

You'll probably want to adjust some settings like public visibility:
```bash
cp data/server-settings.example.json data/server-settings.json
vi data/server-settings.json # you could use nano if you prefer
./bin/x64/factorio --start-server ./saves/my-save.zip --server-settings data/server-settings.json
```
Yay! The server is running, I've already mined a couple of iron ores. By the way, to connect you just need to select "Multiplayer" -> "Connect to address" in the game menu and enter the droplet IP address.

## Safety First - Setting up Firewall

One more thing - it seems that DigitalOcean droplets have no firewall at all (at least for my debian image), so let's allow only necessary ports. Exit to root if you're still in factorio user. You can install ufw, but here is a quick way to do it with iptables:
```bash
~# iptables -A INPUT -i lo -j ACCEPT
~# iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
~# iptables -A INPUT -p tcp --dport 22 -j ACCEPT
~# iptables -A INPUT -p udp --dport 34197 -j ACCEPT
~# iptables -P INPUT DROP
~# iptables -L
Chain INPUT (policy DROP)
target     prot opt source               destination         
ACCEPT     all  --  anywhere             anywhere            
ACCEPT     all  --  anywhere             anywhere             ctstate RELATED,ESTABLISHED
ACCEPT     tcp  --  anywhere             anywhere             tcp dpt:ssh
ACCEPT     udp  --  anywhere             anywhere             udp dpt:34197

Chain FORWARD (policy ACCEPT)
target     prot opt source               destination         

Chain OUTPUT (policy ACCEPT)
target     prot opt source               destination   
```
Here we allow all loopback traffic, established connections, ssh (port 22) and Factorio server port (34197 UDP). Finally we set the default policy to DROP. Make sure ssh and Factorio still works, and then you can save the iptables rules to be persistent after reboot:
```bash
apt-get install iptables-persistent
netfilter-persistent save
```

> **Note:** At this point I had to go to sleep, so my droplet was running overnight and created field says "11 hours ago". The strange thing is that I can not find any info on the bidded price. I still see "Estimated costs: $0.00" on the account dashboard and I wasn't able to find other meaningful billing info. It seems that it will appear later, but it's a bit confusing compared to other cloud providers. I like to see how much I'm spending in the real time.

## Map, Settings and Mods
Now as we have the server running, it's time to configure the last bits. First, you probably want to assign yourself as an admin. To do that, from the factorio home directory, open the server-adminlist.json and add your in-game username as an array:
```bash
vi server-adminlist.json
cat server-adminlist.json
["YourInGameUsername"]
```
Start the server again and use ~ key to open the console and type `/admin`. If everything is ok, you should see the Factorio's admin window.
Next, we want to generate a custom map with specific settings. There are couple ways to do it. You can use the `--map-gen-settings` flag and providing a json file with your settings. You can edit it manually based on example in the data dir, download from the internet or convert from map exchange string using different tools from github. As for me the easiest way is to make a new game in the Factorio client using any settings you want and save the game. I've named mine main.zip. Make sure you've enabled the required mods. Then upload it to the server using scp:
```bash
scp saves/main.zip root@your_droplet_ip:/opt/factorio/saves/
```
And all the mods:
```bash
scp mods/* root@your_droplet_ip:/opt/factorio/mods/
```
Finally, change the owner of the uploaded files to factorio user (you should exit to root first):
```bash
exit
chown factorio:factorio /opt/factorio/saves/main.zip
chown factorio:factorio /opt/factorio/mods/*
su - factorio
./bin/x64/factorio --start-server ./saves/main.zip --server-settings data/server-settings.json
```
Now you should be able to connect to your server with the custom map and mods.

## Autorun on Startup
Last but not least, we want the server to start automatically on droplet reboot. There are different ways to do it, but the most straightforward one is to use systemd. Exit to root and create a new service file `/etc/systemd/system/factorio.service` with the following content:
```ini
[Unit]
Description=Factorio Headless Server
After=network.target

[Service]
User=factorio
Group=factorio
WorkingDirectory=/opt/factorio
ExecStart=/opt/factorio/bin/x64/factorio --start-server saves/main.zip --server-settings data/server-settings.json
Restart=on-failure
RestartSec=5s
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

and then enable and start the service:
```bash
systemctl daemon-reload
systemctl enable --now factorio
systemctl status factorio
```

Checking the logs is possible using journalctl: `journalctl -u factorio -f -n 50` where -f is for follow and -n 50 is to show last 50 lines.

## Conclusion
That's it! Now we have a working Factorio server. It was a bit harder than just using Docker, but much more fun. Not to forget we also know how it works under the hood now. Next steps would be to test the server with friends, monitor performance and upgrade the droplet if needed. I'm also thinking about adding a swap file just in case:
```bash
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab

free              
               total        used        free      shared  buff/cache   available
Mem:          990568      747240       95600        3660      321588      243328
Swap:        2097148           0     2097148

df -h | grep vda  
/dev/vda1       9.7G  3.6G  5.7G  39% /
```
Happy factorying!


