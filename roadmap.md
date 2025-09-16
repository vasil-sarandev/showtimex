# Showtimex roadmap

## Functional Requirements

- Users should be able to view events
- Users should be able to search events
- Users should be able to book tickets

## Entities

Entities I'll be adding to the application:

(done)

- Event
- Ticket
- Performer
- Venue
- Payment
- User

## API

- `POST /API/event` -> Event
- `GET /API/event/$id` -> Event
- `GET /API/event/search?term={term}&location={location}&date={date}&venue={venue}` -> Event[] or Partial<Event>[]
- `GET /API/ticket/$id` -> Ticket
- `GET /API/ticket/search?status={status}&eventId={eventId}` -> Ticket[] or Partial<Ticket>[]
- `GET /API/performer/${id}` -> Performer
- `GET /API/venue/${id}` -> Venue
- `GET /API/bffs/event-page/${id}` (Backend for Frontend Service) -> Event, Venue, Performer

(done)

- `POST /API/payments/initiate` -> (transaction) initiate payment - create payment with status pending, set ticket status to RESERVED.
- `POST /API/payments/stripe-webhook` -> (2x transaction handlers for succeeded / failed payment intents for tickets)
- `GET /API/user/me` -> User
- `GET /API/user/${id}` -> User

## Misc

- Database seeds
- Migrations
- Swagger
