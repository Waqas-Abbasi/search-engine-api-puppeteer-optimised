# Search Engine API Puppeteer

Search Engine API with Node/Express and Puppeteer using Google Search

[Blog](https://dev.to/waqasabbasi/optimizing-and-deploying-puppeteer-web-scraper-1nll)

The API scrapes Top Search Results from Google Search

To start the server:
```
npm start
```

You can send a `GET` request with your search query:
```
http://localhost:8080/search?searchquery=cats
```

Example Response
```
[
  {
    title: 'Cats Are Funny',
    description: 'Watch funny videos about cats`,
    url: 'catsarefunny.com'
  },
  {
      title: 'Cats Are Cute',
      description: 'Watch cute videos about cats`,
      url: 'catsarecute.com'
    },
]
```
