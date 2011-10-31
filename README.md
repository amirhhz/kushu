[This repository was imported from a p4 depot]
# Kushu
![Kushu logo](https://github.com/amirhhz/kushu/raw/master/public/images/header_logo.png)

Kushu is an for learning facts with flashcards. It uses a simple implementation of [spaced repitition](http://en.wikipedia.org/wiki/Spaced_repetition) learning called the [Leitner system](http://en.wikipedia.org/wiki/Leitner_system).

This was written as a one-week exercise in Agile development techniques during the Graduate Training Programme for Software Engineers at [Caplin Systems](http://www.caplin.com) on October 2011. The members of the team were [Amir Hajizamani](http://amirhhz.com), Bodrul Alam, Daniel Owen and James Seymour. The product owner was Adam Iley. 

We collectively apologise for the code smells that we know exist and if we have the time we will try to address and improve on them at a later date.

## Requirements ##

- Node.js 0.4.* 
- [npm](https://github.com/isaacs/npm "Node Package Manager")
- MySQL


## Setup ##

First `git clone` this repository.

### Database ###

- Make a new MySQL user and database on your server. We will call ours `kushu`, you might want to use the same name.

- Import the Kushu table schema, using the file `kushu-schema.sql`. We use phpMyAdmin for all this.

- If necessary, modify `app.js` to reflect your DB credentials.

### Run the App Server ###

- `cd` into the root of the kushu directory and run `npm install` to fetch all the node.js dependencies.

- Run `node app.js` and navigating to `<your-ip>:3000`. You optionally supply a port number as an argument. 

- (We like using [`forever`](https://github.com/indexzero/forever) to keep the node server running.)

## License: Apache License, Version 2.0 ##

Copyright 2011 Caplin Systems, Ltd.

Licensed under the Apache License, Version 2.0 (the "License");you may not use this file except in compliance with the License.
  
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
