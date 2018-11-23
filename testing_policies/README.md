These files have an easy way to test a policy that evaluates to true, and another one that evaluates to false using agile-security. This is what you need to do:

1) apply the update in the security file configuration in $DATA/security/idm/conf/agile-idm-core-conf.js . -> this update will create a user called bob in agile-security on the next reboot of the container

2) login as bob in the user interface (port 8000 if you have the whole agile-stack).

3) set the token that you see in the URL and the location of the gateway in the true_false.js file

4) run the true_false.js file which will give you the result of [true, false] because bob execute the first call but not the second one.


In this setup (with the user bob) you can authenticate as bob and use both policies such that when the API of agile-security is invoked from the enforcement point, it obtains true, or false, for testing purposes
.

