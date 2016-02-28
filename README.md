# Biblys Data Server

Biblys Data is an open data server for books that aims at easing sharing of
bibliographic data betweens publishers, booksellers, reviews site and everyone
interested.

[Demo](http://data.biblys.fr/)


## API Usage

### Get a book

`curl http://data.biblys.fr/api/v0/books/9791091146203`

### Create, update or delete a book

Currently, only the GET method is public.


## Install 

* Install node & npm
* `git clone https://github.com/biblys/biblys-data-server.git && cd biblys-data-server`
* `npm install`
* `npm start`


## Test

* `npm test`


## Changelog

### 0.1.0 (2016-02-28)
* First release
* Basic Book and User models
* Basic book GET and PUT controllers
