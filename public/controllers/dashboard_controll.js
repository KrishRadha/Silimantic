var dashapp=angular.module('dashboardapp',[]);


dashapp.controller('DashCont',['$scope','$http', '$compile','$sce',
                            
                           
    function DashCont($scope,$http,$compile,$sce){
    
//
        var socketio = io.connect("127.0.0.1:3000");
        function SendMessage() {
    var msg = document.getElementById("message_input").value;
            var sending=[];
            sending['username']="random";
            sending['chat']=msg;
    socketio.emit("message_to_server", { message : sending});
}
        socketio.on("message_to_client", function(data) {
    document.getElementById("chatlog").innerHTML = (
        ' <div class="row"><div class="col-md-2"><h4 style="color:red"> '+data['message']['username']+' : </h4></div>  <div class="col-md-10"><h4 style="color:green"> '+data['message']['chat']+' </h4></div>   </div> <hr/>' +
     + document.getElementById("chatlog").innerHTML);
            
            
});
    
$http.get('/trends').success(function(response){
        
    //trends colors
    $(document).ready(function(){
    
    var color1='#e67e22';
    var color2='#f1c40f';
    
     var string='';
        if(response.error)
        {
           
            string=string+'<tr><td style="background-color:'+color1+'">'+response.error+'</td></tr> ';
            
            $("#trendset").html(string);
        }
            else if(response.done)
            {
                
                var trends=response.done;
                for(i in trends)
                {
                    if(i%2==0)
                    string=string+'<tr><td style="background-color:'+color1+'">'+trends[i]+'</td></tr> ';
                    else
                        string=string+'<tr><td style="background-color:'+color2+'">'+trends[i]+'</td></tr> ';
                   
                        
                }
                 
            $("#trendset").html(string);
            }
        
        });
        });
        
        $http.get('/news').success(function(response){
            
            
            
        });
        
        
    
    }
                              
                              ]);
              