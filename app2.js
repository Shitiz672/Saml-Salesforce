const express = require('express');
const helmet = require('helmet');

var request = require('request');

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var passport = require('passport');
var passportSaml = require('passport-saml');

var app = express();
var cookieSession = require('cookie-session');

var index=require('./routes/index');
var users=require('./routes/users');

    const SAML = require("saml-encoder-decoder-js");
    const xmlParser = require("xml2json-light");
    const Saml2js = require("saml2js");
    const util = require("util");
var SamlStrategy = require('passport-saml').Strategy;


passport.use(new SamlStrategy(
  {
    entryPoint: "https://bia.my.salesforce.com/idp/login?app=0sp2y0000008OJX",
    issuer: "passport-saml",
    cert: "MIIErDCCA5SgAwIBAgIOAXWd/R0nAAAAAHjATLEwDQYJKoZIhvcNAQELBQAwgZAxKDAmBgNVBAMMH1NlbGZTaWduZWRDZXJ0XzA2Tm92MjAyMF8xNDM2NTIxGDAWBgNVBAsMDzAwRDJ5MDAwMDAwdHJQMzEXMBUGA1UECgwOU2FsZXNmb3JjZS5jb20xFjAUBgNVBAcMDVNhbiBGcmFuY2lzY28xCzAJBgNVBAgMAkNBMQwwCgYDVQQGEwNVU0EwHhcNMjAxMTA2MTQzNjUyWhcNMjExMTA2MTIwMDAwWjCBkDEoMCYGA1UEAwwfU2VsZlNpZ25lZENlcnRfMDZOb3YyMDIwXzE0MzY1MjEYMBYGA1UECwwPMDBEMnkwMDAwMDB0clAzMRcwFQYDVQQKDA5TYWxlc2ZvcmNlLmNvbTEWMBQGA1UEBwwNU2FuIEZyYW5jaXNjbzELMAkGA1UECAwCQ0ExDDAKBgNVBAYTA1VTQTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAJAZAANai6ZyRP1P4hoL0GGCSPfDBrdhd/S31FsOcksZZ8QwbhBxRaoZ5rwegkgNowO2ApjL9FhBzV9EhnMgRbtB7wYAipIMFeKE01YeVAjnmXOc0o1KKemet7uqh2gz9T8AniSf57QhXGBFIhDekTTaY2SXt5UxNbtvOBFjqmT7fx8uBD1h4Ncj7lQyMmIzl+4s7Zj7APlNqUwJ//s9qzIM4Q2AuVarc9QAfazmyVWFHNME8MsDp043Ual8Q/ac08K87r7V02RlLFoZYB7ImZ7KAPsObzrwPwasrcs/v2ZlfCnascHaVUBeE7fXwd9AUlyUCEVhNKdDaG8MRcCTU98CAwEAAaOCAQAwgf0wHQYDVR0OBBYEFNt87+37fbjpQ4wMHD+UQCoAKS3jMA8GA1UdEwEB/wQFMAMBAf8wgcoGA1UdIwSBwjCBv4AU23zv7ft9uOlDjAwcP5RAKgApLeOhgZakgZMwgZAxKDAmBgNVBAMMH1NlbGZTaWduZWRDZXJ0XzA2Tm92MjAyMF8xNDM2NTIxGDAWBgNVBAsMDzAwRDJ5MDAwMDAwdHJQMzEXMBUGA1UECgwOU2FsZXNmb3JjZS5jb20xFjAUBgNVBAcMDVNhbiBGcmFuY2lzY28xCzAJBgNVBAgMAkNBMQwwCgYDVQQGEwNVU0GCDgF1nf0dJwAAAAB4wEyxMA0GCSqGSIb3DQEBCwUAA4IBAQAmYEFVezgYKPKj7aXcdVwJqiK9oY7KQ/oSKRhcsrV7V69epy948krua1grkLHsU8EmBDVFMuEPqQc6lvbJkDAS5RABTnaVn3IBHkQJmyyeGtdVY3rvk94K15TrPb8SEwUedRiCQaZGf0fcE68Zu7FR1O0owRapuRGjLV8uIUxKjOWS3P8171MeDepz6zwvGf6/feOSEH2Y1leT8BXbP1fv2+Yjy0fiLRxjKR4S7/PlHt9QiypPYyvDXz8IpAElB+1ZAWtWTMu1SG8qg+tBd1PVM6YlLYaRccYLC+HKd/LGdyw5B5hE69M4lvJog4ZGmpTvv7RAK78HGz9NcPP6LLgH"
 
  },
  function(profile, done) 
  {
    findByEmail(profile.email, function(err, user) {
      if (err) 
      {
        return done(err);
      }
      return done(null, user);
    });
  })
);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use("/", routes)

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); 
  app.use(session(
    {
      secret: 'secrettexthere',
      saveUninitialized: true,
      resave: true
    }));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
app.use('/', index);
  app.get('/login', passport.authenticate('saml', 
  {
  successReturnToOrRedirect: "/"
  }));
app.use('/users', checkAuthentication, users);


function checkAuthentication(req,res,next)
{
      
    const xmlResponse = req.body.SAMLResponse;
	if(xmlResponse != null)
	{	
    const parser = new Saml2js(xmlResponse);
    req.samlUserObject = parser.toObject();
    console.log("OUTPUT - "+JSON.stringify(req.samlUserObject));
    
    
    res.cookie("userData", req.samlUserObject);     
  
    
  if(req.samlUserObject.username != null || req.samlUserObject.username != '')
  {
	  console.log("Authenticated");
      next();
  } 
  else
  {	  
      res.redirect("/");
	  console.log("Not Authenticated");
  }
	}
	else
	{
       
		res.redirect("/");
	 // console.log("Not Authenticated");
	} 
	
}

function GetCookie()
{

 
}
module.exports = app;