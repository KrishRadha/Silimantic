var newinkapp=angular.module('newinkapp',[]);

newinkapp.controller('Newpostcont',['$scope','$http', '$compile','$sce',
                            
                           
    function Newpostcont($scope,$http,$compile,$sce){
    
         $(document).ready(function(){
             $("#PersonInkpanel").hide();
             $("#IncidentInkpanel").hide();
             $("#ConceptInkpanel").hide();
             $("#ServiceInkpanel").hide();
             $("#EntertainmentInkpanel").hide();
             $("#ProductInkpanel").hide();
         
         });
        
    
        $scope.PersonInk=function(){ 
            console.log('fired');
    
     $(document).ready(function(){
     
     $("#newpostpanel").hide();
    $("#PersonInkpanel").show();
        
     
     });
    
    
    };
        $scope.IncidentInk=function(){ 
    
     $(document).ready(function(){
     
     $("#newpostpanel").hide();
    $("IncidentInkpanel").show();
     
     });
    
    
    };
        $scope.ConceptInk=function(){ 
    
     $(document).ready(function(){
     
     $("#newpostpanel").hide();
    $("ConceptInkpanel").show();
     
     });
    
    
    };
        $scope.ServiceInk=function(){ 
    
     $(document).ready(function(){
     
     $("#newpostpanel").hide();
    $("ServiceInkpanel").show();
     
     });
    
    
    };
        $scope.EntertainmentInk=function(){ 
    
     $(document).ready(function(){
     
     $("#newpostpanel").hide();
    $("EntertainmentInkpanel").show();
     
     });
    
    
    };
        $scope.ProductInk=function(){ 
    
     $(document).ready(function(){
     
     $("#newpostpanel").hide();
    $("ProductInkpanel").show();
     
     });
    
    
        };
    
 // var  person={};
     //   $(function(){person.inkurl=$("#person_url").val();person.review=$("#buffer_store_person").val();});
     $scope.Submit_Person=function(){ 
        // console.log('fired');
         console.log($scope.person);
         $scope.review=$scope.person;
         $scope.review.type='person';
         $http.post('/newview',$scope.review).success(function(response){
             
             $(document).ready(function(){
             if(response.error)
             {
             var string='';
                 string = '<div class="alert alert-danger">'+response['error']+'</div>';
             $("#error_person").html(string);
             }
                 else if(response.done)
                 {
                     var string='';
                     string='<div class="jumbotron">Please verify your mail now, by visiting your email and click on the Verification link we just mailed to you. We can not wait to see you at Indian Panther. You will be redirected shortly</div>';
                     $("#error_reg_box").html(string);
                     setTimeout(function() { window.location ='/'; }, 5000);
                     
                 }
             
         });
            
   
    
    });
    
    };
                                      
                                      
    }
                                      
                                       
                                      
    ]);