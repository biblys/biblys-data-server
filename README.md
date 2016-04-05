# Biblys Data Server 

[![Build Status](https://travis-ci.org/biblys/biblys-data-server.svg?branch=master)](https://travis-ci.org/biblys/biblys-data-server)

Biblys Data is an open data server for books that aims at easing sharing of
bibliographic data betweens publishers, booksellers, reviews site, book fairs,
bloggers and everyone interested.

[Demo](https://data.biblys.fr/)

## API Usage

You can also use the [PHP library](https://github.com/biblys/biblys-data-client-php).

### /books/

#### Get a book

```
curl https://data.biblys.fr/api/v0/books/9791091146203
```

Example response:

```json
{
  "ean": "9791091146203",
  "isbn": "979-10-91146-20-3",
  "title": "Chants du cauchemar et de la nuit",
  "publisher": {
    "id": "56f6b4e32d0da4d905512d14",
    "name": "Dystopia"
  },
  "authors": [{
    "id": "57039620ff47770b69adf5fe",
    "name": "Thomas Ligotti"
  }]
}
```

### Create a book

Requires an API key.

```
curl -X POST -H "Authorization: YOUR_API_KEY" -H "Content-Type: application/x-www-form-urlencoded" -d 'publisher=56f6b4082d0da4d905512d12&authors=[{ "id": "57011211aaa24cfa54543aa4" }]&title=Chants du cauchemar et de la nuit&ean=9791091146203' "http://localhost:5000/api/v0/books/"
```

Parameters:
* `ean` (required)
* `title` (required)
* `publisher` a publisher id (required)
* `authors` a JSON array of contributor ids (required)

#### Update or delete a book

To be implemented.

### /publishers/

#### Get a publisher

```
curl https://data.biblys.fr/api/v0/publishers/56f6b4e32d0da4d905512d14
```

Example response:

```json
{
  "id": "56f6b4e32d0da4d905512d14",
  "name": "Dystopia"
}
```

#### Create a publisher

Requires an API key.

```
curl -X POST -H "Authorization: YOUR_API_KEY" -H "Content-Type: application/x-www-form-urlencoded" -d 'name=Dystopia' "http://localhost:5000/api/v0/publishers/"
```

Parameters:
* `name` (required)

#### Update or delete a publisher

To be implemented.

### /contributors/

#### Get a contributor

```
curl https://data.biblys.fr/api/v0/contributors/57039620ff47770b69adf5fe
```

Example response:

```json
{
  "id": "57039620ff47770b69adf5fe",
  "name": "Thomas",
  "firstName": "Thomas",
  "lastName": "Ligotti"
}
```

#### Create a contributor

Requires an API key.

```
curl -X POST -H "Authorization: YOUR_API_KEY" -H "Content-Type: application/x-www-form-urlencoded" -d 'firstName=Thomas&lastName=Ligotti' "https://data.biblys.fr/api/v0/contributors/"
```

Parameters:
* `firstName` (optional)
* `lastName` (required)

#### Update or delete a contributor

To be implemented.


## Install

* Install node & mongodb
* `git clone https://github.com/biblys/biblys-data-server.git && cd biblys-data-server`
* `npm install`
* `npm start`


## Test

* `npm test`


## Changelog

### DEV
* Added Contributor model, create and read controllers
* Added a required *authors* property to Book resource
* Added a required *name* property to User resource
* Added a controller to get all books on GET /books/
* Added a controller to get all publishers on GET /publishers/
* Improved home page style
* Only admin users can create other users

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
