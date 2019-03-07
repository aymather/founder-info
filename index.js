const rp = require('request-promise');
const mongoose = require('mongoose');
const db = require('./config/keys').mongoURI;
const Person = require('./config/models');

// Connect to mongo
mongoose.connect(db, {useNewUrlParser: true})
    .then(() => {
        console.log('Connected...');
    })
    .catch((err) => {
        console.log(`Error: ${err}`)
    })

// const newPerson = new Person({
//     name: 'Alec Mather',
//     title: 'Founder'
// })

// newPerson.save().then(item => console.log(item));

// Person.findById('5c817a88d6ab2e529dfa4cdd')
//     .then((people) => {
//         people.remove();
//     })
//     .catch((err) => {
//         console.log(err);
//     })
// Person.find()
//     .then((all) => {console.log(all)})
//     .catch((err) => {
//         console.log(err);
//     })

// Person.find({name: 'Joe'})
//     .then((all) => {
//         console.log(all);
//     })
//     .catch((err) => {
//         console.log(err);
//     })

var regex = new RegExp('/*(f|F)ound*');

var url = 'https://api.crunchbase.com/v3.1/odm-people?user_key=91010ed720e0f63dcf31c91a27fff48b';
var personUrl = 'https://api.crunchbase.com/v3.1/odm-people?user_key=91010ed720e0f63dcf31c91a27fff48b';
var options = {
    uri: url,
    json: true
}

rp(options)
    .then((data) => {
        data.data.items.map((item) => {
            if (item.properties.title) {
                if (regex.exec(item.properties.title) == null) {
                    console.log(`${item.properties.first_name} ${item.properties.last_name}, not a founder, listed as ${item.properties.title}`);
                } else {

                    Person.find({
                        name: `${item.properties.first_name} ${item.properties.last_name}`,
                        title: item.properties.title,
                        city: item.properties.city_name
                    })
                    .then((data) => {
                        if (data.length > 0) {
                            console.log(`${item.properties.first_name} ${item.properties.last_name} already exists in our database.`)
                        } else {
                            var newPerson = new Person({
                                name: `${item.properties.first_name} ${item.properties.last_name}`,
                                title: item.properties.title,
                                gender: item.properties.gender,
                                facebook_url: item.properties.facebook_url,
                                twitter_url: item.properties.twitter_url,
                                linkedin_url: item.properties.linkedin_url,
                                country: item.properties.country_code,
                                city: item.properties.city_name,
                                image: item.properties.profile_image_url
                            })
                            newPerson.save()
                                .then((obj) => {
                                    console.log(obj);
                                })
                                .catch((err) => {
                                    console.log(err);
                                })
                        }
                    })
                }
            }
        })
    })
    .catch((err) => {
        console.log(err);
    })