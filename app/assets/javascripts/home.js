$(document).ready(function() {
  var houses = null;
  var users = null;
  var votes = null;
  var fbUserInfo = null;
  var fbFriends = null;
  var touchHouses = new Array();
  var choices = new Array("","","");
  var chosenIDs = new Array("","","");
  var $selections = $( "#selections" );
  var touchDevice = Modernizr.touch;
  var saving = false;
  var custom = false;
  //var invited = ["19600245","26904108","36400111","36400222","36402585","36405216","36406896","36409763","68302058","508750472","100000313172773","100000645482115","16320868","36400025","36400078","36400272","36400277","36400405","36400913","36401292","36402678","36403066","36403766","36407513","198900007","511794795","617647469","625495213","783068255","1044233749","36400432","553586954","1782894834","36400584","36400937","79201405","592801990","736950829","1157138915","1450489800","100000495870476"];
  var invited = ["36400272","100000645482115","36400913","36403766","36401292","79201405","1044233749","625495213","36400584","36400432","36403066","36409763","617647469","198900007","36400277","36407073","36407513","36402678","36400937","16305798","553586954","8112582","36400078","592801990","100002186524607","100002237553550","509338848","16320868","36400025","36400111","36400222","36400405","36401426","36402585","36405216","36406896","68302058","508750472"];

  $.template('house-div', '<div id="${slug}" data-id="${id}" class="house"><div class="pedestal"><a href="#" class="more-info">i</a><img src="/assets/${slug}.jpeg" /></div><p>${name}</p></div>');
  $.template('graph-item', '<div class="item"><div class="bar"><div class="value" style="height: ${barheight}px;"></div></div><div class="info"><div class="pedestal"><img src="/assets/${slug}-s.jpeg" /></div><p class="title">${name}</p><p class="score">${points} points</p></div></div>');
  $.template('detail', '<div class="image"><img alt="${name}" src="/assets/${slug}.jpeg"></div><h3>${name}</h3><p><a href="${url}" target="_blank">View on Homeaway</a></p><p class="synopsis"><strong>Description:</strong> ${description}</p>');
  $.template('friend', '<div class="friend"><ul><li><div class="user-image"><img src="${image}" /></div><p>${name}</p></li><li><div class="number">1:</div><div class="image"><img src="/assets/${house1image}-m.jpeg" /></div><p>${house1name}</p></li><li><div class="number">2:</div><div class="image"><img src="/assets/${house2image}-m.jpeg" /></div><p>${house2name}</p></li><li><div class="number">3:</div><div class="image"><img src="/assets/${house3image}-m.jpeg" /></div><p>${house3name}</p></li></ul></div>');

  window.fbAsyncInit = function() {
    FB.init({
      appId      : '222461704520648', // App ID
      channelUrl : '//schmettling.com/channel.html', // Channel File
      status     : true, // check login status
      cookie     : true, // enable cookies to allow the server to access the session
      xfbml      : true  // parse XFBML
    });
    FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        var uid = response.authResponse.userID;
        var accessToken = response.authResponse.accessToken;
        $("#login").hide();
        initializeUser();
      } else if (response.status === 'not_authorized') {
        // the user is logged in to Facebook,
        //but not connected to the app
      } else {
        // the user isn't even logged in to Facebook.
      }
    });
  };


  //get the list of houses and populate them
  $.ajax({
    url: '/houses',
    success: function( data ) {
      houses = data;
      $.each( houses, function(i, house){
         $.tmpl("house-div", house).insertBefore("#choices .clearer");
      });
      scorehouses(custom);
      $(".house .more-info").click(function(e) {
        e.preventDefault();
        openhouseDetail($(this).parents('.house')[0].id);
      });
      //setupSelector();
    }
  });

  /*get a list of users
  $.ajax({
    url: '/users',
    success: function( data ) {
      users = data;
      console.log(users);
    }
  });*/

  //get an object of all the votes
  /*$.ajax({
    url: '/votes',
    success: function( data ) {
      votes = data;
      //console.log(votes);
    }
  });*/

  $("#friends-refresh").click(function(e) {
    e.preventDefault();
    $("#friend-nav ul").hide();
    showFriends();
  });

  $("#results-refresh").click(function(e) {
    e.preventDefault();
    scorehouses(custom);
  });

  $("#detail-close").click(function(e){
    e.preventDefault();
    closehouseDetail();
  });

  $("#custom-results-toggle").click(function(e) {
    e.preventDefault();
    custom = !custom;
    if (custom) {
      $(this).html("View All Results");
    }
    else {
      $(this).html("View Only Watch-A-Thon Results");
    }
    scorehouses(custom);
  });

  $("#fb-login").click(function(e) {
    e.preventDefault();

    /*$("#login").hide();
    $("#subtitle").show();
    $("#selections").show();
    setupSelector();
    loadUsersVotes();*/

    FB.login(function(response) {
      if (response.authResponse) {
        initializeUser();
      } else {
        alert('Facebook login was unsuccessful. Please try again.');
      }
    });
  });

  function openhouseDetail(slug){
    $.each( houses, function(i, house){
      if(house['slug'] == slug) {
        $("#detail-template").html("");
        $.tmpl("detail", house).appendTo("#detail-template");
      }
    });
    $('#housedetailbg').show();
    $('#housedetail').show();
  }
  function closehouseDetail(){
    $('#housedetailbg').hide();
    $('#housedetail').hide();
  }

  function initializeUser() {
    FB.api('/me', function(response) {
      fbUserInfo = response;
      if (fbUserInfo['id'] != null) {
        if (($.inArray(fbUserInfo['id'], invited))>=0 ) {
          $.ajax({
            type: "POST",
            url: '/users',
            data: { "user": { "name": fbUserInfo["name"], "email": "", "fbid": fbUserInfo["id"] }},
            success: function(response) {
              $("#login").hide();
              $("#subtitle").show();
              $("#selections").show();
              loadUsersVotes();
              getUserImages();
              if( $.inArray(fbUserInfo["id"], invited) >= 0 ) {
                $('#nav li.custom').show();
              }
            },
            error: function(response) {
              if(response['responseText'] == '{"fbid":["has already been taken"]}')
              {
                $("#login").hide();
                $("#subtitle").show();
                $("#selections").show();
                loadUsersVotes();
                getUserImages();
                if( $.inArray(fbUserInfo["id"], invited) >= 0 ) {
                  $('#nav li.custom').show();
                }
              }
            }
          });
        }
        else {
          alert ("Sorry dude. You have to be invited to vote.");
        }
      }
    });
  }

  function generateGraph(houseScores, totalPoints) {
    $('.graph .item').remove();
    $.each( houseScores, function(i, house){
      var height = (house['points']/totalPoints)*208;
      $.tmpl("graph-item", {"barheight": height, "slug": house['slug'], "name": house['name'], "points": house['points'] }).appendTo(".graph");
    });
  }

  function getUserImages() {
    $.ajax({
      url: '/users',
      success: function( data ) {
        users = data;
        $.each( users, function(i, user){
          var userImage = null;
          FB.api('/'+user['fbid']+'/picture', function(response) {
            userImage = response;
            user['image'] = userImage;
          });
        });
      }
    });
  }

  function showFriends() {
    $("#friend-results").html("");
    var numFriends = 0;
    $.each( fbFriends, function(h, friend){
      $.each( users, function(i, user){
        if(user['fbid'] == friend['uid']) {
          numFriends += 1;
          if (user['fbid'] == "36400913") {
            var userInfo = {"image": user['image'], "name": user['name'], "house1image": "leprechaun-in-the-hood", "house1name": "Leprechaun in the Hood", "house2image": "leprechaun-in-the-hood", "house2name": "Leprechaun in the Hood", "house3image": "leprechaun-in-the-hood", "house3name": "Leprechaun in the Hood"}
          }
          else {
            var userInfo = {"image": user['image'], "name": user['name'], "house1image": "blank", "house1name": "", "house2image": "blank", "house2name": "", "house3image": "blank", "house3name": ""}
            $.each( votes, function(j, vote){
              if(vote['voter'] == user['fbid']) {
                $.each( houses, function(k, house){
                  if(vote['house'] == house['id'])
                  {
                    if (vote['house'] != null) {
                      if (vote['rank'] == 1){
                        userInfo['house1image'] = house['slug'];
                        userInfo['house1name'] = house['name'];
                      }
                      else if(vote['rank'] == 2){
                        userInfo['house2image'] = house['slug'];
                        userInfo['house2name'] = house['name'];
                      }
                      else if(vote['rank'] == 3){
                        userInfo['house3image'] = house['slug'];
                        userInfo['house3name'] = house['name'];
                      }
                    }
                  }
                });
              }
            });
          }
          $.tmpl("friend", userInfo).appendTo("#friend-results");
        }
      });
    });
    if (numFriends == 0){
      $("#friend-results").html("<p>None of your friends have voted yet!</p>");
    }
    $("#friend-results").show();
  }

  function scorehouses(custom) {
    $.ajax({
      url: '/votes',
      success: function( data ) {
        votes = data;
        var totalPoints = 0;
        var houseScores = [];
        var customPoints = 0;
        var customScores = [];
        $.each( houses, function(i, house){
          var houseCount = 0;
          var customCount = 0;
          $.each( votes, function(j, vote){
            if(vote['house'] == house['id']) {
              if(vote['rank'] == 3) { houseCount += 1; }
              else if(vote['rank'] == 2) { houseCount += 2; }
              else if(vote['rank'] == 1) { houseCount += 3; }
            }
            if(  (vote['house'] == house['id'])&&(($.inArray(vote['voter'], invited))>=0 )  ) {
              if(vote['rank'] == 3) { customCount += 1; }
              else if(vote['rank'] == 2) { customCount += 2; }
              else if(vote['rank'] == 1) { customCount += 3; }
            }
          });
          totalPoints += houseCount;
          customPoints += customCount;
          houseScores.push( {"slug": house['slug'], "name": house['name'], "points": houseCount} );
          customScores.push( {"slug": house['slug'], "name": house['name'], "points": customCount} );
        });
        houseScores.sort(function(a, b){
          return b.points-a.points
        });
        customScores.sort(function(a, b){
          return b.points-a.points
        });
        if (custom)
        {
          generateGraph(customScores, customPoints);
        }
        else {
          generateGraph(houseScores, totalPoints);
        }
      }
    });
  }

  function loadUsersVotes() {
    $.each( votes, function(i, vote){
      if(vote['voter'] == fbUserInfo['id'])
      {
        chosenIDs[((vote['rank'])-1)] = vote['house'];
        $.each( houses, function(j, house){
          if(vote['house'] == house['id'])
          {
            choices[((vote['rank'])-1)] = house['slug'];
          }
        });
      }
    });

    $.each( choices, function(i, choice){
      if(choice != ""){
        $item = $("#"+choice);
        $choice = $("#vote"+(i+1));
        $item.fadeOut(0,function() {
          $item
            .appendTo( $choice )
            .fadeIn(0);
        });
        $choice.find(".instructions").fadeOut('fast');
      }
    });
    if( choices[0] != "" ) {
      $('#nav li.post').show();
    }
    setupSelector();
    FB.api(
      {
        method: 'fql.query',
        query: 'select uid, name, is_app_user from user where uid in (select uid2 from friend where uid1=me()) and is_app_user=1'
      },
      function(response) {
        fbFriends = response;
        $("#friend-nav").show();
      }
    );
  }

  function setupSelector() {
    if(touchDevice){
      createTouchDraggables();
      $('#selections li').each(function(index) {
          var drop = $(this)[0].id;
          webkit_drop.add(drop, {hoverClass : 'state-hover', onDrop : function(d,e,f){ addSelection(d,f); } } );
      });
    }
    else{
      $choices = $( "#choices" );

      //make houses draggable
      $( ".house" ).draggable({
        revert: "invalid",
        helper: "clone",
        cursor: "move"
      });

      //allow houses to be dropped into rankings
      $( "li", $selections ).droppable({
        accept: ".house",
        activeClass: "state-highlight",
        hoverClass: "state-hover",
        drop: function( event, ui ) {
          addSelection( ui.draggable, $(this) );
        }
      });

      //allow houses to be dropped back into the list for removal
      $choices.droppable({
        accept: "#selections .house",
        activeClass: "custom-state-active",
        drop: function( event, ui ) {
          removeSelection( ui.draggable );
        }
      });
    }
  }

  function saveVotes() {
    if (fbUserInfo['id'] != null) {
      var votes = { "selections": {"user": fbUserInfo['id'], "vote1": chosenIDs[0], "vote2": chosenIDs[1], "vote3": chosenIDs[2] }};
      $.ajax({
        type: "POST",
        url: '/votes',
        data: votes,
        success: function() {
          saving = false;
          //$(".saving").hide();
          scorehouses(custom);
        }
      });
    }
  }

  function removeSelection( $item ) {
    if (!saving) {
      saving = true;
      $item.fadeOut('fast',function() {
        $item
          .insertBefore( '#choices .clearer' )
          .fadeIn('fast');
      });
      
      choices[$.inArray($item[0].id, choices)] = "";
      chosenIDs[$.inArray(Number($item.attr("data-id")), chosenIDs)] = "";
      if(choices[0] == ""){
        $('#nav li.post').hide();
      }
      saveVotes();
    }
  }
  
  function createTouchDraggables() {
    if(touchDevice){
      $.each(houses, function(i, house){
        touchhouses.push( new webkit_draggable(house['slug'], {revert : true, scroll : true, onStart : function(){ $('#selections li').addClass('state-highlight'); }, onEnd : function(){ $('#selections li').removeClass('state-highlight'); } } ) );
      });
    }
  }

  function addSelection( $item, $choice ) {
    if (!saving) {
      saving = true;
      if(touchDevice){
        $.each(touchhouses, function(i, house){
          house.destroy();
        });
        
        var houseName = $item.id;
        var choiceNumber = $choice.id.replace("vote", "");
        $item = $("#"+houseName);
        $choice = $("#vote"+choiceNumber);
      }
      else {
        var houseName = $item[0].id;
        var choiceNumber = $choice[0].id.replace("vote", "");
      }
      var existinghouse = choices[(choiceNumber-1)];
      var droppedArrayPos = $.inArray(houseName, choices);
      var existingArrayPos = $.inArray(existinghouse, choices);
      
      if(choiceNumber == 1){
        $('#nav li.post').show();
      }
      if (existinghouse == "") {
        $item.fadeOut('fast',function() {
          $item
            .appendTo( $choice )
            .fadeIn('fast', function(){
              createTouchDraggables();
            });
        });
        $choice.find(".instructions").fadeOut('fast');
        if( droppedArrayPos > -1 ){
          choices[droppedArrayPos] = "";
        }
        choices[(choiceNumber-1)] = houseName;
        chosenIDs[(choiceNumber-1)] = $("#"+houseName).attr("data-id");
      }
      else if (existinghouse != "")
      {
        var $oldItem = $("#"+existinghouse);
        if ((existinghouse != houseName)&&( droppedArrayPos > -1 ))
        {
          $oldItem.fadeOut('fast',function() {
            $oldItem
              .appendTo( $("#vote"+(droppedArrayPos+1)))
              .fadeIn('fast');
          });
          $item.fadeOut('fast',function() {
            $item
              .appendTo( $choice )
              .fadeIn('fast', function(){
                createTouchDraggables();
              });
          });
          choices[droppedArrayPos] = existinghouse;
          choices[existingArrayPos] = houseName;
          chosenIDs[droppedArrayPos] = $("#"+existinghouse).attr("data-id");
          chosenIDs[existingArrayPos] = $("#"+houseName).attr("data-id");
        }
        else
        {
          $oldItem.fadeOut('fast',function() {
            $oldItem
              .insertBefore( '#choices .clearer' )
              .fadeIn('fast');
          });
          if(touchDevice){
            $oldItem.css("position", "relative");
          }
          $item.fadeOut('fast',function() {
            $item
              .appendTo( $choice )
              .fadeIn('fast', function(){
                createTouchDraggables();
              });
          });
          choices[(choiceNumber-1)] = houseName;
          chosenIDs[(choiceNumber-1)] = $("#"+houseName).attr("data-id");
        }
      }
      if(touchDevice){
        $item.css({"top": "0px", "left": "0px", "position": "absolute"});
      }
      saveVotes();
    }
  }
});