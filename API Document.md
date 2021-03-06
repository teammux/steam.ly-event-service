# Steam.ly Event Service API Document

## Object

### Event

#### User Event

##### User Click Event

| Parameter     | Description                 |
| ------------- |:---------------------------:|
| id            | A unique `number` used to identify a `Event`|
| type          | A fixed `string` value will always be **user_click** |
| user_id       | A unique `number` identifies a `User` which triggered the event |
| item_id       | A unique `number` identifies a `Game` witch `User` click on |
| is_recommand  | A `boolean` value describes if the `Game` is a recommanded one |
| date          | A `string` value describes the date when the event triggered in `Javascript Date format` |

<!-- ##### Purchase

| Parameter     | Description                 |
| ------------- |:---------------------------:|
| type          | A fixed `string` value will always be **user_purchase** |
| user_id       | A unique `number` identifies a `User` which triggered the event |
| item_id       | A unique `number` identifies a `Game` witch `User` purchase |
| price         | A `number` value describes how much the `User` pay for the `Game` |
| created_date  | A `number` value describes the date when the event triggered |

##### Play Game

| Parameter     | Description                 |
| ------------- |:---------------------------:|
| type          | A fixed `string` value will always be **user_play_game** |
| user_id       | A unique `number` identifies a `User` which triggered the event |
| item_id       | A unique `number` identifies a `Game` witch `User` click played |
| length        | A `number` value describes how long did the `User` play the `Game` |
| created_date  | A `number` value describes the date when the event triggered | -->

<!-- #### Publisher Event

##### New Game

| Parameter     | Description                 |
| ------------- |:---------------------------:|
| type          | A fixed `string` value will always be **new_game** |
| item_id       | A unique `number` identifies a `Game` witch is released |
| created_date  | A `number` value describes the date when the event triggered |

##### Game Update

| Parameter     | Description                 |
| ------------- |:---------------------------:|
| type          | A fixed `string` value will always be **game_update** |
| item_id       | A unique `number` identifies a `Game` witch is updated |
| created_date  | A `number` value describes the date when the event triggered |

##### Game On Sale

| Parameter      | Description                 |
| -------------- |:---------------------------:|
| type           | A fixed `string` value will always be **game_on_sale** |
| item_id        | A unique `number` identifies a `Game` witch is updated |
| original_price | A `number` value describes the original price of the `Game` |
| sale_price     | A `number` value describes the sale price of the `Game` |
| created_date   | A `number` value describes the date when the event triggered | -->

<!-- ### Daily Sales Summary

| Parameter     | Description                 |
| ------------- |:---------------------------:|
| id            | A unique `number` used to identify a `Daily Summary`|
| item_id       | A unique `number` identifies a `Game` which the `Daily Summary` is talking about |
| sales         | A `number` value describes a `Game`'s sales of a day |
| total_profit  | A `number` value describes a `Game`'s total profit of a day |
| day_number    | A unique `number` identifies a day | -->

### Daily Summary

#### Daily Click Summary

| Parameter     | Description                 |
| ------------- |:---------------------------:|
| id            | A unique `number` used to identify a `Daily Summary`|
| reco_clicks   | A `number` value describes a recommand `Game`'s total clicks of a day |
| rand_clicks   | A `number` value describes a random `Game`'s total clicks of a day |
| date          | A `string` value identifies a day in `Javascript Date format` |
<!-- | item_id       | A unique `number` identifies a `Game` which the `Daily Summary` is talking about | -->

## Interface

### `GET` /events

#### Request

| Parameter     | Description                 |
| ------------- |:---------------------------:|
| type          | A `string` value describes which kind of event history list you want |
| amount  | A `number` value describes how many entries you want |

#### Response(JSON)

| Parameter     | Description                 |
| ------------- |:---------------------------:|
| events        | A `array` value contains latest `Event`s which fit the request parameters |

#### Example

##### request

> **GET** /events?type=user_click&amount=2

##### response

```javascript
200 OK

{
  results: [
    {
      id: 1,
      userId: 1,
      itemId: 1,
      type: 'user_click',
      is_recommand: false,
      date: "Fri Mar 01 2013 01:10:00 GMT-0800 (PST)"
    },
    {
      id: 2,
      type: 'user_event',
      userId: 2,
      itemId: 2,
      type: 'user_click',
      is_recommand: true,
      date: "Fri Mar 01 2013 01:10:00 GMT-0800 (PST)"
    }
  ]
}
```

### `POST` /events (User Click Event)

#### Request(JSON)

| Parameter     | Description                 |
| ------------- |:---------------------------:|
| events        | A `array` value contains `Event`s need to be posted |

#### Example

##### request

> **POST** /events

##### request body

```javascript
{
  "events": [
    {
      "user_id": 1,
      "item_id": 1,
      "type": "user_click",
      "is_recommand": false,
      "date": "Fri Mar 01 2013 01:10:00 GMT-0800 (PST)"
    },
    {
      "user_id": 2,
      "item_id": 2,
      "type": "user_click",
      "is_recommand": false,
      "date": "Fri Mar 01 2013 01:10:00 GMT-0800 (PST)"
    }
  ]
}
```

##### response

```javascript
201 CREATED
```

### `GET` /dailySummaries

#### Request

| Parameter     | Description                 |
| ------------- |:---------------------------:|
| type          | A `string` value describes which kind of `Daily Summary` list you want |
| amount        | A `number` value describes how many entries you want |

#### Response(JSON)

| Parameter     | Description                 |
| ------------- |:---------------------------:|
| summaries        | A `array` value contains latest `Daily Summary`s which fit the request parameters |

#### Example

##### request

> **GET** /dailySummaries?type=click&amount=2

##### response

```javascript
200 OK

{
  results: [
    {
      id: 1,
      reco_clicks: 33333,
      rand_clicks: 23333,
      date: "Fri Mar 02 2013 01:10:00 GMT-0800 (PST)"
      }
    },
    {
      id: 2,
      reco_clicks: 43333,
      rand_clicks: 33333,
      date: "Fri Mar 01 2013 01:10:00 GMT-0800 (PST)"
      }
    }
  ]
}
```