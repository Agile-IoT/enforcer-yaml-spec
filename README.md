# Enforcer Yaml Specification

This document specifies the behaviour of the enforcement proxy for the agile-stack [agile-enforcer](https://github.com/Agile-IoT/agile-enforcer). To this end, we explain message flow, and the configuration specification. The specification includes a yml file referencing a swagger specification.

## Terms used

**ServiceName:** name used to reach the container in the container network
(internal docker or balena network).  In the example spec in this repository,
we have several sample container names, agile-core, agile-pap and other-service in the top level
hierarchy of the yml file.

## Message Flow

The enforcer needs to get HTTP requests from the external network interface that contain an Authorization bearer HTTP header. This header shoud be passed to the agile-security component to get the currentUserInfo. This ensures that users are logged in. An example is available in the authentication middleware [agile-ui](https://github.com/Agile-IoT/agile-ui/blob/master/server.js#L14)

Requests should be mapped to the ServiceName such that requests starting with the serviceName in the path are forwarded to that container. For examples, see the agile-ui [current proxying behaviour](https://github.com/Agile-IoT/agile-ui/blob/master/server.js#L54)

For example, a request starting with /agile-core/ should be forwarded to agile-core container in the local container network, if the policy decision call returns true. Specifically, if the enforcer gets a request to `/agile-core/device/`, it must be forwarded to `/device/` to the agile-core sevice.

Then, the enforcer will obtain relevant parameters of each call based on its own configuration file and create an object containintg entityId, entityType, field and method, according to the configuration provided. These four parameters should be passed the agile-sdk to evaluate a given policy in the [agile-security PDP](https://github.com/Agile-IoT/agile-sdk/blob/master/DOCUMENTATION.md#agile.policies.pdp.evaluate).

The  enforcer should send the request with all the headers, body, etc. to the URI mentioned before (removing the component's name) to the port specified for each service (ServiceName-> port in the configuration below). So, to continue the example mentioned before, if the  `/agile-core/device/` request is received by the enforcer and it agile-core has the port 3300 specified, it should forward the request to `agile-core:3300/device/` (an internal service only reachable from the container network inside the gateway).

If the policy decision point allows the interaction, the proxy forwards the exact same request (including headers, body, etc.) to the destination service (which is reachable under the ServiceName in the container network).

The enforcement is done as a stand-alone service: this implies that the service needs to provide the proper CORS headers to allow cross-origin requests from external domains loading pages, e.g. the agile-ui.  The CORS headers could be taken from an environment variable for example.

## Configuration

This section describes the specification of the configuration files used by the agile-enforcer to map requests sent to several services running in the gateway to policy decisions performed by agile-security.

This repository has a description of the configuration format and an example in `sample-spec.yaml`

The YML file contains multiple ServiceName(s) in the top level. There are two kinds of services: services that are subject to enforcing, or those that are whitelisted, i.e. not requiring any check with the security framework. If the service is whitelisted it should have the following configuration:

- the port where the service API is available
- whitelisted: yes

Each ServiceName needs to have:

- The `port` where the service API is available
- A list of `calls`, where each call is identified by the swagger path and each call has:
  - `get`: http method | get, post, put, delete
    - `entityId`: string | list of <string | object{path: string}>
    - `entityType`: string | list of <string | object{path: string}>
    - `field`: string | list of <string | object{path: string}>
    - `method`: string | list of <string | object{path: string}>
    - All the above keys must be sent in the JSON payload for the policy decision call for [evaluation in agile-security](https://github.com/Agile-IoT/agile-sdk/blob/master/DOCUMENTATION.md/#agile.policies.pdp.evaluate)

The `path` property for any object must contain the path where the specified value needs to be taken, which must be one of:

- `url`: The value will be taken from the URL path (every parameter available in the Swagger API Spec, e.g. `/device/{deviceId}/status`)
- `query`: The value will be taken from the URL query params (every parameter in the query of the request, e.g. `...?foo=bar&jeez=us`)
- `body`: The value will be taken from the body params (e.g. every parameter available in the body of the request, if there's any)

***Yml format***

```yml
   ServiceName1: # e.g. agile-core | agile-ui | ...
      port: 1337 # port number
      calls:
         /first/path:
            get:
               entityId: # string | list of <string | object{path: string}>
               entityType: # string | list of <string | object{path: string}>
               field: # string | list of <string | object{path: string}>
               method: # string | list of <string | object{path: string}>
         /second/path:
            post:
               entityId: # string | list of <string | object{path: string}>
               entityType: # string | list of <string | object{path: string}>
               field: # string | list of <string | object{path: string}>
               method: # string | list of <string | object{path: string}>
   ServiceName2: # agile-core | agile-ui | ...
      whitelisted: true # true | false
      port: 8008 # port number
```

See the `sample-spec.yml` for full examples of all the available configurations.
