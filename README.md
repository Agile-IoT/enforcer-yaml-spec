# Enforcer Yaml Specification

This document describes the specification of the configuration files used by the agile-enforcer to map requests sent to several services running in the gateway to policy decisions performed by agile-security.

This repository has a description of the configuration format, and an example in ``sample-spec.yaml``


***Terms used***

**ServiceName:** name used to reach the container in the container
(internal docker or balena network) network.  In the following example,
we have two container names agile-core and agile-ui in the top level
hierarchy of the yml file.

**OperationId**: identifier for a single call from the swagger
specification. In the case of agile-core.yml a valid operationId is
“Status” where the an HTTP request (GET) to the URL
'/device/{deviceId}/status' is specified.

**MappedKey**: The value for each key should be composed based on the
specified pattern, including fixed strings, and fields specified in the
swagger API spec referenced by the OperationId

**Path:** File path for the yaml file

The YML file contains multiple ServiceName(s) in the top level. Each
ServiceName needs to have:

-   a pointer in the local file system to the swagger specification of
    > that service under swagger\_api\_spec.

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

 swagger\_api\_spec: **Path2**

 **OperationId3:**

  entityId: **MappedKey**

   entityType: **MappedKey**

   field: **MappedKey**

   method: **MappedKey**

 **OperationId4:**

  entityId: **MappedKey**

   entityType: **MappedKey**

   field: **MappedKey**

   method: **MappedKey**

…

**ServiceNameN:**

swagger\_api\_spec: **PathN**

 **OperationIdM:**

  entityId: **MappedKey**

   entityType: **MappedKey**

   field: **MappedKey**

   method: **MappedKey**
