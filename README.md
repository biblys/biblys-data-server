# Biblys Data Server

Biblys Data is an open data server for books that aims at easing sharing of
bibliographic data betweens publishers, booksellers, reviews site and everyone
interested.

[Demo](https://data.biblys.fr/)


## API Usage

### Get a book

`curl https://data.biblys.fr/api/v0/books/9791091146203`

Example response:

```json
{
  "ean": "9791091146203",
  "isbn": "979-10-91146-20-3",
  "title": "Chants du cauchemar et de la nuit",
  "publisher": {
    "id": "1234",
    "name": "Dystopia"
  }
}
```

### Create, update or delete a book

Currently, only the GET method is public.


### Get a publisher

`curl https://data.biblys.fr/api/v0/publishers/1234`

Example response:

```json
{
  "id": "1234",
  "name": "Dystopia"
}
```

### Create, update or delete a book

Currently, only the GET method is public.


## Install

* Install node & mongodb
* `git clone https://github.com/biblys/biblys-data-server.git && cd biblys-data-server`
* `npm install`
* `npm start`


## Test

* `npm test`


## Changelog

### DEV
* Added a controller to get all books on GET /books/

### 0.2.0 (2016-03-25)
* Book title and ean property are now required
* Book ean must be a valid ISBN-13
* Added Publisher model, create and read controllers
* Added isbn property to Book response

### 0.1.1 (2016-02-29)
* Fixed authenticating with empty API key

### 0.1.0 (2016-02-28)
* First release
* Added basic Book and User models
* Added basic book create and read controllers
