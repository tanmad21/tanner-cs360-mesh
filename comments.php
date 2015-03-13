<!DOCTYPE html>
<html>
  <?php include 'navigation.htm' ?>
  <h2 class='main-page-header'>Comments</h2>
  <form id="comments-form" action="" class="weather-form">
    <div>
      <label for="comment-name">Name: </label>
      <input type="text" id="comment-name"/>
    </div>
    <div>
      <label for="comment-comment">Comment: </label>
      <input type="text" id="comment-comment"/>
    </div>
    <input type="submit" value="Comment" id="comment-submit"/>
    <input type='button' id='get-comments' value='Show Comments'/><br>
    <div id="json-to-send">
    </div>
  </form>
  <div class='weather-form'>
    <br><hr><br>
    <div>Current Comments:</div>
    <ul id='comments-list'>
    </ul>
  </div>
</body>
<script>
$(document).ready(function() {
  $('#get-comments').on("click",function(e) {
 
    var api = "http://52.11.39.168:8080/comment";
    $.ajax({
      type: "GET",
      url: api
    })
    .done(function(data) {
      console.log(data);
      var comments = JSON.parse(data);
      console.log(comments);
      $("#comments-list").html("");
      for(var i=0; i < comments.length; i++) {
        console.log(comments[i]);
        $("#comments-list").append("<li>Name: " + comments[i]["Name"]
                                 + "<br>Comment:"+comments[i]["Comment"] 
                                 +"</li>");
      }
    })	
    .fail(function(data,err) {
      alert("Something went wrong!");
    })   
  });
  $("#comment-submit").on("click",function(e) {
    e.preventDefault();
    var data = {
                 Name: $("#comment-name").val(),
                 Comment: $("#comment-comment").val()
               };

    var jsonData = JSON.stringify(data);
    $("#json-to-send").text(jsonData);

    var api = "http://52.11.39.168:8080/comment";
    $.ajax({
      type: "POST",
      url: api,
      data: jsonData
    })
    .done(function(data) {
      console.log(data);
    })	
    .fail(function(data,err) {
      alert("Something went wrong!");
    })


//    $.post(api,jsonData,function(data) {
//      console.log(data);
//    },"json");
  });
});
</script>
</html>
