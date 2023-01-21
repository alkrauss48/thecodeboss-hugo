---
title: How Public Key and Symmetric Key Encryption Work
date: "2016-08-11"
categories:
- Blog
tags:
- How Things Work
draft: "false"
---
Public-key encryption and symmetric-key encryption are two of the most fundamental cryptographic systems out there and they’re also the driving force behind the [Transport Layer Security](https://en.wikipedia.org/wiki/Transport_Layer_Security) (TLS) protocol. TLS is an evolution of Secure Sockets Layer, or SSL, and it defines how applications communicate privately over a computer network (the most famous network being – yup, you guessed it – the Internet). By interacting with a server that employs TLS, you can be guaranteed that the information you are sending over from your browser client to that server is fully encrypted in such a way that only the server can decrypt it. What this means is that if some evil hacker really wants to, they’ll be able to see _that_ you’re communicating with the server – but there’s no way for them to actually see what you’re sending over or what the server is sending back to you.

What I want do dig into is how this encryption works. How do I know that my communication with the server can only be decrypted by that server, and vice versa? We’re not going to get into the [TLS handshake](https://msdn.microsoft.com/en-us/library/windows/desktop/aa380513(v=vs.85).aspx) here, as there are _tons_ of other resources that describe that in full detail, but I want to get into these two fundamental encryption algorithms.

Basic Encryption
----------------

While encryption got its start in modern warfare (the [enigma machine](https://en.wikipedia.org/wiki/Enigma_machine) is a really cool example of this), more recently if you hear people talking about it, they’re probably talking about cyber-security. Before we get deeper into symmetric-key and public-key encryption, I need to make sure we’re all on the same page as far as understanding what encryption in general is. [Encryption](https://en.wikipedia.org/wiki/Encryption) is the process of encoding a message in a manner that only authorized parties can read it, and not anyone else on the way such as attackers. How you encrypt your message is determined by which [cipher](https://en.wikipedia.org/wiki/Cipher_suite) you use, such as AES or RSA. A cipher is the algorithm which converts your message into [ciphertext](https://en.wikipedia.org/wiki/Ciphertext), which looks like a bunch of jumbled up text to humans. This ciphertext eventually gets decrypted back into the original message once it has reached the authorized recipient. In order to encrypt or decrypt a message, you need a _key_ – which is just a string of characters. How this key is generated and used is determined by the cipher that’s agreed upon by both parties. Browsers have multiple cipher suites that they support, and when making a request to a server, they will provide the server a list of these suites so that the server can select one that it also supports.

Encryption differs from a cryptographic [hash function](https://en.wikipedia.org/wiki/Cryptographic_hash_function), in the sense that an encrypted message is intended to be encoded _and_ eventually decoded to reveal the initial message, while a hashed message is practically impossible to decode. Hash functions convert a message into a fixed length of text – usually somewhere between 128-256 bits – and they’re extremely useful, especially with password management. A common and secure way for applications to store your password is as hashed versions of the password. That way the application can validate your password when you log in by hashing it and verifying it with the hash it has stored, and the service never has to store your original password (this is a big safeguard if that service is ever attacked). Hashing algorithms are also used when creating message digests, message authentication codes (MACs), and digital signatures – all of which pertain to TLS.

Here’s an example of a hash function from the [SHA](https://en.wikipedia.org/wiki/Secure_Hash_Algorithm) family, designed by the very lovely United States NSA:

{{< highlight bash "linenos=table" >}}
> openssl sha1 test.txt # Contains "Hello World!"
 
SHA1(test.txt)= a0b65939670bc2c010f4d5d6a0b3e4e4590fb92b
{{< / highlight >}}

Because hash functions are only one way (meaning they can’t be decrypted), there’s no way we can get “Hello World!” out from that message. However, if our message were instead _encrypted_ and we had the key, then we could decrypt the encoded message. Now that we understand the basics of encryption – and how it differs from hash functions – let’s get deeper into symmetric-key and public-key encryption.

Symmetric Key Encryption
------------------------

Let’s start off with symmetric-key encryption because it’s the easier of the two to understand. Symmetric-key encryption only involves one key, and you just use that one key to both encrypt and decrypt a message. That’s where the name **symmetric** comes from – because it’s used for both.

To encrypt a message using symmetric-key encryption, you must first select a cipher. The [AES](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard) cipher suite is one of the most commonly used symmetric-key ciphers since it’s secure and freely available. From there, you create a key – and that’s all you need to get started. Here’s an example in ruby using the [OpenSSL](http://ruby-doc.org/stdlib-2.0.0/libdoc/openssl/rdoc/OpenSSL.html) module (part of the core Ruby library) and the 256 bit AES cipher.


{{< highlight ruby "linenos=table" >}}
# app.rb

require 'openssl'
cipher = OpenSSL::Cipher.new('aes-256-cbc')
cipher.encrypt # Set the mode to encrypt
cipher.update "Hello World!"
puts cipher.final
# prints encrypted string
SHA1(test.txt)= a0b65939670bc2c010f4d5d6a0b3e4e4590fb92b
{{< / highlight >}}

We now have an encrypted message – but we didn’t store the key or the encrypted string, so this example isn’t of any use for us. Let’s update this code to save the key and the encrypted string so that we can actually decrypt this message:

{{< highlight ruby "linenos=table" >}}
# app.rb

require 'openssl'
cipher = OpenSSL::Cipher.new('aes-256-cbc')
cipher.encrypt # We are encrypting
key = cipher.random_key
cipher.update "Hello World!"
encrypted_string = cipher.final
 
# -- Assuming a new machine
 
cipher2 = OpenSSL::Cipher.new('aes-256-cbc')
cipher2.decrypt # We are decrypting
cipher2.key = key
cipher2.update encrypted_string
puts cipher2.final
# prints 'Hello World!'
{{< / highlight >}}

And there we have it – solid, secure symmetric encryption. During the TLS handshake, the client creates a symmetric key and gives it to the server, and all further communication occurs through symmetric encryption. There’s one _big_ issue though – how do we securely transport the key to the server? We can’t send it plain text, so we have to encrypt it somehow in a way that only the server can decrypt. We can’t do this with symmetric-key encryption because there’s no shared key between the server and the client yet; to accomplish this, we need to use public-key encryption.

Public Key Encryption
---------------------

Public-key encryption is also known as **asymmetric encryption** because instead of just one key, you have two keys: a public key and a private key. Both of these keys belong to you, and you keep your private key private (so that no one can see it) and your public key open (so that everyone can see it). These two keys are mathematically related based on what cipher you use (the most common is the [RSA](https://en.wikipedia.org/wiki/RSA_(cryptosystem)) cipher suite) in such a way that the private key is the only key that can decrypt what the public key encrypts, and the public key is the only key that can decrypt what the private key encrypts.

It works like this: Say you and I are communicating securely, and we both have our own public and private keys. You want to send me a message, and you can see my public key (but not my private key). We agree on a cipher, and you encrypt a message using **my public key**. You then send me that message. If that message gets intercepted by an attacker, then it’s no big deal because only my private key can decrypt it – which the attacker doesn’t have access to. Once I receive your message, I can decrypt it using **my private key**. If I want to respond to you, then I follow the same process except that I use **your public key** to encrypt the message, and you will then use **your private key** to decrypt it. This works flawlessly as long as you’re using a secure cipher and you keep your private key absolutely private.

To demonstrate public key encryption, we’re going to use a utility called [GPG](https://www.gnupg.org/) – which is the open source version of [PGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy) (Pretty Good Privacy). Let’s generate a private and public key pair first:

{{< highlight bash "linenos=table" >}}
gpg --gen-key
{{< / highlight >}}

This will generate your private key. You’ll have to answer a lot of questions such as your name, email address, and passphrase for your key, but we’re going to use the defaults for everything else (e.g. RSA cipher, 2048 bits, no expiration date).

Now to generate our public key:

{{< highlight bash "linenos=table" >}}
gpg --armor --output pubkey.txt --export 'Your Name'
{{< / highlight >}}

This will create the file **pubkey.txt** in your working directory. Now you can send this public key to everyone, and they can add it to their list of keys that they support – like so:

{{< highlight bash "linenos=table" >}}
gpg --import pubkey.txt
{{< / highlight >}}

Now whenever someone wants to encrypt something and send it to you, they automatically have your public-key listed and just need to call it via your email address that you used earlier. Let’s say that you want to send me a file called **test.txt**, and you have my public key which is set up under the email address alkrauss48@gmail.com. That would look like this:

{{< highlight bash "linenos=table" >}}
gpg --encrypt --recipient 'alkrauss48@gmail.com' test.txt
{{< / highlight >}}

This will create a file called **test.txt.gpg** that is encrypted with my public key according to the 2048 bit RSA cipher (assuming that’s the cipher my keys are based on). You can now send me this file, and I can decrypt it like this:

{{< highlight bash "linenos=table" >}}
gpg --output test-decrypted.txt --decrypt test.txt.gpg
{{< / highlight >}}

Because that file was specifically encrypted with my public key, I can use my private key to decrypt it and dump it into a file called **test-decrypted.txt**. And that’s it! It doesn’t matter if an attacker got access to that file mid-transport because only the private key can decrypt it – and I’m the only person who has that.

Putting Them Together
---------------------

The TLS handshake incorporates both symmetric and public-key encryption – and you might wonder why. Here’s the deal: when you make a request to a website that has a certificate, it will always have a public and a private key pair. But your browser _doesn’t_ have a key pair, so strictly using public-key encryption is out of the question because only the browser would be able to encrypt things to the server – and not vice versa. Because of this, we have to rely on symmetric key encryption – but there’s still the problem that we alluded to above, which is how do you get the symmetric key to both parties in a secure manner? The solution: we use both types of encryption. Here’s a brief overview of the encryption procedures in TLS:

*   The client sends a “Client Hello” message to the server, with a list of which cipher suites the client supports.
*   The server responds with a “Server Hello” message as well as its certificate containing the public key, and it also selects a cipher suite that the client and server will use from then on.
*   Based on the cipher suite, the client creates a symmetric key, encrypts it with the server’s public key, and sends it back to the server.
*   The server decrypts the message with its private key, and now both the client and the server have the shared symmetric key.
*   All communication between the client and the server will now use this shared secret key with symmetric encryption.

This is by no means a list of everything that happens during the TLS handshake – it’s only meant to describe how the encryption protocols are set up between the client and the server. If you want more detail about how TLS works, I encourage you to google it; there are tons of resources out there written by people way smarter than me.

Conclusion
----------

You might not ever have to use encryption in your day-to-day job, but it’s a topic that I find really interesting and important if you’re in the tech industry. Most of the websites we deal with are quickly switching to using certificates, which means all of your traffic with those websites is encrypted – and now you know a little bit about how that works! You could also be cool nerd kid and create a key pair, trade public keys with a buddy, and asymmetrically encrypt all of your files between one another with the GPG tool. You’re definitely a winner in my book if you do that!
