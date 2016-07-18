/* AUTHOR : RADHA KRISHNA KAVULURU */
/* EDIT 1 : 15-02-2016             */
/* EDIT 2 :                        */



/* ---------------------------------------------------INSERT HEADING HERE------------------------------------------------------------------*/


// ------------------ TO CHANGE BEFORE USE

/*

1) SENDGRID USERNAME AND PASSWORD ( FOR EMAIL VERIFICATION )
2) CUSTOMIZE THE REGISTER FOR WHAT EVER DETAILS YOU WANT ON REGISTRATION
3) LOGIN REQUIRES EMAIL AND PW , CHANGE IF U WANT ANY

  
  
*/


// Available GETS 

/*

1) /login
2) /logout
3) /dashboard
4) /register
5) /verify
6) /
7)





/* ----------------------------------------------------------------------------------------------------------------------------------------*/

/*------------------------------------------------------CODE STARTS HERE---------------------------------------------------------------*/



var express=require('express');  // requiring expressjs
var mongojs=require('mongojs');  // requiring mongojs
var funcz = require('./cust_server.js');// requiring custom_js funcs
var xssFilters = require('xss-filters');
var sanitize = require('mongo-sanitize');
var db=mongojs('silimantic',['tags','posts','users']);// database is indianpanther ,tables are in array
var bodyparser=require('body-parser');//body parser for parsin the body yo
var validator=require('validator');
var moment = require('moment');
//var multer=require('multer');
var sessions=require('client-sessions');
var bcrypt=require('bcryptjs');
var csrf=require('csurf');
// c surf is the sessions library we are using to store the users sessions on the local browser/ iTS WRITTERN by mozilla i guesss


//var sendgrid=require('sendgrid')('USERNAME','PASSWORD');


//var passport=require('passport');
//var mongoose=require('mongoose');
//mongoose.connect('mongodb://localhost/indianpanther');
var app=express();
app.use(express.static(__dirname+"/public"));  
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));



var io = require('socket.io').listen(app.listen(3000));
console.log("Server running on port 3000");
io.sockets.on('connection', function(socket) {
    socket.on('message_to_server', function(data) {
        io.sockets.emit("message_to_client",{ message: data["message"] });
    });
});

/*--------------------------------------------------------APP WORKING PARAMS---------------------------------------------------------------------*/

//app.use(var trendtime=1;)






/*--------------------------------------------------------------------------------------------------------------------------------------------*/
//app.use(multer);

app.use(sessions(
    {
    cookieName:'session',
    secret:'123poloshsa90865746asdgy1f2y3gyuiasu',
    duration:30*60*1000,
    activeDuration:5*60*1000
    
    }

));
app.use(csrf());   

app.use(function (req, res, next) {
  var token = req.csrfToken();
  res.cookie('XSRF-TOKEN', token);
  res.locals.csrfToken = token;
  next();
});

app.set('views', __dirname + '/public/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


//app.use('view engine','jade');



/*-------------------------------------------------- MY MIDDLE WARE -----------------------------------------------*/

app.use(function(req,res,next)
        {
    
    if(req.session && req.session.user)
    {
        db.users.findOne({email:req.session.user.email},function(err,user){
        
            if(user)
            {
               req.user=user;
                delete req.user.password;
                req.session.user=req.user;
                res.locals.user=req.user;
            }
           
            
        next();
        });
    }
    else
    {
        next();
    }
    
});


function requireLogin(req,res,next)
{
    if(!req.user)
    {
        res.redirect('/login');
    }
    else
    {
        next();
    }
}

/*---------------------------------------------------------------------------------------------------------------*/

/*=-----------------------------------------------SCHEMA ---------------------------------------------*/




/* --------------------------------------------------------- API STARTS ------------------------------------------------------------*/

app.get('/',function(req,res){
    if(req.session && req.session.user){
res.redirect('/dashboard');

}
     else{

    res.render("index.html");
     }
    
});
/* -----------------------------------------------LOGIN GET API-----------------------------------------------------------------*/
app.get('/login',function(req,res){

    if(req.session && req.session.user){
res.redirect('/dashboard');

}
    else{
    res.render("login.html");
    }
    
});
/* -----------------------------------------------LOGIN POST API-----------------------------------------------------------------*/

app.post('/login',function(req,res){


   
  var user={};
    
    var error=[];
    var valid=1;

    /* ------------------------------------------------ VALIDATION ---------------------------------------------*/
    // email
     user.email=sanitize(req.body['email']);
    if(!validator.isLength(user.email,{min:4,max:2000}))
    {
    
        error.push('EMAILSIZE');
        valid=0;
    }
     if(!validator.isEmail(user.email))
    {
         error.push('EMAIL which you entered is not correct.');
        valid=0;
    }
    //user password
     user.password=sanitize(req.body['password']);
    if(!validator.isLength(user.password,{min:4,max:200}))
    {
    
        error.push('PASSWORD is not correct as it seems');
        valid=0;
    }
    var passcheck='';
    if(valid==1){
        
    db.users.findOne({email:user.email},function(err,doc){
    
        if(!doc)
        {
            error.push('INVALID');
            res.json({error:error});
        }
        else
        {
    passcheck=doc['password'];
        if(bcrypt.compareSync(user.password,passcheck))
    {
        /* ------------------------------------------- SUCCESS -----------------------------------------------*/
        if(doc['verify']==0)
        {
             error.push('Please verify your account by clicking on the verification email sent to you.');
            res.json({error:error});
        }
        else
        {
        req.session.user=doc;
        res.json({done:"GO"});
        }//session = set-cookie stores stff
        /* ------------------------------------------- SUCCESS -----------------------------------------------*/
    }
     else
    {
        error.push('INVALID');
        res.json({error:error});
    }
        }
    
    });
    
    
    
    }
    else
    {
        res.json({error:error});
    }
   
    
    

});

/* -----------------------------------------------REGISTER GET API-----------------------------------------------------------------*/

app.get('/register',function(req,res){
    
if(req.session&&req.session.user)
{
    res.redirect('/dashboard');
}
    else{
    res.render("register.html",{csrfToken:req.csrfToken()});
    }
    
});


/* -----------------------------------------------REGISTER API-----------------------------------------------------------------*/

app.post('/register',function(req,res){
   console.log(req.body);  

  
    var time = moment().format('MMMM Do YYYY, h:mm:ss a');
    
    var user={};
    
    var error=[];
    var valid=1;

    /* ------------------------------------------------ VALIDATION ---------------------------------------------*/
    // username
    user.name=sanitize(req.body['name']);
    
    if(!validator.isLength(user.name,{min:4,max:200}))
    {
    
       error.push('NAME must be greater than 3 letters and less than 200 letters');
        valid=0;
    }
    //user email
     user.email=sanitize(req.body['email']);
    if(!validator.isLength(user.email,{min:4,max:2000}))
    {
    
        error.push('EMAIL id must be greater than 3 letters and less than 2000 letters');
        valid=0;
    }
     if(!validator.isEmail(user.email))
    {
         error.push('EMAIL is not correctly entered');
        valid=0;
    }
    //user password
     user.password=sanitize(req.body['password']);
    if(!validator.isLength(user.password,{min:4,max:200}))
    {
    
        error.push('PASSWORD must have minimum of 4 letters and maximum of 200 letters');
        valid=0;
    }
     user.repassword=sanitize(req.body['repassword']);
    if(user.repassword!=user.password)
    {
    
        error.push('PASSWORDs you entered are not same. Try entering them again.');
        valid=0;
    }
    else
    {
        delete user.repassword;
    }
    
  
     user.addedat=time;
     user.verify=0; //
     user.authority=0;
    user.vercode=funcz.RandStr(15);
    
    
    
// ------- INSERT -----------------------------------------------------------------------------------------------------------------------
    if(valid==1)
    {
        db.users.findOne({email:user.email},function(err,doc){
    
        if(!doc)
        {
            
        var hash=bcrypt.hashSync(user.password,bcrypt.genSaltSync(10));
        user.password=hash;
        db.users.insert(user,function(err,doc){
    
    console.log(user);
            if(err)
            {
                error.push('We have problems with the server. Please try after some time');
                 res.json({error:error});
            }
    
            else{
 
           var url=req.headers.host+'/verify?email='+user.email+'&vercode='+user.vercode;
                
                // SEND VERIFICATION EMAIL
                
                /* --------------- SEND GRID SAMPLE * ----------------*
                sendgrid.send(
        {
            to:'rkavulru@gmail.com',
            from:'test@mail.indianpanther.com',
            subject:'Indian Panther Admin test',
            text:'Verify your account on Indian Panther by visiting the following link:'+url
        },function(err,json){
        
        if(err){
            error.push('MAILPROB');
            return res.json({error:error});
        }
            else{
                 var succ ={done:"GO"};
            res.json(succ);
            }
        }
        ); /* --------------- SEND GRID SAMPLE * ----------------*/
                var succ ={done:"GO"};
            res.json(succ);
               
                // Maild Done
                
            }
            
            });
        }
            
       else
            {
                error.push('Your email id'+user.email+'already has an account on Inkoview. If you are sure about email id, try forgot password to get back your account');
        res.json({error:error});
            }     
    
       });
        
    }
    
    

    
    else
    {
        res.json({error:error});
    }
            
            
            
 
    

        // INSERT END-------------------------------------------------------------------------------------------------------------------
    
    
});



/* -------------------------------------------------------REGISTER DONE---------------------------------------------------------------*/

app.get('/dashboard',requireLogin,function(req,res){

    res.render('dashboard.html');
    
    
    
});

/*-----------------------------------------------------POST AND GET NEWVIEW-------------------------------------------------------*/

app.get('/newview',requireLogin,function(req,res){
    
    res.render('newinkoview.html');
    
});

app.post('/newview',requireLogin,function(req,res){
    
    var time = moment().format('MMMM Do YYYY, h:mm:ss a');
    var review={};
    var error={};
    
    review.type=sanitize(req.body['type']);
    
    
    if(review.type=='person')
    {
         review.inkurl=sanitize(req.body['inkurl']);
     review.review=sanitize(req.body['review']);
    review.time=time;
    review.undercover=sanitize(req.body['undercover']);
    review.author=req.user.email;
    var valid=1;
        
        if(review.inkurl&&review.review)
        {
       if(!validator.isLength(review.inkurl,{min:4,max:30}))
    {
    
        error.push('USERNAME SIZE');
        valid=0;
        
        // HANDLE INK USERNAME SIZE
    }
            else
            {
                 if(!validator.isLength(review.review,{min:4,max:300000}))
                 {
    
        error.push('REVIEW SIZE');
        valid=0;
         
                     //REVIEW SIZE
                     
                }
                else
                {
                if(!(review.undercover=="true"||review.undercover=="false"))
                 {
    
        error.push('Undercover option');
        valid=0;
         
                     //HANDLE UNDERCOVER OPTION
                     
                }
                else
                {
                
                   db.users.findOne({username:review.inkurl},function(err,doc){
                   
                       if(!doc)
                       {
                           //HANDLE NO RESULTS FOR USERNAME 
                       }
                       else
                       {
                            db.reviews.insert(review,function(err,doc){
                            
                            if(err)
                            {
                                // HANDLE ERROR INSERTING REVIEW
                            }
                            else
                            {
                                
                            }
                            
                            });
                       }
             
                   
                   });
                    
                    
                }
                
                
            }
        }
            
        }
        else
        {
            // HANDLE EMPTY FIELDS
        }
        
    }
    
    
    
    
    
    
  //  res.render('newinkoview.html'); render something!
    
});



/*------------------------------------------------------------------------------------------------------------------*/
/*---------------------------------------------LOGOUT------------------------------------------------------*/


app.get('/logout',function(req,res){

   req.session.reset();
                res.redirect('/');
    
    
});


/*-----------------------------------------------VERIFY EMAIL-------------------------------------------------------*/

app.get('/verify',function(req,res){

    var verpar = req.query;
    console.log(verpar);
    if(verpar.email&&verpar.vercode)
    {
        db.users.findOne({email:verpar.email},function(err,user){
        
            if(user)
            {
                if(req.verify==1)
                {
                    res.redirect('/');
                }
                else
                {
               if(user.vercode==verpar.vercode)
               {
                     db.users.findAndModify(
        {query:{_id:mongojs.ObjectId(user._id)},
         update:{$set:{verify:1 }},
        new: true},
        function(err,doc){
         
         if(err)
         {
             res.render("verify.html",{error:'WE ARE FACING TECHNICAL PROBLEMS'+err.code});
         }
             else
             {
                 res.render("verify.html",{error:'VERIFIED. Vistit http://indianpanther.com/login to discover the world'});
             }
         
         }
    );
               }
                    else
                    {
                        res.render("verify.html",{error:"DO NOT TRY TO HACK DUH NOT THE SAME CODE"});
                    }
                }
            }
            else
            {
                // no user
                res.render("verify.html",{error:"DO NOT TRY TO HACK DUH, NOT CORRECT MAIL ID"});
            }
            
           
            
       
        });
    }
    else
    {
        // no reqs
        res.render("verify.html",{error:"DO NOT TRY TO HACK DUH, NO POST DUDE"});
    }
   
});

/*-----------------------------------------------VERIFY EMAIL ENDS-------------------------------------------------------*/



/*-----------------------------------------------APP WORKING STARTS-------------------------------------------------------*/









/*------------------------------------------------SERVER STUFF ENDS----------------------------------------------*/


/* ----------------------------------------------------------------------------------------------------------------------------------------*/
