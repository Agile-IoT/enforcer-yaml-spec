# Enforcer Yaml Specification

This document specifies the behaviour of the enforcement proxy for the agile-stack (https://github.com/Agile-IoT/agile-enforcer). To this end, we explain message flow, and the configuration specification. The specification includes a yml file referencing a swagger specification.

## Terms used

**ServiceName:** name used to reach the container in the container network
(internal docker or balena network).  In the example spec in this repository,
we have two sample container names, agile-core and agile-pap, in the top level
hierarchy of the yml file.

**OperationId**: identifier for a single call from the swagger
specification. In the case of agile-core.yml a valid operationId is
“Status” where the HTTP request (GET) to the URL
'/device/{deviceId}/status' is specified.

**MappedKey**: The value for each key should be composed based on the
specified pattern, including fixed strings, and fields specified in the
swagger API spec referenced by the OperationId

**Path:** File path for the yaml file containing the swagger yaml specification for the ServiceName where it is included in.

## Message Flow

The enforcer needs to get HTTP requests from the external network interface that contain an Authorization bearer HTTP header. This header shoud be passed to the agile-security component to get the currentUserInfo. This ensures that users are logged in. An example is available in the authentication middleware agile-ui:

https://github.com/Agile-IoT/agile-ui/blob/master/server.js#L14

Requests should be mapped to the ServiceName such that requests starting with the serviceName in the path are forwarded to that container. For examples, see the agile-ui current proxying behaviour:

https://github.com/Agile-IoT/agile-ui/blob/master/server.js#L54

For example, a request starting with /agile-core/ should be forwarded to agile-core container in the local container network, if the policy decision call returns true. Specifically, if the enforcer gets a request to ``/agile-core/device/``, it must be forwarded to ``/device/`` to the agile-core sevice.

Then, the enforcer must use the swagger specification to obtain relevant parameters of each call and create an object containintg entityId, entityType, field and method, according to the configuration provided. These four parameters should be passed the agile-sdk to evaluate a given policy in the agile-security PDP (https://github.com/Agile-IoT/agile-sdk/blob/master/DOCUMENTATION.md\#agile.policies.pdp.evaluate).

The  enforcer should send the request with all the headers, body, etc. to the URI mentioned before (removing the component's name) to the port specified for each service (ServiceName-> port in the configuration below). So, to continue the example mentioned before, if the  ``/agile-core/device/`` request is received by the enforcer and it agile-core has the port 3300 specified, it should forward the request to ``agile-core:3300/device/`` (an internal service only reachable from the container network inside the gateway).


If the policy decision point allows the interaction, the proxy forwards the exact same request (including headers, body, etc.) to the destination service (which is reachable under the ServiceName in the container network).

A the enforcement is done as a stand-alone service: this implies that the service needs to provide the proper CORS headers to allow cross-origin requests from external domains loading pages, e.g. the agile-ui. 


## Configuration
This section describes the specification of the configuration files used by the agile-enforcer to map requests sent to several services running in the gateway to policy decisions performed by agile-security.

This repository has a description of the configuration format, and an example in ``sample-spec.yaml``



The YML file contains multiple ServiceName(s) in the top level. There are two kinds of services: services that are subject to enforcing, or those that are whitelisted, i.e. not requiring any check with the security framework. If the service is whitelisted it should have the following configuration:
 -   the port where the service API is available  
 -   whitelisted: yes

Each ServiceName needs to have:

-   a pointer in the local file system to the swagger specification of that service under swagger\_api\_spec.
-   the port where the service API is available  
-   A list of calls, where each call is identified by the swagger
    * OperationId (unique in the context of the above
     swagger\_api\_spec), and each call has:

    *   entityId: MappedKey

    *   entityType: MappedKey

    *   Field: MappedKey

    *   Method: MappedKey

-   All the above keys must be sent in the JSON payload for the policy decision call to agile-security:
    *  Agile pdp documentation https://github.com/Agile-IoT/agile-sdk/blob/master/DOCUMENTATION.md\#agile.policies.pdp.evaluate

***Yml format***

**ServiceName1:**

 swagger\_api\_spec: **Path1**

 port: **port1**

 port: **PortNumber**

 **OperationId1:**

   entityId: **MappedKey**

   entityType: **MappedKey**

   field: **MappedKey**

   method: **MappedKey**

 **OperationId2:**

   entityId: **MappedKey**

   entityType: **MappedKey**

   field: **MappedKey**

   method: **MappedKey**

**ServiceName2:**
   
   whitelisted: **yes**
   
   port: **port2**
…

**ServiceNameN:**

swagger\_api\_spec: **PathN**

port: **portN**


 **OperationIdM:**

  entityId: **MappedKey**

   entityType: **MappedKey**

   field: **MappedKey**

   method: **MappedKey**
