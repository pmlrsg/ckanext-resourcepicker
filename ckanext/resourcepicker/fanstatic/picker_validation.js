var error = false; // Starter value of false for no errors
var error_list = [];

$(document).ready(function(){

   $('.form-actions .btn-primary').on('click', function(e){ // When you click to submit (Update Resource)
      var picker_url = $('#field-image-url').val(); // Store the given URL in a parameter ready for validation
      if($('#select2-chosen-1').html() == 'Picker'){ // If the format is 'Picker'
         picker_url = $('#field-image-url').val(); // Store the given URL in a parameter ready for validation
         var start = (url_get(picker_url, 'start'));
         check_start(start);
         var end = (url_get(picker_url, 'finish')); // Change to end next type you run the script
         check_end(end);
         var path = (url_get(picker_url, 'path')); // Change to end next type you run the script
         check_path(path);
      }

      if (error){
         e.preventDefault();
         $('.error-block').remove();
         $('#field-image-url').parent().parent().removeClass("error");
         $('.error-explanation').remove();
         $('#field-image-url').parent().append('<span class="error-block">Invalid Picker URL See Above For Details</span>');
         $('#field-image-url').parent().parent().addClass("error");
         $('#resource-edit').prepend(create_error_explanation());
         error_list = [];
         error = false;
      }
   });
});

var check_start = function check_start(start) { // This function chacks the validity of the start
   if (start === undefined){
      error = true;
      error_list.push("URL: You must specify a start date");
   }
   if (!start.match(/(\d{4})-(\d{2})-(\d{2})/)){
      error = true;
      error_list.push("URL: Start date must be in the format: yyyy-mm-dd");
   }
};

var check_end = function check_end(end) { // This function chacks the validity of the end
   if (end === undefined){
      error = true;
      error_list.push("URL: You must specify an end date");
   }
   if (!end.match(/(\d{4})-(\d{2})-(\d{2})/)){
      error = true;
      error_list.push("URL: End date must be in the format: yyyy-mm-dd");
   }
};

var check_path = function check_path(path) { // This function chacks the validity of the url
   if (path === undefined){
      error = true;
      error_list.push("URL: You must specify a path");
   }
};

var create_error_explanation = function create_error_explanation(){
   var html_error_list = "<ul>"
   for(var i=0; i<error_list.length; i++){
      html_error_list += "<li>"+error_list[i]+"</li>";
   }
   html_error_list += "</ul>";
   var error_string = '<div class="error-explanation alert alert-error"><p>The form contains invalid entries:</p>' + html_error_list + '</div>';
   return error_string;
};