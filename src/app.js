const path = require('path')
const express = require('express')
const hbs = require('hbs')

const geocode = require('./utils/geocode.js')
const forecast = require('./utils/forecast.js')

const app = express()

const port = process.env.PORT || 3000

// Define paths for Express config
const publicPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath )
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicPath))

app.get('', (req, res) => {
    res.render('index.hbs', {
        title: 'Weather',
        name: 'Chantel Middleton'
    })
})

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        title: 'About',
        name: 'Chantel Middleton'
    })
})

app.get('/help', (req, res) => {
    res.render('help.hbs', {
        title: 'Help',
        name: 'Chantel Middleton',
        helpText: 'This is the help blurb'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        res.send({
            error: 'you  must provide an address!'
        })
        return
    }

    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {

        if (error) {
            res.send({
                error: error
            })

            return
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                res.send({
                    error: error
                })
                return
            }

            res.send({
                forecast: forecastData,
                location: location,
                address: req.query.addres
            })
        })
    })
})


app.get('/help/*', (req, res) => {
    res.render('404.hbs', {
        title: '404',
        name: 'Chantel Middleton',
        errorMessage: 'Help article not found'
    })
})

app.get('*', (req, res) => {
    res.render('404.hbs', {
        title: '404',
        name: 'Chantel Middleton',
        errorText: 'Page not found'
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})