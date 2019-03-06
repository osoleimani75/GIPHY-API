var giphyApp={
    listData: ['Cat','Dog','Rabbit'],
    favList: [],

    fetchData: function(animal){
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + animal + "&api_key=emlZYvst1c0fhDOIn1fbgFHXovCQRQws&limit=10";  
        $.ajax({
            url: queryURL,
            method: "GET"
          }).then(this.createPage);
          $("#TitlePage").text(animal).css('textTransform', 'capitalize');
        
    },

    // Generate Top List 
    generateList: function(newText){
        $("#ListData").empty();
        if (!!newText)
            giphyApp.listData.push(newText);
        for (var i=0; i<giphyApp.listData.length; i++){
            $('<a>')
            .addClass("dropdown-item dList")
            .text(giphyApp.listData[i])
            .appendTo($("#ListData")); 
        }

        $(".dList").click(function(){
            $("#resultCards").empty();
            $("#TitlePage").text("")
            giphyApp.fetchData(this.text);
        })
    },
    // Add new item to list 
    addToFav: function(objectData,id, stat){

        if (stat){
            for (var i=0; i<objectData.data.length; i++)
                if (id == objectData.data[i].id){
                    giphyApp.favList.push(objectData.data[i]);

                }
            }
            else 
                for (var i=0; i< giphyApp.favList.length; i++)
                    if (id ==  giphyApp.favList[i].id)
                        giphyApp.favList.splice(i,1);

        giphyApp.createFavMenu();
    }, 

    visibleFav: function(n){
            if (n===1)
                return "fas"
            else    
                return "far" 
    },


    checkFav: function(Id){

        for (var i=0; i<giphyApp.favList.length; i++){
           var ch =1
            if (Id == giphyApp.favList[i].id){
                break;
            }
                
            else ch = 0 
        }
    return ch

    },


    // create Favorite Menu
    createFavMenu: function(){

        $('#favData').empty();

        for (var i=0; i<giphyApp.favList.length; i++){


            var favUl = $('<ul>')
                .addClass("list-unstyled");

            var favLi = $('<li>')
                .addClass("media");
                $('<img />')
                .attr('src', "" + giphyApp.favList[i].images.original_still.url + "")        
                .attr('alt', giphyApp.favList[i].title)
                .height('75px')
                .width('75px')
                .addClass("mr-3")
                .appendTo($(favLi)); 

            var mediaBody= $('<div>')
                .addClass("media-body")
                .appendTo($(favLi)); 
                
                $('<h5>')
                .addClass("mt-0 mb-1")
                .html("<b>Rating :</b> <span>"+ giphyApp.favList[i].rating +"</span>")
                .appendTo($(mediaBody));

                $('<p>')
                .html("<b>Title :</b><span> "+giphyApp.favList[i].title+"</span> ")
                .appendTo($(mediaBody));   
                $("<hr>").appendTo(mediaBody)
                favLi.appendTo(favUl);
                favUl.appendTo("#favData")
        }


    },
    // Create Page Result 
    createPage: function(resulData){
        var countRecord = resulData.data.length;
        for (var i=0; i<countRecord; i++){
            var cardDiv = $("<div>").addClass("card"); 
            // Add Image Card 
                $('<img />')
                .attr('src', "" + resulData.data[i].images.original_still.url + "")
                .attr("data-still","" + resulData.data[i].images.original_still.url + "")     
                .attr("data-animate","" + resulData.data[i].images.original.url + "")     
                .attr("data-state","still")     
                .attr('alt', resulData.data[i].title)
                .height('250px')
                .addClass("img-fluid img-thumbnail")
                .appendTo($(cardDiv)); 



            // Create Body Card
                var cardBodyDiv=  $('<div>')
                                  .addClass("card-body")
                                  .appendTo($(cardDiv)); 

            //  Rating Field 
                $('<h5>')
                .addClass("text-left d-inline")
                .html("<b>Rating :</b> <span>"+ resulData.data[i].rating +"</span>")
                .appendTo($(cardBodyDiv));


            // Favorite Icon    
                var favIcon = $('<i data-toggle="tooltip"  data-id='+ resulData.data[i].id +' title="Favorite" >')
                .attr("data-fav", giphyApp.checkFav(resulData.data[i].id) )
                .addClass(" fa-heart icon fav-icon " +giphyApp.visibleFav(giphyApp.checkFav(resulData.data[i].id)) )
                $(favIcon).appendTo($(cardBodyDiv));


            // Download Icon    
                var downloadIcon=  '<a target="_blank" href="'+resulData.data[i].images.downsized_small.mp4 +'" download ><i data-toggle="tooltip" title="Download" class="fal fa-file-download icon dl-icon"></i></a> <hr>';
                
            $(downloadIcon).appendTo($(cardBodyDiv));
  
            //  Title Field 
                $('<p>')
                .html("<b>Title :</b><span> "+resulData.data[i].title+"</span>")
                .appendTo($(cardBodyDiv));            

            //  Trending Datetime
                $('<p>')
                .html("<b>Trending Date :</b> <span>"+ resulData.data[i].trending_datetime.substring(0,10) +"</span>")
                .appendTo($(cardBodyDiv));  

            //  Trending Datetime
                $('<a target="_blank">')
                .attr("href",resulData.data[i].embed_url)
                .html('<img src="assets/images/embed.png" style="width: 28px;"> Embed URL')
                .appendTo($(cardBodyDiv));  

                $("#resultCards").append(cardDiv); 

        }

        // Icons hover change 

            $('.fav-icon').on('click', function(event){
                if($(this).attr("data-fav")==0){
                    $(this).addClass('fas').removeClass('far');
                    $(this).attr("data-fav",1);
                    var myId =  $(this).attr("data-id");

                    giphyApp.addToFav(resulData,myId, 1);
                } else {
                    $(this).addClass('far').removeClass('fas');
                    $(this).attr("data-fav",0);
                    var myId =  $(this).attr("data-id");

                    giphyApp.addToFav(resulData,myId, 0);
                }
            });
            
            $("img").on("click", function() {
                var state = $(this).attr("data-state");
                if (state === "still") {
                  $(this).attr("src", $(this).attr("data-animate"));
                  $(this).attr("data-state", "animate");
                } else {
                  $(this).attr("src", $(this).attr("data-still"));
                  $(this).attr("data-state", "still");
                }
              });    
    } 


}



$( document ).ready(function() {
    $("#addNewBtn").on("click", function(event) {
        event.preventDefault();
        giphyApp.generateList($("#newItemTxt").val());
        $("#newItemTxt").val("")
      });


    giphyApp.generateList();
    giphyApp.fetchData("cat");
        
});