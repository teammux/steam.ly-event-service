# Steam.ly Event Service API Document

## Object

### Event

| Parameter     | Description                 |
| ------------- |:---------------------------:|
| id            | A unique `number` used to identify a `Event`|
| type          | A `string` value used to describe which kind of `Event` it is. Possible value: `user_event`, `publisher_event`, `real_world_event` |
| content       | A `object` contains all detailed event information, See `Content Protocol`|

<!-- ### Daily Sales Summary

| Parameter     | Description                 |
| ------------- |:---------------------------:|
| id            | A unique `number` used to identify a `Daily Summary`|
| item_id       | A unique `number` identifies a `Game` which the `Daily Summary` is talking about |
| sales         | A `number` value describes a `Game`'s sales of a day |
| total_profit  | A `number` value describes a `Game`'s total profit of a day |
| day_number    | A unique `number` identifies a day | -->

### Daily Click Summary

| Parameter     | Description                 |
| ------------- |:---------------------------:|
| id            | A unique `number` used to identify a `Daily Summary`|
| item_id       | A unique `number` identifies a `Game` which the `Daily Summary` is talking about |
| total_clicks  | A `number` value describes a `Game`'s total clicks of a day |
| day_number    | A unique `number` identifies a day |

### Content Protocol

#### User Event

##### Click

| Parameter     | Description                 |
| ------------- |:---------------------------:|
| type          | A fixed `string` value will always be **user_click** |
| user_id       | A unique `number` identifies a `User` which triggered the event |
| item_id       | A unique `number` identifies a `Game` witch `User` click on |
| created_date  | A `number` value describes the date when the event triggered |

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
      type: 'user_event',
      content: {
        userId: 1,
        itemId: 1,
        type: 'user_click',
        created_date: 1508527763
      }
    },
    {
      id: 2,
      type: 'user_event',
      content: {
        userId: 2,
        itemId: 2,
        type:'user_click',
        created_date: 1508527762
      }
    }
  ]
}
```

### `POST` /events

#### Request(JSON)

| Parameter     | Description                 |
| ------------- |:---------------------------:|
| id            | A unique `number` used to identify a `Event`|
| type          | A `string` value used to describe which kind of `Event` it is. Possible value: `user_event`, `publisher_event`, `real_world_event` |
| content       | A `object` contains all detailed event information, See `Content Protocol`|

#### Example

##### request

> **POST** /events

##### request body

```javascript
{
  id: 1,
  type: 'user_event',
  content: {
    userId: 1,
    itemId: 1,
    type: 'user_click',
    created_date: 1508527763
  }
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
| itemId        | A `number` value identifies which `Game`'s Summary you want |
| type          | A `string` value describes which kind of `Daily Summary` list you want |
| amount        | A `number` value describes how many entries you want |

#### Response(JSON)

| Parameter     | Description                 |
| ------------- |:---------------------------:|
| summaries        | A `array` value contains latest `Daily Summary`s which fit the request parameters |

#### Example

##### request

> **GET** /dailySummaries?itemId=2&type=click&amount=2

##### response

```javascript
200 OK

{
  results: [
    {
      id: 1,
      item_id: 2,
      total_clicks: 23333,
      day: 10
      }
    },
    {
      id: 2,
      item_id: 2,
      total_clicks: 2444,
      day: 9
      }
    }
  ]
}
```