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
    const xml2js = require("xml2js");
    const util = require("util");
/*var HttpHeaders = require('http-headers');
var http = require('http');

const httpOptions = {
  observe:'body',
  withCredentials:true,
  headers:new HttpHeaders().append('Content-Type','application/json')
};
*/
app.use(cookieParser());


passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
//"https://bia-dev.onelogin.com/trust/saml2/http-post/sso/a801d15c-f46a-447c-b256-106de17782cd",
//entryPoint: "https://bia-dev.onelogin.com/trust/saml2/http-post/sso/1a62b78f-9251-4b17-b732-a9baef373bd0",
//https://bia-dev.onelogin.com/trust/saml2/http-post/sso/d1cfb2df-830c-4629-8654-7e804ae481a5
// SAML strategy for passport -- Single IPD https://bia-dev.onelogin.com/trust/saml2/http-post/sso/
//https://bia-dev.onelogin.com/trust/saml2/http-post/sso/a801d15c-f46a-447c-b256-106de17782cd
//MIIDzzCCAregAwIBAgIUWTCE0/DisfVFFRsf3vez83ASnqkwDQYJKoZIhvcNAQEFBQAwQTEMMAoGA1UECgwDQklBMRUwEwYDVQQLDAxPbmVMb2dpbiBJZFAxGjAYBgNVBAMMEU9uZUxvZ2luIEFjY291bnQgMB4XDTIwMTEwMjIwMTcyNFoXDTI1MTEwMjIw MTcyNFowQTEMMAoGA1UECgwDQklBMRUwEwYDVQQLDAxPbmVMb2dpbiBJZFAxGjAY BgNVBAMMEU9uZUxvZ2luIEFjY291bnQgMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A MIIBCgKCAQEA0FxbNkednHlSUxmDE6hjEkIkV9dCqD1PuI/qFzjL8y6C7/NawEooGoc7kL+nsrJmhL0ct4snppKQH/IIrkf0Q8sUhs+4sZZtzMr0+mUydFbDKTDRVPeC9qVhob7T3HpSIUNSL3b83vGpZ5ZgLbYapKzgx85Zy2YwGjDNOoREna7iFfqcjoA8PC9gKyP5frrhitJ57ryOcNWZRuNbLF/lIysA+TU41XL6+1Fs2Zr+CF2oNr7EqRl6O7ZmGOQcVul0t2juipg0QIVgtuWKNSWtiAkTOIXm7PpLVBKWkLSr02lRuiKpNitsezJlYoE0pQwRdP3AC9JPDKGw7mw9YbcxJwIDAQABo4G+MIG7MAwGA1UdEwEB/wQCMAAwHQYDVR0OBBYEFNs41hw7eUXeU9v6GLdjgg0NkqxHMHwGA1UdIwR1MHOAFNs41hw7eUXeU9v6GLdjgg0NkqxHoUWkQzBBMQwwCgYDVQQKDANCSUExFTATBgNVBAsMDE9uZUxvZ2luIElkUDEaMBgGA1UEAwwRT25lTG9naW4gQWNjb3VudCCCFFkwhNPw4rH1RRUbH973s/NwEp6pMA4GA1UdDwEB/wQEAwIHgDANBgkqhkiG9w0BAQUFAAOCAQEAY1ph+5kAHnk24GrJaYGX9X2FMmjjD1jGKFQHG+JpqVp6O7L2RaZPM0Qg8Qla/mqCIwNINEingTE2IUxqOgwQMKCOfp09cW9TUw2kecjQAXg0sf7bPnlgajluIwYEvmby4rF3Se1eEpbZaGfeMETx5dC0UCZ2hkSoJ7ioMPFsl7+EFWND/3Juw1F1V04hR3ZmpzgTpcoT6rI770Lu4i5DQLAP4I/XBPNvJLDLHC9L5AFBVkONr1Z08zSNPLagIR33QTOCu/K7zo+pInp1v8KNEhwz+ucC9lg3tRHlZ0qLF6FH5QD3IbmjD2Q3Pcv2ZqUDU3okEqn+RkITnixddeYqnQ=="

const strategy = new passportSaml.Strategy(
  {
      //https://login.salesforce.com?so=0sp2y0000008OJX
      //https://bia.my.salesforce.com/idp/login?app=0sp2y0000008OJX
	entryPoint: "https://bia.my.salesforce.com/idp/login?app=0sp2y0000008OJX",
    issuer: "passport-saml",
     
    cert: "MIIErDCCA5SgAwIBAgIOAXWd/R0nAAAAAHjATLEwDQYJKoZIhvcNAQELBQAwgZAxKDAmBgNVBAMMH1NlbGZTaWduZWRDZXJ0XzA2Tm92MjAyMF8xNDM2NTIxGDAWBgNVBAsMDzAwRDJ5MDAwMDAwdHJQMzEXMBUGA1UECgwOU2FsZXNmb3JjZS5jb20xFjAUBgNVBAcMDVNhbiBGcmFuY2lzY28xCzAJBgNVBAgMAkNBMQwwCgYDVQQGEwNVU0EwHhcNMjAxMTA2MTQzNjUyWhcNMjExMTA2MTIwMDAwWjCBkDEoMCYGA1UEAwwfU2VsZlNpZ25lZENlcnRfMDZOb3YyMDIwXzE0MzY1MjEYMBYGA1UECwwPMDBEMnkwMDAwMDB0clAzMRcwFQYDVQQKDA5TYWxlc2ZvcmNlLmNvbTEWMBQGA1UEBwwNU2FuIEZyYW5jaXNjbzELMAkGA1UECAwCQ0ExDDAKBgNVBAYTA1VTQTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAJAZAANai6ZyRP1P4hoL0GGCSPfDBrdhd/S31FsOcksZZ8QwbhBxRaoZ5rwegkgNowO2ApjL9FhBzV9EhnMgRbtB7wYAipIMFeKE01YeVAjnmXOc0o1KKemet7uqh2gz9T8AniSf57QhXGBFIhDekTTaY2SXt5UxNbtvOBFjqmT7fx8uBD1h4Ncj7lQyMmIzl+4s7Zj7APlNqUwJ//s9qzIM4Q2AuVarc9QAfazmyVWFHNME8MsDp043Ual8Q/ac08K87r7V02RlLFoZYB7ImZ7KAPsObzrwPwasrcs/v2ZlfCnascHaVUBeE7fXwd9AUlyUCEVhNKdDaG8MRcCTU98CAwEAAaOCAQAwgf0wHQYDVR0OBBYEFNt87+37fbjpQ4wMHD+UQCoAKS3jMA8GA1UdEwEB/wQFMAMBAf8wgcoGA1UdIwSBwjCBv4AU23zv7ft9uOlDjAwcP5RAKgApLeOhgZakgZMwgZAxKDAmBgNVBAMMH1NlbGZTaWduZWRDZXJ0XzA2Tm92MjAyMF8xNDM2NTIxGDAWBgNVBAsMDzAwRDJ5MDAwMDAwdHJQMzEXMBUGA1UECgwOU2FsZXNmb3JjZS5jb20xFjAUBgNVBAcMDVNhbiBGcmFuY2lzY28xCzAJBgNVBAgMAkNBMQwwCgYDVQQGEwNVU0GCDgF1nf0dJwAAAAB4wEyxMA0GCSqGSIb3DQEBCwUAA4IBAQAmYEFVezgYKPKj7aXcdVwJqiK9oY7KQ/oSKRhcsrV7V69epy948krua1grkLHsU8EmBDVFMuEPqQc6lvbJkDAS5RABTnaVn3IBHkQJmyyeGtdVY3rvk94K15TrPb8SEwUedRiCQaZGf0fcE68Zu7FR1O0owRapuRGjLV8uIUxKjOWS3P8171MeDepz6zwvGf6/feOSEH2Y1leT8BXbP1fv2+Yjy0fiLRxjKR4S7/PlHt9QiypPYyvDXz8IpAElB+1ZAWtWTMu1SG8qg+tBd1PVM6YlLYaRccYLC+HKd/LGdyw5B5hE69M4lvJog4ZGmpTvv7RAK78HGz9NcPP6LLgH"
      
   },
   // (profile, done) => done(null, profile),
 function (profile, done) 
 {
     console.log("Profile - "+profile.email);
      return done(null,
        {
          id: profile.uid,
          email: profile.email,
          displayName: profile.cn,
          firstName: profile.givenName,
          lastName: profile.sn
        });
 }
);

passport.use(strategy);
/*
const httpOptions = {
  observe:'body',
  withCredentials:true,
  headers:new HttpHeaders().append('Content-Type','application/json')
};
*/
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); 

// Passport requires session to persist the authentication
// so were using express-session for this example
/*
app.use(cookieSession({
  name:'ss',
  secret: 'secret squirrel',
  cookie:{
	  maxAge: 1000*60*60*24*7 // 1 week
  },
   
  resave: true,    //false
  saveUninitialized: true,
  cookie:{secure:false}
})) */

/* required for passport session
app.use(session({
  secret: 'secrettexthere',
  saveUninitialized: true,
  resave: true,
  // using store session on MongoDB using express-session + connect
  store: new MongoStore({
    url: config.urlMongo,
    collection: 'sessions'
  })
}));*/

  
  app.use(session(
    {
      secret: 'secrettexthere',
      saveUninitialized: true,
      resave: true
    }));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware for checking if a user has been authenticated
// via Passport and OneLogin OpenId Connect
function checkAuthentication(req,res,next)
{

   //   console.log("Res - - -  - - "+JSON.stringify(res));
      
    console.log("SAML - "+util.inspect(res.user, {depth: null}));
    //console.log("SAML - "+res);
	//console.log(JSON.stringify(res));
    //console.log(JSON.stringify(next));
    
/*
    const token = "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c2FtbHA6UmVzcG9uc2UgeG1sbnM6c2FtbHA9InVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMDpwcm90b2NvbCIgRGVzdGluYXRpb249Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC91c2Vycy8iIElEPSJfYTRkMGI1MDc3YjZlYTNkODVhYjk0NTZjNzVkN2I5YWExNjA0NzQzNjA0NjE0IiBJc3N1ZUluc3RhbnQ9IjIwMjAtMTEtMDdUMTA6MDY6NDQuNjE0WiIgVmVyc2lvbj0iMi4wIj48c2FtbDpJc3N1ZXIgeG1sbnM6c2FtbD0idXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6Mi4wOmFzc2VydGlvbiIgRm9ybWF0PSJ1cm46b2FzaXM6bmFtZXM6dGM6U0FNTDoyLjA6bmFtZWlkLWZvcm1hdDplbnRpdHkiPmh0dHBzOi8vYmlhLm15LnNhbGVzZm9yY2UuY29tPC9zYW1sOklzc3Vlcj48ZHM6U2lnbmF0dXJlIHhtbG5zOmRzPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwLzA5L3htbGRzaWcjIj4KPGRzOlNpZ25lZEluZm8+CjxkczpDYW5vbmljYWxpemF0aW9uTWV0aG9kIEFsZ29yaXRobT0iaHR0cDovL3d3dy53My5vcmcvMjAwMS8xMC94bWwtZXhjLWMxNG4jIi8+CjxkczpTaWduYXR1cmVNZXRob2QgQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwLzA5L3htbGRzaWcjcnNhLXNoYTEiLz4KPGRzOlJlZmVyZW5jZSBVUkk9IiNfYTRkMGI1MDc3YjZlYTNkODVhYjk0NTZjNzVkN2I5YWExNjA0NzQzNjA0NjE0Ij4KPGRzOlRyYW5zZm9ybXM+CjxkczpUcmFuc2Zvcm0gQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwLzA5L3htbGRzaWcjZW52ZWxvcGVkLXNpZ25hdHVyZSIvPgo8ZHM6VHJhbnNmb3JtIEFsZ29yaXRobT0iaHR0cDovL3d3dy53My5vcmcvMjAwMS8xMC94bWwtZXhjLWMxNG4jIj48ZWM6SW5jbHVzaXZlTmFtZXNwYWNlcyB4bWxuczplYz0iaHR0cDovL3d3dy53My5vcmcvMjAwMS8xMC94bWwtZXhjLWMxNG4jIiBQcmVmaXhMaXN0PSJkcyBzYW1sIHNhbWxwIHhzIHhzaSIvPjwvZHM6VHJhbnNmb3JtPgo8L2RzOlRyYW5zZm9ybXM+CjxkczpEaWdlc3RNZXRob2QgQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwLzA5L3htbGRzaWcjc2hhMSIvPgo8ZHM6RGlnZXN0VmFsdWU+RnJ2aHBQdklwdjBZUVBDR09xNmpadEtJbnA0PTwvZHM6RGlnZXN0VmFsdWU+CjwvZHM6UmVmZXJlbmNlPgo8L2RzOlNpZ25lZEluZm8+CjxkczpTaWduYXR1cmVWYWx1ZT4KWjNUeW5LbisrU0hhZk1tV045Q2N1dG9SYVZlc2lTNUkrelNMYTV2em5TbGltRVg1ajY4c0NXc2FyTUtNL01oa2hhZEQyYVNRM3MraApmM3Q2VmxxZHNiZVhpdFNSc29nZmZnc1lpK3JIdERTNjVOYTF5ZHJkbS8wNUd0Q0RwbHpMK0dhSWpDQzRmaHNFTlhXaEc3QXYrb1ZUCllCRFNEclMzWVU3RmYyN3lrcFo3ZHN6UlRvWDl6cWVyMnpRR0pjdVViaEQyQTdBT3c4bW9tSWIwSDI1OGhqS24zZUlBVmptTjVFVUYKRVljaCt5M0NFUThNR2MramxQSHJGYTZ4cmdDaVpRRXNLUXA0RFpBNndwSmQ2UzBsQVFhaHpCdnFoNkV2VDlXdFM1T2dhbEt2Rk5SUwprUVdsZGpSUTY2OTVONGxISEFqT092T3ppbGU3YnIzRlhtQ1RjUT09CjwvZHM6U2lnbmF0dXJlVmFsdWU+CjxkczpLZXlJbmZvPjxkczpYNTA5RGF0YT48ZHM6WDUwOUNlcnRpZmljYXRlPk1JSUVyRENDQTVTZ0F3SUJBZ0lPQVhXZC9SMG5BQUFBQUhqQVRMRXdEUVlKS29aSWh2Y05BUUVMQlFBd2daQXhLREFtQmdOVkJBTU0KSDFObGJHWlRhV2R1WldSRFpYSjBYekEyVG05Mk1qQXlNRjh4TkRNMk5USXhHREFXQmdOVkJBc01EekF3UkRKNU1EQXdNREF3ZEhKUQpNekVYTUJVR0ExVUVDZ3dPVTJGc1pYTm1iM0pqWlM1amIyMHhGakFVQmdOVkJBY01EVk5oYmlCR2NtRnVZMmx6WTI4eEN6QUpCZ05WCkJBZ01Ba05CTVF3d0NnWURWUVFHRXdOVlUwRXdIaGNOTWpBeE1UQTJNVFF6TmpVeVdoY05NakV4TVRBMk1USXdNREF3V2pDQmtERW8KTUNZR0ExVUVBd3dmVTJWc1psTnBaMjVsWkVObGNuUmZNRFpPYjNZeU1ESXdYekUwTXpZMU1qRVlNQllHQTFVRUN3d1BNREJFTW5rdwpNREF3TURCMGNsQXpNUmN3RlFZRFZRUUtEQTVUWVd4bGMyWnZjbU5sTG1OdmJURVdNQlFHQTFVRUJ3d05VMkZ1SUVaeVlXNWphWE5qCmJ6RUxNQWtHQTFVRUNBd0NRMEV4RERBS0JnTlZCQVlUQTFWVFFUQ0NBU0l3RFFZSktvWklodmNOQVFFQkJRQURnZ0VQQURDQ0FRb0MKZ2dFQkFKQVpBQU5haTZaeVJQMVA0aG9MMEdHQ1NQZkRCcmRoZC9TMzFGc09ja3NaWjhRd2JoQnhSYW9aNXJ3ZWdrZ05vd08yQXBqTAo5RmhCelY5RWhuTWdSYnRCN3dZQWlwSU1GZUtFMDFZZVZBam5tWE9jMG8xS0tlbWV0N3VxaDJnejlUOEFuaVNmNTdRaFhHQkZJaERlCmtUVGFZMlNYdDVVeE5idHZPQkZqcW1UN2Z4OHVCRDFoNE5jajdsUXlNbUl6bCs0czdaajdBUGxOcVV3Si8vczlxeklNNFEyQXVWYXIKYzlRQWZhem15VldGSE5NRThNc0RwMDQzVWFsOFEvYWMwOEs4N3I3VjAyUmxMRm9aWUI3SW1aN0tBUHNPYnpyd1B3YXNyY3MvdjJabApmQ25hc2NIYVZVQmVFN2ZYd2Q5QVVseVVDRVZoTktkRGFHOE1SY0NUVTk4Q0F3RUFBYU9DQVFBd2dmMHdIUVlEVlIwT0JCWUVGTnQ4CjcrMzdmYmpwUTR3TUhEK1VRQ29BS1Mzak1BOEdBMVVkRXdFQi93UUZNQU1CQWY4d2djb0dBMVVkSXdTQndqQ0J2NEFVMjN6djdmdDkKdU9sRGpBd2NQNVJBS2dBcExlT2hnWmFrZ1pNd2daQXhLREFtQmdOVkJBTU1IMU5sYkdaVGFXZHVaV1JEWlhKMFh6QTJUbTkyTWpBeQpNRjh4TkRNMk5USXhHREFXQmdOVkJBc01EekF3UkRKNU1EQXdNREF3ZEhKUU16RVhNQlVHQTFVRUNnd09VMkZzWlhObWIzSmpaUzVqCmIyMHhGakFVQmdOVkJBY01EVk5oYmlCR2NtRnVZMmx6WTI4eEN6QUpCZ05WQkFnTUFrTkJNUXd3Q2dZRFZRUUdFd05WVTBHQ0RnRjEKbmYwZEp3QUFBQUI0d0V5eE1BMEdDU3FHU0liM0RRRUJDd1VBQTRJQkFRQW1ZRUZWZXpnWUtQS2o3YVhjZFZ3SnFpSzlvWTdLUS9vUwpLUmhjc3JWN1Y2OWVweTk0OGtydWExZ3JrTEhzVThFbUJEVkZNdUVQcVFjNmx2YkprREFTNVJBQlRuYVZuM0lCSGtRSm15eWVHdGRWClkzcnZrOTRLMTVUclBiOFNFd1VlZFJpQ1FhWkdmMGZjRTY4WnU3RlIxTzBvd1JhcHVSR2pMVjh1SVV4S2pPV1MzUDgxNzFNZURlcHoKNnp3dkdmNi9mZU9TRUgyWTFsZVQ4QlhiUDFmdjIrWWp5MGZpTFJ4aktSNFM3L1BsSHQ5UWl5cFBZeXZEWHo4SXBBRWxCKzFaQVd0VwpUTXUxU0c4cWcrdEJkMVBWTTZZbExZYVJjY1lMQytIS2QvTEdkeXc1QjVoRTY5TTRsdkpvZzRaR21wVHZ2N1JBSzc4SEd6OU5jUFA2CkxMZ0g8L2RzOlg1MDlDZXJ0aWZpY2F0ZT48L2RzOlg1MDlEYXRhPjwvZHM6S2V5SW5mbz48L2RzOlNpZ25hdHVyZT48c2FtbHA6U3RhdHVzPjxzYW1scDpTdGF0dXNDb2RlIFZhbHVlPSJ1cm46b2FzaXM6bmFtZXM6dGM6U0FNTDoyLjA6c3RhdHVzOlN1Y2Nlc3MiLz48L3NhbWxwOlN0YXR1cz48c2FtbDpBc3NlcnRpb24geG1sbnM6c2FtbD0idXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6Mi4wOmFzc2VydGlvbiIgSUQ9Il9mNDk2ZGVjODVhOTMwYTA5N2M1ZThiNjg1NDcyYzFkYzE2MDQ3NDM2MDQ2MTQiIElzc3VlSW5zdGFudD0iMjAyMC0xMS0wN1QxMDowNjo0NC42MTRaIiBWZXJzaW9uPSIyLjAiPjxzYW1sOklzc3VlciBGb3JtYXQ9InVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMDpuYW1laWQtZm9ybWF0OmVudGl0eSI+aHR0cHM6Ly9iaWEubXkuc2FsZXNmb3JjZS5jb208L3NhbWw6SXNzdWVyPjxkczpTaWduYXR1cmUgeG1sbnM6ZHM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvMDkveG1sZHNpZyMiPgo8ZHM6U2lnbmVkSW5mbz4KPGRzOkNhbm9uaWNhbGl6YXRpb25NZXRob2QgQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzEwL3htbC1leGMtYzE0biMiLz4KPGRzOlNpZ25hdHVyZU1ldGhvZCBBbGdvcml0aG09Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvMDkveG1sZHNpZyNyc2Etc2hhMSIvPgo8ZHM6UmVmZXJlbmNlIFVSST0iI19mNDk2ZGVjODVhOTMwYTA5N2M1ZThiNjg1NDcyYzFkYzE2MDQ3NDM2MDQ2MTQiPgo8ZHM6VHJhbnNmb3Jtcz4KPGRzOlRyYW5zZm9ybSBBbGdvcml0aG09Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvMDkveG1sZHNpZyNlbnZlbG9wZWQtc2lnbmF0dXJlIi8+CjxkczpUcmFuc2Zvcm0gQWxnb3JpdGhtPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzEwL3htbC1leGMtYzE0biMiPjxlYzpJbmNsdXNpdmVOYW1lc3BhY2VzIHhtbG5zOmVjPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzEwL3htbC1leGMtYzE0biMiIFByZWZpeExpc3Q9ImRzIHNhbWwgeHMgeHNpIi8+PC9kczpUcmFuc2Zvcm0+CjwvZHM6VHJhbnNmb3Jtcz4KPGRzOkRpZ2VzdE1ldGhvZCBBbGdvcml0aG09Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvMDkveG1sZHNpZyNzaGExIi8+CjxkczpEaWdlc3RWYWx1ZT54UWNoOGxPRWtOVWJ6Ui9URmhZSkp2N0RscW89PC9kczpEaWdlc3RWYWx1ZT4KPC9kczpSZWZlcmVuY2U+CjwvZHM6U2lnbmVkSW5mbz4KPGRzOlNpZ25hdHVyZVZhbHVlPgpEbmxTa0FoZ3ZUaUU4NHZuNG5sZThRSTdGQmxYOWM2SXNKdDlxc1VEZGlvTE1DWWVOdXY1RitISkE2NXRuTkZ2MENSc1dRak9iRnQ3CjlYSDRzVVdVUW9rMmIwbXZrVHR4dVc4R2xWdXVvNjlESFVWZlVFSnV0R29TOFMxVk9TdVpWZmxXUGh6dDVrdjNBVHN5ZlZObFEyKzMKWXI2NXI5RXMvTEdnekFCa1lBVHBsVHRxRzFVcTFFRGpJZnZzUDgydGtMSnloMFJZZ1BEUzhrRGg2NFdFYUdTMm9YOXU5aE9iR2ROdgpJVHdJQ1ZWR1pzU0IrdW9GWFZwZDBKR3NPVWlyUGI0czVjdFhFU0RJWkFnSkN5NUNqY0NwZWkvazBMYy9tYXV6N0NBZ2h3WitONU1ECm5reEFLdVVKNVBONGtoQXRqcVlWQmlGRHBzVjFUN0xNVUFoVnN3PT0KPC9kczpTaWduYXR1cmVWYWx1ZT4KPGRzOktleUluZm8+PGRzOlg1MDlEYXRhPjxkczpYNTA5Q2VydGlmaWNhdGU+TUlJRXJEQ0NBNVNnQXdJQkFnSU9BWFdkL1IwbkFBQUFBSGpBVExFd0RRWUpLb1pJaHZjTkFRRUxCUUF3Z1pBeEtEQW1CZ05WQkFNTQpIMU5sYkdaVGFXZHVaV1JEWlhKMFh6QTJUbTkyTWpBeU1GOHhORE0yTlRJeEdEQVdCZ05WQkFzTUR6QXdSREo1TURBd01EQXdkSEpRCk16RVhNQlVHQTFVRUNnd09VMkZzWlhObWIzSmpaUzVqYjIweEZqQVVCZ05WQkFjTURWTmhiaUJHY21GdVkybHpZMjh4Q3pBSkJnTlYKQkFnTUFrTkJNUXd3Q2dZRFZRUUdFd05WVTBFd0hoY05NakF4TVRBMk1UUXpOalV5V2hjTk1qRXhNVEEyTVRJd01EQXdXakNCa0RFbwpNQ1lHQTFVRUF3d2ZVMlZzWmxOcFoyNWxaRU5sY25SZk1EWk9iM1l5TURJd1h6RTBNelkxTWpFWU1CWUdBMVVFQ3d3UE1EQkVNbmt3Ck1EQXdNREIwY2xBek1SY3dGUVlEVlFRS0RBNVRZV3hsYzJadmNtTmxMbU52YlRFV01CUUdBMVVFQnd3TlUyRnVJRVp5WVc1amFYTmoKYnpFTE1Ba0dBMVVFQ0F3Q1EwRXhEREFLQmdOVkJBWVRBMVZUUVRDQ0FTSXdEUVlKS29aSWh2Y05BUUVCQlFBRGdnRVBBRENDQVFvQwpnZ0VCQUpBWkFBTmFpNlp5UlAxUDRob0wwR0dDU1BmREJyZGhkL1MzMUZzT2Nrc1paOFF3YmhCeFJhb1o1cndlZ2tnTm93TzJBcGpMCjlGaEJ6VjlFaG5NZ1JidEI3d1lBaXBJTUZlS0UwMVllVkFqbm1YT2MwbzFLS2VtZXQ3dXFoMmd6OVQ4QW5pU2Y1N1FoWEdCRkloRGUKa1RUYVkyU1h0NVV4TmJ0dk9CRmpxbVQ3Zng4dUJEMWg0TmNqN2xReU1tSXpsKzRzN1pqN0FQbE5xVXdKLy9zOXF6SU00UTJBdVZhcgpjOVFBZmF6bXlWV0ZITk1FOE1zRHAwNDNVYWw4US9hYzA4Szg3cjdWMDJSbExGb1pZQjdJbVo3S0FQc09ienJ3UHdhc3Jjcy92MlpsCmZDbmFzY0hhVlVCZUU3Zlh3ZDlBVWx5VUNFVmhOS2REYUc4TVJjQ1RVOThDQXdFQUFhT0NBUUF3Z2Ywd0hRWURWUjBPQkJZRUZOdDgKNyszN2ZianBRNHdNSEQrVVFDb0FLUzNqTUE4R0ExVWRFd0VCL3dRRk1BTUJBZjh3Z2NvR0ExVWRJd1NCd2pDQnY0QVUyM3p2N2Z0OQp1T2xEakF3Y1A1UkFLZ0FwTGVPaGdaYWtnWk13Z1pBeEtEQW1CZ05WQkFNTUgxTmxiR1pUYVdkdVpXUkRaWEowWHpBMlRtOTJNakF5Ck1GOHhORE0yTlRJeEdEQVdCZ05WQkFzTUR6QXdSREo1TURBd01EQXdkSEpRTXpFWE1CVUdBMVVFQ2d3T1UyRnNaWE5tYjNKalpTNWoKYjIweEZqQVVCZ05WQkFjTURWTmhiaUJHY21GdVkybHpZMjh4Q3pBSkJnTlZCQWdNQWtOQk1Rd3dDZ1lEVlFRR0V3TlZVMEdDRGdGMQpuZjBkSndBQUFBQjR3RXl4TUEwR0NTcUdTSWIzRFFFQkN3VUFBNElCQVFBbVlFRlZlemdZS1BLajdhWGNkVndKcWlLOW9ZN0tRL29TCktSaGNzclY3VjY5ZXB5OTQ4a3J1YTFncmtMSHNVOEVtQkRWRk11RVBxUWM2bHZiSmtEQVM1UkFCVG5hVm4zSUJIa1FKbXl5ZUd0ZFYKWTNydms5NEsxNVRyUGI4U0V3VWVkUmlDUWFaR2YwZmNFNjhadTdGUjFPMG93UmFwdVJHakxWOHVJVXhLak9XUzNQODE3MU1lRGVwego2end2R2Y2L2ZlT1NFSDJZMWxlVDhCWGJQMWZ2MitZankwZmlMUnhqS1I0UzcvUGxIdDlRaXlwUFl5dkRYejhJcEFFbEIrMVpBV3RXClRNdTFTRzhxZyt0QmQxUFZNNllsTFlhUmNjWUxDK0hLZC9MR2R5dzVCNWhFNjlNNGx2Sm9nNFpHbXBUdnY3UkFLNzhIR3o5TmNQUDYKTExnSDwvZHM6WDUwOUNlcnRpZmljYXRlPjwvZHM6WDUwOURhdGE+PC9kczpLZXlJbmZvPjwvZHM6U2lnbmF0dXJlPjxzYW1sOlN1YmplY3Q+PHNhbWw6TmFtZUlEIEZvcm1hdD0idXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6MS4xOm5hbWVpZC1mb3JtYXQ6dW5zcGVjaWZpZWQiPnNpZGRoYW50LnNpbmdoMzI2QGdtYWlsLmNvbTwvc2FtbDpOYW1lSUQ+PHNhbWw6U3ViamVjdENvbmZpcm1hdGlvbiBNZXRob2Q9InVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMDpjbTpiZWFyZXIiPjxzYW1sOlN1YmplY3RDb25maXJtYXRpb25EYXRhIE5vdE9uT3JBZnRlcj0iMjAyMC0xMS0wN1QxMDoxMTo0NC42MTVaIiBSZWNpcGllbnQ9Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC91c2Vycy8iLz48L3NhbWw6U3ViamVjdENvbmZpcm1hdGlvbj48L3NhbWw6U3ViamVjdD48c2FtbDpDb25kaXRpb25zIE5vdEJlZm9yZT0iMjAyMC0xMS0wN1QxMDowNjoxNC42MTVaIiBOb3RPbk9yQWZ0ZXI9IjIwMjAtMTEtMDdUMTA6MTE6NDQuNjE1WiI+PHNhbWw6QXVkaWVuY2VSZXN0cmljdGlvbj48c2FtbDpBdWRpZW5jZT5odHRwczovL3NhbWwuc2FsZXNmb3JjZS5jb208L3NhbWw6QXVkaWVuY2U+PC9zYW1sOkF1ZGllbmNlUmVzdHJpY3Rpb24+PC9zYW1sOkNvbmRpdGlvbnM+PHNhbWw6QXV0aG5TdGF0ZW1lbnQgQXV0aG5JbnN0YW50PSIyMDIwLTExLTA3VDEwOjA2OjQ0LjYxNFoiPjxzYW1sOkF1dGhuQ29udGV4dD48c2FtbDpBdXRobkNvbnRleHRDbGFzc1JlZj51cm46b2FzaXM6bmFtZXM6dGM6U0FNTDoyLjA6YWM6Y2xhc3Nlczp1bnNwZWNpZmllZDwvc2FtbDpBdXRobkNvbnRleHRDbGFzc1JlZj48L3NhbWw6QXV0aG5Db250ZXh0Pjwvc2FtbDpBdXRoblN0YXRlbWVudD48c2FtbDpBdHRyaWJ1dGVTdGF0ZW1lbnQ+PHNhbWw6QXR0cmlidXRlIE5hbWU9InVzZXJJZCIgTmFtZUZvcm1hdD0idXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6Mi4wOmF0dHJuYW1lLWZvcm1hdDp1bnNwZWNpZmllZCI+PHNhbWw6QXR0cmlidXRlVmFsdWUgeG1sbnM6eHM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hIiB4bWxuczp4c2k9Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hLWluc3RhbmNlIiB4c2k6dHlwZT0ieHM6YW55VHlwZSI+MDA1MnkwMDAwMDFIMTBnPC9zYW1sOkF0dHJpYnV0ZVZhbHVlPjwvc2FtbDpBdHRyaWJ1dGU+PHNhbWw6QXR0cmlidXRlIE5hbWU9InVzZXJuYW1lIiBOYW1lRm9ybWF0PSJ1cm46b2FzaXM6bmFtZXM6dGM6U0FNTDoyLjA6YXR0cm5hbWUtZm9ybWF0OnVuc3BlY2lmaWVkIj48c2FtbDpBdHRyaWJ1dGVWYWx1ZSB4bWxuczp4cz0iaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEiIHhtbG5zOnhzaT0iaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEtaW5zdGFuY2UiIHhzaTp0eXBlPSJ4czphbnlUeXBlIj5zaWRkaGFudC5zaW5naDMyNkBnbWFpbC5jb208L3NhbWw6QXR0cmlidXRlVmFsdWU+PC9zYW1sOkF0dHJpYnV0ZT48c2FtbDpBdHRyaWJ1dGUgTmFtZT0iZW1haWwiIE5hbWVGb3JtYXQ9InVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMDphdHRybmFtZS1mb3JtYXQ6dW5zcGVjaWZpZWQiPjxzYW1sOkF0dHJpYnV0ZVZhbHVlIHhtbG5zOnhzPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYSIgeG1sbnM6eHNpPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYS1pbnN0YW5jZSIgeHNpOnR5cGU9InhzOmFueVR5cGUiPnNpZGRoYW50LnNpbmdoMzI2QGdtYWlsLmNvbTwvc2FtbDpBdHRyaWJ1dGVWYWx1ZT48L3NhbWw6QXR0cmlidXRlPjxzYW1sOkF0dHJpYnV0ZSBOYW1lPSJpc19wb3J0YWxfdXNlciIgTmFtZUZvcm1hdD0idXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6Mi4wOmF0dHJuYW1lLWZvcm1hdDp1bnNwZWNpZmllZCI+PHNhbWw6QXR0cmlidXRlVmFsdWUgeG1sbnM6eHM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hIiB4bWxuczp4c2k9Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hLWluc3RhbmNlIiB4c2k6dHlwZT0ieHM6YW55VHlwZSI+ZmFsc2U8L3NhbWw6QXR0cmlidXRlVmFsdWU+PC9zYW1sOkF0dHJpYnV0ZT48L3NhbWw6QXR0cmlidXRlU3RhdGVtZW50Pjwvc2FtbDpBc3NlcnRpb24+PC9zYW1scDpSZXNwb25zZT4=";
   
    const parser = new xml2js.Parser();
    
    parser.parseString(token,(err,result) => {
        console.log("Kstiz -"+util.inspect(result,false,null,true));
    }); */
    
  /*SAML.decodeSamlPost(res, function(err, xml) {
         if (err) {
            throw new Error(err);
         }
    const jsonObject = xmlParser.xml2json(xml, {
            object: true,
            sanitize: true,
            trim: true
        });
    // Here you can do whatever you wanna do with the json object
    console.log(jsonObject["samlp:Response"]);
    }); */
    
   /* console.log(req.isAuthenticated()+"Ashirwqad");
  if(req.isAuthenticated())
  {
	  console.log("Authenticated");
      next();
  } 
  else
  {	  
      res.redirect("/");
	  console.log("Not Authenticated");
  }*/
  

  var property = 'user';
  if (this._passport && this._passport.instance) 
  {
    property = this._passport.instance._userProperty || 'user';
    console.log(property+"--");
  }
  console.log("here2");
  
  if(this[property] == true)
  {
	  console.log("Authenticated");
      next();
  } 
  else
  {	  
      res.redirect("/");
	  console.log("Not Authenticated");
  }
  
  return (this[property]) ? true : false;

}

app.use('/', index);

app.use('/users', checkAuthentication, users);

// Initiates an authentication request with OneLogin
// The user will be redirect to OneLogin and once authenticated
// they will be returned to the callback handler below
/*app.get('/login', passport.authenticate('saml', {
  successReturnToOrRedirect: "/",
  scope: 'profile'
}));

// Callback handler that OneLogin will redirect back to
// after successfully authenticating the user
app.get('/oauth/callback', passport.authenticate('saml', {
  callback: true,
  successReturnToOrRedirect: '/users',
  failureRedirect: '/'
}))

// Destroy both the local session and
// revoke the access_token at OneLogin
app.get('/logout', function(req, res){

  request.post(`${baseUri}/token/revocation`, {
    'form':{
      'client_id': process.env.OIDC_CLIENT_ID,
      'client_secret': process.env.OIDC_CLIENT_SECRET,
      'token': req.session.accessToken,
      'token_type_hint': 'access_token'
    }
  },function(err, respose, body){

    console.log('Session Revoked at OneLogin');
    res.redirect('/');

  });
}); */

const userAgentHandler = (req, res, next) => {
  const agent = useragent.parse(req.headers['user-agent']);
  const deviceInfo = Object.assign({}, {
    device: agent.device,
    os: agent.os,
  });
  req.device = deviceInfo;
  next();
};


const router = express.Router();

/**
 * This Route Authenticates req with IDP
 * If Session is active it returns saml response
 * If Session is not active it redirects to IDP's login form
 */
 /**
router.get('/login/sso',
  passport.authenticate('saml', {
    successRedirect: '/',
    failureRedirect: '/login',
  }));


 * This is the callback URL
 * Once Identity Provider validated the Credentials it will be called with base64 SAML req body
 * Here we used Saml2js to extract user Information from SAML assertion attributes
 * If every thing validated we validates if user email present into user DB.
 * Then creates a session for the user set in cookies and do a redirect to Application
 */

  
  app.get('/login', passport.authenticate('saml', 
  {
  successReturnToOrRedirect: "/"
  }));

  app.post('/login/callback', passport.authenticate('saml', {
  callback: true,
  successReturnToOrRedirect: '/users',
  failureRedirect: '/'
}))



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
