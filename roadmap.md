# Showtimex roadmap

## Functional Requirements

- Users should be able to view events
- Users should be able to search events
- Users should be able to book tickets

## Entities

Entities I'll be adding to the application:

- Event
- Ticket
- Performer
- Venue
- User

## API

Some notable endpoints:

- `GET /API/event/$id` -> Event
- `GET /API/event/search?term={term}&location={location}&date={date}&venue={venue}` -> Event[] or Partial<Event>[]
- `GET /API/ticket/$id` -> Ticket
- `GET /API/ticket/search?status={status}&eventId={eventId}` -> Ticket[] or Partial<Ticket>[]
- `POST /API/ticket/reserve` (Transaction) -> Ticket
- `GET /API/performer/${id}` -> Performer
- `GET /API/venue/${id}` -> Venue
- `GET /API/user/me` -> User
- `GET /API/bffs/event-page/${id}` (Backend for Frontend Service) -> Event, Venue, Performer

## Misc

- Database seeds
- Swagger
