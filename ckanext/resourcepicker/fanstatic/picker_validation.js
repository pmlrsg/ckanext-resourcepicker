var error = false; // Starter value of false for no errors
var error_list = [];

$(document).ready(function(){
   show_URL_help();

   $('.form-actions .btn-primary').on('click', function(e){ // When you click to submit (Update Resource)
      var picker_url = $('#field-image-url').val(); // Store the given URL in a parameter ready for validation
      if($('#select2-chosen-1').html() == 'Picker'){ // If the format is 'Picker'
         picker_url = $('#field-image-url').val(); // Store the given URL in a parameter ready for validation

         // This block gets all the values that should be in the URL and verifies them
         var start = (url_get(picker_url, 'start'));
         check_start(start);
         var end = (url_get(picker_url, 'end'));
         check_end(end);
         var path = (url_get(picker_url, 'path'));
         check_path(path);
         var domain = (url_get(picker_url, 'domain'));
         check_domain(domain);

      }
     

      if(error_list.length !== 0){ // Sets the error variable
         error = true;
      }
      else{
         error = false;
      }

      // This block removes and previous errors
      $('.error-block').remove();
      $('#field-image-url').parent().parent().removeClass("error");
      $('.error-explanation').remove();

      if(error){ // If there is an error
         e.preventDefault(); // Stops the form submition
         
         // This block then adds the errors and error formatting
         $('#field-image-url').parent().append('<span class="error-block">Invalid Picker URL See Above For Details</span>');
         $('#field-image-url').parent().parent().addClass("error");
         $('#resource-edit').prepend(create_error_explanation());
         error_list = []; // Resets the error list after
      }
   });
   $('#field-format').on('change', function(e){ // when you change the format, it changes the page accordingly
      show_URL_help();
   });
});

var check_start = function check_start(start) { // This function chacks the validity of the start
   if (start === undefined){
      error_list.push("URL: You must specify a start date");
   }
   else if (!start.match(/(\d{4})-(\d{2})-(\d{2})/)){
      error_list.push("URL: Start date must be in the format: yyyy-mm-dd");
   }
};

var check_end = function check_end(end) { // This function chacks the validity of the end
   if (end === undefined){
      error_list.push("URL: You must specify an end date");
   }
   else if (!end.match(/(\d{4})-(\d{2})-(\d{2})/)){
      error_list.push("URL: End date must be in the format: yyyy-mm-dd");
   }
};

var check_path = function check_path(path) { // This function chacks the validity of the url
   if (path === undefined){
      error_list.push("URL: You must specify a path");
   }
};

var check_domain = function check_domain(domain) { // This function chacks the validity of the domain
   if (domain === undefined){
      error_list.push("URL: You must specify a domain");
   }
   else if (!((/^http:\/\//).test(domain)||(/^https:\/\//).test(domain))){
      error_list.push("URL: Your domain should begin with 'http://' or 'https://'");
   }
};

var create_error_explanation = function create_error_explanation(){ // This returns a div with the correct listing of the error(s)
   var html_error_list = "<ul>" // Starts the list
   for(var i=0; i<error_list.length; i++){
      html_error_list += "<li>"+error_list[i]+"</li>"; // Adds each error to the list
   }
   html_error_list += "</ul>"; // Closes the list
   var error_string = '<div class="error-explanation alert alert-error"><p>The form contains invalid entries:</p>' + html_error_list + '</div>'; // Adds the error div and puts the list in there
   return error_string;
};

var show_URL_help = function show_URL_help(){
   if($('#field-format').val() === 'Picker'){
         $('#picker-pointer').show();
      }
      else{
         $('.error-block').remove();
         $('#field-image-url').parent().parent().removeClass("error");
         $('.error-explanation').remove();
         $('#picker-pointer').hide();
      }
}
