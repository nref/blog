This is a guide for anyone using Xamarin and whose machine cannot reach a macOS build host by SSH on port 22.  
  
In my case, I have Xamarin installed on a Windows machine and a macOS guest hosted in QEMU/KVM on a Ubuntu laptop. The Ubuntu laptop is connected to the network through its wireless adapter.  
  

[![](https://1.bp.blogspot.com/-mEuvnQDLehY/Xmj9lEk4lNI/AAAAAAAAJvI/LmIES0c7uWYp5_JCrqkBWOEkSNbT7XAygCLcBGAsYHQ/s1600/Untitled%2BDiagram%2B%25282%2529.png)](https://www.blogger.com/blog/post/edit/8646226552989795436/8218420647288487136#)

  
Wireless adapters cannot bridge to KVM guests, so it is not possible to SSH directly from the Windows machine to the macOS guest.  
  

[![](https://1.bp.blogspot.com/-SFReweMo_9Q/Xmj9wV14YII/AAAAAAAAJvM/48ab93Ez-PAfJ97C-Y5aqYdgykyhM_x9gCLcBGAsYHQ/s1600/Untitled%2BDiagram%2B%25283%2529.png)](https://www.blogger.com/blog/post/edit/8646226552989795436/8218420647288487136#)

  

  
Since Xamarin needs SSH to reach macOS, I use a bag of networking tricks including a reverse SSH tunnel, NAT, and port forwarding to enable Xamarin to reach the macOS guest.  
  

[![](https://1.bp.blogspot.com/-FPTI4_oEsy4/Xmj-w9w1UDI/AAAAAAAAJvc/bEdWKvONImcffa_Kx6LvPhnYgwthifAnACLcBGAsYHQ/s1600/Reverse%2BSSH%2Bbehind%2BNAT.png)](https://www.blogger.com/blog/post/edit/8646226552989795436/8218420647288487136#)

  

  
Disclaimer: Installing macOS on anything but Apple hardware violates the macOS license agreement. Proceed at your own risk.  
  

### Setup Hosts

  

On **Host 1**, install Windows 10 and Visual Studio 2019 with Xamarin  
On **Host 2**, install Ubuntu, KVM and a macOS guest (Host 3): See [here](https://www.blogger.com/blog/post/edit/8646226552989795436/8218420647288487136#).  
On **Host 3**, install Xcode and Visual Studio for Mac  
  

### Network Topology

  

You should now have the following topology. The IP addresses can of course be different than mine.

  

**Host 1**: Windows 10 1809 Running Visual Studio  
IP: 172.16.1.4  
  
**Host 2**: Ubuntu 18.04 LTS running Host 3 in KVM, connected to wifi  
IP: 172.16.1.2  
IP: 192.168.122.1 (NAT with Host 3)  
  
**Host 3**: OS X Mojave virtual machine  
IP: 192.168.122.242 (NAT with Host 2)  
  

### Setup SSH

  
Xamarin communicates with Xcode over SSH, so we need to be able to SSH from Windows to the macOS guest.  
  
On **macOS**, SSH is installed but not running. Navigate to _System Preferences → Sharing →_ check _Remote Login_. Optionally setup public key auth. See [here](https://www.blogger.com/blog/post/edit/8646226552989795436/8218420647288487136#).  
  
On **Windows**, see [here](https://www.blogger.com/blog/post/edit/8646226552989795436/8218420647288487136#). Optionally setup public key auth. It's tricky. [This](https://www.blogger.com/blog/post/edit/8646226552989795436/8218420647288487136#) worked for me.  
  
Test that macOS can reach reach Windows.  
  
**macOS =>** **Windows**: ssh windowsuser@172.16.1.4  
**Windows =>** **macOS**: Not yet (Windows cannot reach macOS behind NAT)  
  

### Create a Tunnel

  

In **macOS**, create a reverse SSH tunnel from port 22 to a free port in Windows, e.g. 40322.  
  
ssh -R 40322:localhost:22 windowsuser@172.16.1.4  
  

[![](https://1.bp.blogspot.com/-_LLLjxUDLaQ/XmF4cyUytAI/AAAAAAAAJtQ/4mdIEDqTxvsadJSZ7_BI7koaBon0k3-wwCLcBGAsYHQ/s640/macos-create-tunnel.png)](https://www.blogger.com/blog/post/edit/8646226552989795436/8218420647288487136#)

  
Never before was I glad to encounter a PowerShell prompt.  
  

[![](https://1.bp.blogspot.com/-1YQ7nh9NBTw/XmF4fY1rnxI/AAAAAAAAJtU/pomyVwPyArA0EY1XlW49GsQr_le9PiSoQCLcBGAsYHQ/s640/macos-tunneled-to-windows.png)](https://www.blogger.com/blog/post/edit/8646226552989795436/8218420647288487136#)

  
Leave this connection open and proceed to the next step.  
  

### Setup Firewall

  
On **Ubuntu**, open the port which Windows will go through to reach macOS.  
  
sudo ufw allow 40322  
  

### Verify Tunnel

  

In **Windows**, test the connection to macOS. Notice that to get to macOS, you SSH from Windows to Windows. The tunnel we created before at port 40322 then takes you to macOS.  
  
ssh macosuser@localhost -p 40322  
  

[![](https://1.bp.blogspot.com/-0gLt2UpypeQ/XmF43ijTo5I/AAAAAAAAJtw/q-0K0UBnD9410n4L2K9HAlL9m3cf7hoAwCLcBGAsYHQ/s1600/test-tunnel.PNG)](https://www.blogger.com/blog/post/edit/8646226552989795436/8218420647288487136#)

  

If the connection succeeds, you'll be greeted by a shell in macOS.

  

[![](https://1.bp.blogspot.com/-6MF37yIdsFg/XmF43KwuzMI/AAAAAAAAJts/qddzVa7nqbo6iq9KdwYDSn2yfxuVnsghQCEwYBhgL/s1600/test-tunnel-success.PNG)](https://www.blogger.com/blog/post/edit/8646226552989795436/8218420647288487136#)

  
This was just a test. It is not necessary to leave this connection open to proceed.  
  

### Port Forward

  

The Xamarin Mac Agent can only connect on port 22, but the macOS host is on 40322.  
  
In **Windows**, in an elevated command prompt or PowerShell instance, forward port 22 to 40322.  
  
netsh interface portproxy add v4tov4 listenport=22 listenaddress=127.0.0.1 connectport=40322 connectaddress=127.0.0.1  
  

### Connect Xamarin to Mac

  
In **Windows**, in Visual Studio, connect to the macOS Xcode server. You'll have to use user/pass auth.  
  
Host: 127.0.0.1  
User: (macOS user)  
Pass: (macOS password)  
  

[![](https://1.bp.blogspot.com/-8hQLYxNIWtc/XmF42pamYqI/AAAAAAAAJt0/EAjVaFZAqgcHT7REQ5TIXYT3FP0x07syQCEwYBhgL/s640/add-mac.PNG)](https://www.blogger.com/blog/post/edit/8646226552989795436/8218420647288487136#)

  

[![](https://1.bp.blogspot.com/-ynNKLX8juno/XmF42rQUc0I/AAAAAAAAJt8/9F9YAKTlJk4-s0X2X3ECgneWPaIBtwnyACEwYBhgL/s640/add-mac-authenticate.PNG)](https://www.blogger.com/blog/post/edit/8646226552989795436/8218420647288487136#)

  

[![](https://1.bp.blogspot.com/-uMY7BdcprEo/XmF42v1cmOI/AAAAAAAAJt4/aTlNYXtNifEFBqmlQkniKgiy6kWQwd_7gCEwYBhgL/s640/add-mac-success.PNG)](https://www.blogger.com/blog/post/edit/8646226552989795436/8218420647288487136#)

  
  
Xamarin may ask to install a few things on the macOS host.  
  
Happy coding!  
  

### Resources

  

1.  [https://wiki.libvirt.org/page/Networking#Bridged_networking_.28aka_.22shared_physical_device.22.29](https://www.blogger.com/blog/post/edit/8646226552989795436/8218420647288487136#)
2.  [https://www.howtogeek.com/428413/what-is-reverse-ssh-tunneling-and-how-to-use-it](https://www.blogger.com/blog/post/edit/8646226552989795436/8218420647288487136#)
3.  [https://stackoverflow.com/a/53841245](https://www.blogger.com/blog/post/edit/8646226552989795436/8218420647288487136#)

***
### Discussion
Please feel free to start a discussion [on GitHub](https://github.com/slater1/blog/issues).

***
[Main page](index.html)
