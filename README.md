# Porsche Services Monitoring

The goal of the Monitoring Service is to bring observability and visibility to the overall applications and microservices in the Porsche ecosystem.

A major pain point for applications is that errors are not as visible as they should be, making it harder to react to problems before being visible to end customers. By surfacing these errors in a more timely manner, we can react more quickly. In addition, with warnings also being captured, it can alert us to potential issues down the road, allowing us to proactively attack future problems.

The architecture and flow of this monitoring system is described below. In a nutshell, agents are needed in the environments where information is captured. These include (but not limited to) application logs and health checks. The agents then forwards captured information to the central monitoring service, which then persists this information. A dashboard presents this information for realtime and historic view of the various services. An alerting system is also leveraged to provide quick realtime notification to potential downtime events.

## Sandbox Usage

1. In `monitoring-ui`, create a .env file, using the values from the deployed aws backend.

    Sample UI .env file:

    ```bash
    REACT_APP_API_BASE_URL=https://h0y0rftc0l.execute-api.us-east-1.amazonaws.com
    REACT_APP_AWS_REGION=us-east-1
    REACT_APP_USER_POOL_ID=us-east-1_verxfuFhJ
    REACT_APP_USER_POOL_WEB_CLIENT_ID=22ufsp7v3jg943b9411rnu0s8t
    # Last parameter is stage (ex. dev, pp, p, ad, etc.)
    REACT_APP_WEBSOCKET_URL=wss://z0xhezu5kf.execute-api.us-east-1.amazonaws.com/ad2
    ```

2. Start the UI with `npm start`.

3. Login to the UI with one of the valid email addresses.

## Architecture

```text
                 ┌───────────────────┐
                 │Dashboard          │
                 │(Browser)          │
                 │                   │
                 │                   │
                 │                   │
                 └─────────┬─────────┘
                           │
                           │
                           │
┌──────────────────────────┼────────────────────────────────────┐
│ Account 1                │                                    │
│    ┌─────────────────────┼───────────────────────────────┐    │
│    │ Region 1            │                               │    │
│    │                     │                               │    │
│    │                     │                               │    │
│    │                     │                               │    │
│    │ ┌────────────┐ ┌────▼─────┐         ┌─────────────┐ │    │
│    │ │Intelligence│ │API       │         │Event        │ │    │
│    │ │(Lambda)    │ │(Lambda)  │    ┌────┤Aggregator   │ │    │
│    │ └──────┬─▲───┘ └─────┬────┘    │    └(Lambda)     │ │    │
│    │        │ │           │         │    └─────▲───────┘ │    │
│    │        │ │     ┌─────▼────┐    │          │         │    │
│    │        │ └─────│ DynamoDB ◄────┘          │         │    │
│    │        └───────►          │               │         │    │
│    │                └─────┬────┘               │         │    │
│    │                      │                    │         │    │
│    │                ┌─────▼────┐               │         │    │
│    │                │ Alerter  │          ┌────┴───────┐ │    │
│    │                │          │          │EventBus    │ │    │
│    │                └──────────┘          │            ◄─┼────┼──┐
│    │                                      │            │ │    │  │
│    └──────────────────────────────────────┴─────▲──────┴─┘    │  │
│                                                 │             │  │
│    ┌──────────────────────────────────────┬─────┴──────┬─┐    │  │
│    │ Region 2                             │EventBus    │ │    │  │
│    │                ┌──────────┐          │            │ │    │  │
│    │                │Agent     ├──────────►            │ │    │  │
│    │                │(Lambda)  │          └────────────┘ │    │  │
│    │                │          │                         │    │  │
│    │                └──▲─────▲─┘                         │    │  │
│    │                   │     │                           │    │  │
│    │      ┌────────────┴─┐  ┌┴─────────────┐             │    │  │
│    │      │Service 1 Logs│  │Service 2 Logs│             │    │  │
│    │      │              │  │              │             │    │  │
│    │      │              │  │              │             │    │  │
│    │      └──────────────┘  └──────────────┘             │    │  │
│    │                                                     │    │  │
│    │                                                     │    │  │
│    │                                                     │    │  │
│    └─────────────────────────────────────────────────────┘    │  │
│                                                               │  │
└───────────────────────────────────────────────────────────────┘  │
                                                                   │
┌───────────────────────────────────────────────────────────────┐  │
│Account 2                                                      │  │
│   ┌──────────────────────────────────────┬────────────┬─┐     │  │
│   │ Region 1                             │EventBus    │ │     │  │
│   │                ┌──────────┐          │            ├─┼─────┼──┘
│   │                │Agent     ├──────────►            │ │     │
│   │                │(Lambda)  │          └────────────┘ │     │
│   │                │          │                         │     │
│   │                └──▲─────▲─┘                         │     │
│   │                   │     │                           │     │
│   │      ┌────────────┴──  ┌┴─────────────┐             │     │
│   │      │Service 1 Logs|  │Service 2 Logs│             │     │
│   │      │              │  │              │             │     │
│   │      │              │  │              │             │     │
│   │      └──────────────┘  └──────────────┘             │     │
│   │                                                     │     │
│   │                                                     │     │
│   │                                                     │     │
│   └─────────────────────────────────────────────────────┘     │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

## Schema

Refer to the [domain objects](./src/interfaces.ts)

[DynamoDB Single Table Design](https://www.serverlesslife.com/DynamoDB_Design_Patterns_for_Single_Table_Design.html) using [dynamodb-toolbox](https://github.com/jeremydaly/dynamodb-toolbox)

## Dashboard

* View services as cards with basic status info including log error status
* Dependencies between services shown as arrows connecting service cards
* Cards optionally expandable for list of log groups and basic info

### Images

![Login](https://i.imgur.com/sz3wJlv.png)

![Dashboard](https://i.imgur.com/SVaOlOY.png)

![Service Info](https://i.imgur.com/EzjTemI.png)

## Flow

1. Agents subscribe to Log Group events with filtering, for errors and warnings.
2. Agents send asynchronous events to the local default EventBus.
3. Forwarding rules forward those events to the Monitoring Service's account/region default EventBus.
4. The Monitoring Service Event Aggregator Lambda collects that data and stores in DynamoDB.
5. The Monitoring Service Intelligence Lambda may do further analysis on new data in correlation with previous data (ex. anomaly detection). (* future version)
6. The Monitoring Service Alerter accepts events from DynamoDB streams and notifies via slack/email/sms. (* future version)

### Application Logging

* Consistent logging syntax for errors and warnings (should already be supported by our monorepo common Logging)
* Good developer categorization of errors and warnings.
* Include a correlation ID (cid) to be able to trace events and their source throughout the microservice architecture. A correlation ID is generated (shortid) at incoming external boundaries (i.e. API call from UI, API call from 3rd party, scheduler) and carries it through internal application processing as well as passed on microservice calls. (* future version)

## Future Enhancements Ideas

With an Agent living in all environments, and able to stream data asynchronously to a central hub, and able to display this in a UI, this architecture can be leveraged for many different monitoring and observability use-cases, all by posting messages to the local EventBus.

Let the foundation "marinate for perfection", and enhance with...

* Record service health history and display in Dashboard. We already have health endpoints for some services, which includes the health of their downstream dependencies. A dependency graph can be displayed, highlighting impact of upstream applications/services.
* Allow a user to mark errors/warnings as read/unread for themselves. "Bookmarks" may be a better concept. Pinned? Hidden vs resolved? -> Capture feedback to see if this is neceasary.
* Application deployment status and version/timestamp. (ex. git commit ID of dev/pp/p)
* Notifications controllable by buffering (ie. combining messages to minimize noise), channel availability (email, sms, slack, etc.), and schedule (ex. send combined messages in the morning)(ex. don't send at certain times).
* Realtime dashboard (w/ no refresh, as in a control center).
* Intelligence and metrics. (ex. anomaly detection)(ex. predictive analysis based on history)
* Correlation ID (Distributed Tracing)
  * <https://microsoft.github.io/code-with-engineering-playbook/observability/correlation-id/>
  * <https://medium.com/@scokmen/debugging-microservices-part-ii-the-correlation-identifier-552f9016afcd>
* If we enhance this architecture to 2 way communication (ie. hub -> agent asynchronous commands), we can add on-demand configuration and other actions from the UI, for a whole other set of use-cases...
