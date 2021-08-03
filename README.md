## Getting started
I've prepared the basics of a metalsmith build script plus a development server with live reloading, which I like to use whenever I'm building html and styles so I don't have to keep manually refreshing the page. Check it out at [build.js](./build.js).

- [ ] clone this repository from the command line with `git clone git@github.com:beavz/metalsmith-demo.git`
- [ ] run `npm install` to install dependencies
- [ ] run `npm start` to build the project and start the development server

## Step 1: Markdown content
We're going to start with markdown files with some yaml frontmatter. I personally like markdown for things like blog posts, resumes, etc. because it's pretty easy to read and write, but it has plenty of formatting abilities baked right in. It also allows you to write html directly, and the parsing library we're going to use is straightforward to customize if you want to add or modify a parser. There are a few different specs in use for markdown, but they're very similar - check out the [markdown guide](https://www.markdownguide.org/basic-syntax/) and github's [intro to markdown](https://guides.github.com/features/mastering-markdown/) to get started. We'll be using the [marked.js](https://marked.js.org/) parsing library, so their docs should help if you have syntax questions or want to explore more advanced features like writing your own parsers.

- [ ] in the [src/ directory](./src), add markdown files to make the basic pages of your website. I'll add an index, a contact page, and resume pages: feel free to copy mine or make your own.

`src/contact.md`
```md
---
title: Contact
description: Some good ways to get in touch!
---

Hey! We don't use telephones or computers because we don't have thumbs - but you can reach us by telepathy, or contact our humans at [humans@email.com](mailto:xxx).
```

`src/index.md`
```md
---
title: Home
description: A personal website for the esteemed feline sisters Misses Artemis and Freyja
---

Welcome to our website! We're cats. Check out our impressive accomplishments on our resume pages ([Artemis](/artemis-resume.html), [Freyja](/freyja-resume.html)), or head over to our [contact page](/contact.html) if you need to get in touch.
```

`src/artemis-resume.md`
```md
---
title: Artemis A. Cat
description: Some things I've done
---

Naps
```

`src/frejya-resume.md`
```md
---
title: Freyja
description: Some things I've done
---

Naps
```

## Step 2: Parsing markdown into HTML
Now, we're going to parse our markdown files into html.
Just adding the [`metalsmith-markdown`](https://github.com/segmentio/metalsmith-markdown) plugin will convert the markdown in our source file to html, but we also want to add surrounding html - a body, a head, etc. For this, we'll use the [`metalsmith-layouts`](https://github.com/metalsmith/metalsmith-layouts) plugin, which allows us to define an html layout using any templating language we'd like (we'll use [handlebars](https://handlebarsjs.com/)).

- [ ] go to [the build script](./build.js) and uncomment the "Step 2" plugins
- [ ] add a layouts directory at `src/layouts`
- [ ] add your default layout to the directory at `src/layouts/layout.hbs` - you can try this one or build your own:
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>{{ title }}</title>
    <meta name="description" content="{{ desc }}"/>

    {{! this is just the script for the live reloader }}
    {{#if liveReloadPort}}
      <script src="http://localhost:{{liveReloadPort}}/livereload.js?snipver=1"></script>
    {{/if}}

    {{! this adds some google fonts }}
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,wght@0,400;0,600;1,400;1,600&display=swap" rel="stylesheet">



  </head>

  <body>
    <nav>
      <a href="/index.html">ARTEMIS + FREYJA</a>
      <a href="/contact.html">contact</a>
      <a href="/blog.html">blog</a>
    </nav>

    <main>
    <h1>{{ title }}</h1>
    {{{ contents }}}
    </main>
  </body>
</html>
<!doctype html>
```

### Multiple layouts and partials
It may be the case that you want multiple layouts for your site - no problem! With the plugin we're using we can write multiple layouts and then specify which one we'd like for each file in the yaml frontmatter.

- [ ] Add another layout. I'll add one with a publish date and use it for my resume page, but you can add whatever you want.

`src/layouts/resume.hbs`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>{{ title }}</title>
    <meta name="description" content="{{ desc }}"/>

    {{! this is just the script for the live reloader }}
    {{#if liveReloadPort}}
      <script src="http://localhost:{{liveReloadPort}}/livereload.js?snipver=1"></script>
    {{/if}}
  </head>


  <body>
    <nav>
      <a href="/index.html">ARTEMIS + FREYJA</a>
      <a href="/contact.html">contact</a>
      <a href="/blog.html">blog</a>
    </nav>

    <main>
    <h1>{{ title }}</h1>
    <small>last updated {{ published_on }}</small>
    {{{ contents }}}
    </main>
  </body>
</html>
<!doctype html>
```

- [ ] Now go to your markdown file(s) and add `layout: resume.hbs` to the yaml frontmatter so it knows which layout you'd like to use, and, if you've added information that the partial needs, like I have, add that to the yaml as well: `published_on: August 3, 2021`
- [ ] You'll notice there's a lot of duplication between our two layouts, which can become tiresome to maintain. To fix that, we can break out shared pieces into "partials" using the [`metalsmith-discover-partials`](https://github.com/timdp/metalsmith-discover-partials) plugin and the partial syntax from [`handlebars.js`](https://handlebarsjs.com/guide/partials.html). Copy the shared `<head>` from your layouts and move it to `src/partials/head.hbs` and the shared `<nav>` can move to `src/partials/navigation.hbs`.
- [ ] Replace the head and nav in the layouts with a reference to the partial file, `{{> head }}`, and you should have it in the finished pages.

## Step 3: Images and other assets
We'll add the [metalsmith-assets](https://github.com/treygriffith/metalsmith-assets) plugin to take care of our images and other files that don't change in the build process. 

- [ ] Go to [the build script](./build.js) and uncomment the "Step 2" plugins
- [ ] Add a `src/assets/` directory and put an image file in it (there are some provided in  the sample-images directory)
- [ ] You can now add images to your markdown content: `![two cats and a computer](/assets/code.jpg)`
- [ ] Or you can add them to your layouts and partials with an img tag:
      `<img src="assets/string.jpg" alt="two small cats tangled in a mess of string looking a little guilty" width="100px" style="border-radius: 50%"/>`
- [ ] It's sometimes helpful to add an image file name and info to your yaml frontmatter and then use that in your layout: `<img src="assets/{{ image }}"/>`

## Step 4: Styles!!
I like [Sass](https://sass-lang.com/) and use it frequently, especially for small or simple projects like static sites, so we'll add the [metalsmith-sass](https://github.com/stevenschobert/metalsmith-sass) plugin to compile scss into stylesheets for this site. If you're unfamiliar with Sass, that's ok, it's a superset of CSS, so if you just write css like you normally would, it should be just fine. If there are other style libraries or languages you'd like to use, that's cool too; metalsmith is just plugins - you can build your stylesheets any way you want.

- [ ] Uncomment "Step 4" lines in the [build script](./build.js)
- [ ] Add a Sass file at `src/styles/index.scss` and write some styles (or use mine below).

`src/styles/index.scss`
```scss
body {
  font-family: 'Nunito Sans', sans-serif;
  min-height: 100vh;
  max-width: 800px;
  margin: 0 auto;
}

nav {
  margin: 20px;
}

main {
  margin: 20px;
}

footer {
  margin: 20px;
  display: flex;
  justify-content: space-between;
}
```
- [ ] Load the stylesheet in all your layouts by adding the following line to our shared head partial at `src/partials/head.hbs`:
```html
<link href="/styles/index.css" rel="stylesheet"/>
```

## Step 5: Collections
So far we've been building our site one page at a time, but how do we do something like a blog with many posts, or a portfolio site with projects? The [`metalsmith-collections`](https://github.com/segmentio/metalsmith-collections) plugin allows you to create groups of files, access them via the metadata, and adds useful metadata like `next` and `previous` to them so we can add navigation to our layouts. I'll use it to add a blog to Artemis and Freyja's site.

- [ ] Uncomment the `metalsmith-collections` configuration in the build script labeled "Step 5"
- [ ] Add some markdown files to `src/blog/`

`src/blog/a-bug-over-there.md`
```markdown
---
title: OMG a Bug
description: Some thoughts I had about that bug over there.
collection: blog
---

There is a **BUG** over **THERE**. I want to eat it. DO YOU SEE IT? Do you? You seem pretty calm for someone who can see a bug right now. It's right over there. A little buzzy snack.

Nap all day cat dog hate mouse eat string barf pillow no baths hate everything but kitty poochy. Sleep on keyboard toy mouse squeak roll over. Mesmerizing birds. Poop on grasses licks paws destroy couch intently sniff hand. The dog smells bad gnaw the corn cob.

Plays league of legends stare out the window. Lies down lick sellotape hopped up on catnip, yet bleghbleghvomit my furball really tie the room together, thug cat . Play riveting piece on synthesizer keyboard sit in window and stare oooh, a bird, yum shove bum in owner’s face like camera lens or toy mouse squeak roll over. Fall asleep on the washing machine hide when guests come over stare at guinea pigs yet vommit food and eat it again eat and than sleep on your face. Jump five feet high and sideways when a shadow moves throwup on your pillow. Missing until dinner time. Pet right here, no not there, here, no fool, right here that other cat smells funny you should really give me all the treats because i smell the best and omg you finally got the right spot and i love you right now nap all day flop over.
```

`src/blog/meow-meow.md`
```markdown
---
title: Meow. Meow meow.
description: MEOW
collection: blog
---

Meee ow. Meow meow meow meow. Meeow. MEOW. *Meow meow meow*.

Meow. Meeow. MEOW. 
*Meow meow meow*.

Meow. Meeow. MEOW. *Meow meow meow*.

Barf. 

Meow.
```

`src/blog/burble-burble.md`
```markdown
---
title: Top 5 Noises I Like to Make
description: Just totally normal cat stuff
collection: blog
---

1. **Chirping.** Very good. Almost always confuses any new humans nearby.
2. **Plaintive wail.** This is an excellent way to let your humans know that you have seen the bottom of your food bowl and its horrible emptyness will surely infect your soul should they not refill your crunchies immediately. Also fun to wail for no discernable reason at all.
3. **Burbles.** Burbles are my favorite. The absolute best noise there is. Use burbles to let your roomates know that you are so full of thoughts and ideas you can't help but mutter them to yourself as you stroll through the house. Also keep the houseplants guessing.
4. **Meow**. Classic. Timeless. Perfect.
5. **Hiss**. My best-friend-sister-soulmate smelled a little funny today so instead of cuddles we played "hiss at eachother like strangers". It wasn't as fun as I thought it might be. Sorry, Artemis.
```

- [ ] add a blog-post layout that adds navigation from one blog post to the next, and update the metadata of the blog post pages with `layout: blog-post.hbs`.
`src/layouts/blog-post.hbs`
```
<!doctype html>
<html lang="en">
  {{> head }}

  <body>
    <main>
    <h1>{{ title }}</h1>
    {{{ contents }}}
    </main>
    <footer>
      <a href="{{ previous }}">previous post</a>
      <a href="{{ next }}">next post</a>
    </footer>
  </body>
</html>
<!doctype html>
```

- [ ] add another page to be our blog index where we'll list out all the posts
`src/blog.md`
```
---
title: Blog
description: Our blog of cat things
layout: blog.hbs
---

Welcome to our blog!
```
- [ ] give it a layout that lists all the blog posts
`src/layouts/blog.hbs`
```md
<!doctype html>
<html lang="en">
  {{> head }}

  <body>
    {{> navigation }}

    <main>
    <h1>{{ title }}</h1>
      {{{ contents }}}

      <ul>
        {{#each blog }}
          <li><a href="{{ path }}">{{ title }}</a></li>
        {{/each }}
      <ul/>
    </main>
  </body>
</html>
<!doctype html>
```

## Step 6: Publishing
We're going to use [Github pages]() to publish our host our new site. 
