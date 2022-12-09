Host your own website for your self-hosted bitcoin full node. 

Steps
1. Get a Bitcoin Full Node up and running. There are many guides on how to do this online.
2. Git clone this repo in the same environment
3. Create a .env file in project root specifying four variables: 

IP_ADDR (your machine's public IP),

PORT (the port you want to connect on, use 443 for HTTPS. Don't use HTTP because you will be sending sensitive information to your app lke your credentials), 

RPC_PASS (the password defined in your bitcoin.conf to authorize rpc connections),

RPC_USER (the user defined in bitcoin.conf for authorizing rpc connections)

4. To connect using SSH you will need to create a certificate and private key for others to identify your machine and connect securely. Here is a good guide to do so (https://www.digitalocean.com/community/tutorials/how-to-create-a-self-signed-ssl-certificate-for-apache-in-ubuntu-20-04). You can ignore the apache webserver part, because we will be using Node to create an HTTPS server

5. In your router's firewall settings (and possibly also your computer's) port forward connections to port 443 or whatever port you specified to your local machine.
6. Start the app using `sudo node ./bin/www` in project root
7. Access your website via your network's public IP at the specified port.
8. Enjoy!
