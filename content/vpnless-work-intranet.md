+++
title = "VPN-less Work Intranet Access"
date = 2020-06-07
draft = true
[taxonomies]
tags = ['code']
+++

[![](https://1.bp.blogspot.com/-JI6Q_2wu2N8/Xt1dnYWZjWI/AAAAAAAAJ1A/un3jD3mqpaYu14wZ2CAtw0KhCszXzKaTQCK4BGAsYHg/d/SOCK5%2Bover%2BSSH.png)](https://www.blogger.com/blog/post/edit/8646226552989795436/8082752733153501299#)

  

I recently started working for a European company. I live in the US, so they shipped me a work laptop, but it took almost a month after my start date to arrive. As a temporary solution, I was given RDP access to a virtual machine inside the corporate intranet, but with only two cores and a transatlantic ping, it immediately proved inadequate for software development.

  

Meanwhile at home I have screaming a 32-core Threadripper with 64GB of memory, and I greatly prefer to develop on it. Now work has a VPN client, but IT policy prohibits connecting personal devices. Instead, I used the following procedure to set up the topology pictured above.

  

After following this procedure, I can access the company's TFS (Team Foundation Server), pull and push code with git, participate in pull requests, pull company NuGet packages, and reach team wiki pages, all from my personal machine.

  

**Warning**: The procedure described below may or may not violate your company's IT policies. We're creating what your company may view as an enterprise backdoor. Please verify with the appropriate people in your company before trying it.

  

**Summary**

  

This guide shows how to access work intranet resources e.g. TFS and wiki pages, from a home computer without a VPN.

  

  

**SSH Server**

  

On your home machine, setup an SSH server, optionally with public key auth. Here's some help for Windows 10:

  

> [https://github.com/PowerShell/Win32-OpenSSH/releases](https://www.blogger.com/blog/post/edit/8646226552989795436/8082752733153501299#)
> 
> [https://docs.microsoft.com/en-us/windows-server/administration/openssh/openssh_install_firstuse](https://www.blogger.com/blog/post/edit/8646226552989795436/8082752733153501299#)
> 
> [https://docs.microsoft.com/en-us/windows-server/administration/openssh/openssh_keymanagement](https://www.blogger.com/blog/post/edit/8646226552989795436/8082752733153501299#)

  

  

**SSH Tunnel**

  

Using Remote Desktop, on the remote virtual machine, create a SOCKS5 reverse SSH tunnel:

  

> ssh -R 6666 -i id_rsa johndoe@my-dns-name.com -p 2323 
> 
> johndoe@localhost C:\Users\JohnDoe>

  

Notes:

-   If you don't have a DNS name (e.g. my-dns-name.com), use your public IP address. You can find it by Googling "my ip".

> ssh -R 6666 -i id_rsa johndoe@111.111.111.111 -p 2323 

-   If you haven't set up public key auth, omit the -i argument. You will be prompted for a password.

> ssh -R 6666 johndoe@111.111.111.111 -p 2323 

-   Be sure to setup port forwarding on your home router. I have publc port 2323 mapped to port 22 on my home machine.
-   Port 6666 is not magic. You can use any port above 1024 without admin access.

Test SOCKS5

  
On your home machine, test the SOCK5 connection.  
  

Verify your real IP address:

> C:\›curl ifconfig.io

> 111.111.111.111 

Verify your tunneled IP address:

> C:\›curl --socks5 localhost:6666 ifconfig.io
> 
> 222.222.222.222 // This is the Virtual Machine's IP address.

**Configure Apps**

  

  

> **DNS**

  

1. Download DNS2SOCKS. This app pipes all DNS queries through the SOCK5 proxy.

[https://sourceforge.net/projects/dns2socks/](https://www.blogger.com/blog/post/edit/8646226552989795436/8082752733153501299#)

  

2. Run DNS2SOCKS

Note, in the command below, 192.168.1.1 points to my home router.

You could use e.g. Google DNS at 8.8.8.8.

  

            DNS2SOCKS.exe /la:socks.log 127.0.0.1:6666 192.168.1.1:53 127.0.0.1:53  
            DNS2SOCKS V2.1 (free software, use parameter /? to display help)  
            SOCKS server 127.0.0.1 port 6666  
            DNS server   192.168.1.1 port 53  
            listening on 127.0.0.1 port 53  
            cache enabled  
            authentication disabled  
            EDNS client subnet disabled

  

3. Set your network adapter to use 127.0.0.1 as the DNS server.

  

Open Network Connections:

                ncpa.cpl

Right click on the adapter, e.g. Ethernet or Wi-Fi.

Click Properties

Select "Internet Protocol Version 4 (TCP/IPv4)"

Click Properties

Under "Use the following DNS server addresses:", enter 127.0.0.1.

Optionally set an alternate server e.g. 8.8.8.8.

Click OK to close the "Internet Protocol Version 4 TCP/IPv4 Properties" dialog.

Click OK to close the adapter properties dialog.

  

4. Test that you can resolve hosts at the company, e.g. TFS.

            C:\>nslookup tfs.example.com  
            Server:  localhost  
            Address:  127.0.0.1  
            Non-authoritative answer:  
            Address:  172.25.1.75

  

> **HTTP**

  

> Since all not apps support SOCKS5, e.g. Visual Studio Teams Explorer, while others have buggy support (such as [git](https://www.blogger.com/blog/post/edit/8646226552989795436/8082752733153501299#)), we need forward HTTP/HTTPs traffic through SOCKS5.

> Install Privoxy: [https://www.privoxy.org/](https://www.blogger.com/blog/post/edit/8646226552989795436/8082752733153501299#)
> 
> Start Privoxy
> 
> Configure Privoxy
> 
> > Open config.txt (Edit -> Open Main Configuration)
> 
> > Add the line:
> 
> > > forward-socks5 / 127.0.0.1:6666 .
> 
> Restart Privoxy
> 
> Configure apps to use https://127.0.0.1:8118.
> 
> Use 127.0.0.1, not localhost, since localhost may resolve to the SOCKS5 server.

  

  

> **git**

  

1. On your home machine, setup git to use the HTTP proxy.

  

                // All repos  
                C:\>git config --global http.proxy http://127.0.0.1:8118  
                C:\>git config --global https.proxy http://127.0.0.1:8118  
                  
                // Or just this repo  
                cd C:\Users\JohnDoe\repo  
                C:\>Users\JohnDoe\repo>git config http.proxy https://127.0.0.1:8118  
                C:\>Users\JohnDoe\repo>git config https.proxy https://127.0.0.1:8118

  

Unset with

  

                    git config --global --unset https.proxy  
                    git config --global --unset http.proxy

It may be helpful to store your credentials. You should get a GUI dialog prompt.

  

                cd repo  
                git config --global credential.helper store  
                git pull  
                Username for 'https://tfs.example.com': user@example.com  
                Password for 'https://user@example.com@tfs.example.com':

  

To change these values later, open the Start Menu and search for "Credential Manager"

  

  

> **Chrome**

  

1. Install the SOCKS proxy extension by Hotplate Labs.

  

[https://chrome.google.com/webstore/detail/socks-proxy/odiakldnmmpjabkemfboijigageaelcn?hl=en](https://www.blogger.com/blog/post/edit/8646226552989795436/8082752733153501299#)

  

2. Set the extension to use the SOCK5 proxy port, e.g. 6666.

Right click on the extension icon and click Options.

Type the port into the text box that appears.

  

Try to load some intranet pages.

  

https://tfs.example.com/

  

Check your IP address

  

[https://www.google.com/search?q=whatsmyip](https://www.blogger.com/blog/post/edit/8646226552989795436/8082752733153501299#)

"222.222.222.222"

  

> **Visual Studio 2019 (for e.g. Team Explorer)**

  

1. Open the file _C:\Program Files (x86)\Microsoft Visual Studio\2019\Community\Common7\IDE\devenv.exe.config_

2. Add the following under "<system.net>"

  

            <defaultProxy useDefaultCredentials="true" enabled="true">  
                <proxy proxyaddress="http://127.0.0.1:8118" />  
            </defaultProxy>

  

Before:

  

                <system.net>  
                    <settings>  
                        <ipv6 enabled="true"/>  
                    </settings>  
                </system.net>

  

After:

  

                <system.net>  
                    <defaultProxy useDefaultCredentials="true" enabled="true">  
                        <proxy proxyaddress="http://127.0.0.1:8118" />  
                    </defaultProxy>  
                    <settings>  
                        <ipv6 enabled="true"/>  
                    </settings>  
                </system.net>

  

3. Restart Visual Studio.

  

4. In Team Explorer, connect to the server e.g. at the URL  _https://tfs.example.com/tfs/_

  

  

***
**NuGet**

1.  Open e.g.  _C:\Users\JohnDoe\AppData\Roaming\NuGet\nuget.config_
2. Add the configuration below

``` xml
 <configuration>
 <!-- stuff --> 
  <config>
    <add key="http_proxy" value="http://127.0.0.1:8118" /> 
  </config>
  <!-- stuff -->
</configuration>
```
  
***
**Sources**

[https://serverfault.com/questions/361794/with-ssh-only-reverse-tunnel-web-access-via-ssh-socks-proxy](https://www.blogger.com/blog/post/edit/8646226552989795436/8082752733153501299#)
[https://www.reddit.com/r/techsupport/comments/4j0l35/windows_10_route_all_traffic_through_socks5_proxy](https://www.blogger.com/blog/post/edit/8646226552989795436/8082752733153501299#)
[https://superuser.com/questions/370930/ssh-reverse-socks-tunnel](https://www.blogger.com/blog/post/edit/8646226552989795436/8082752733153501299#)
[https://stackoverflow.com/questions/15227130/using-a-socks-proxy-with-git-for-the-http-transport](https://www.blogger.com/blog/post/edit/8646226552989795436/8082752733153501299#)
 [https://cstan.io/?p=11673&lang=en](https://www.blogger.com/blog/post/edit/8646226552989795436/8082752733153501299#)
[https://stackoverflow.com/questions/39345249/visual-studio-community-proxy](https://www.blogger.com/blog/post/edit/8646226552989795436/8082752733153501299#)

[https://stackoverflow.com/questions/9232160/nuget-behind-a-proxy](https://www.blogger.com/blog/post/edit/8646226552989795436/8082752733153501299#)

***
### Discussion
Please feel free to start a discussion [on GitHub](https://github.com/slater1/blog/issues).

***
[Main page](index.html)
