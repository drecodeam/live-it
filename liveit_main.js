 
$(document).ready(function(){
/*insert live it notification html*/
var insert_html_text='<div id="liveit"><div id="liveit_edit"></div><div id="liveit_sidebar"><div id="liveit_head"><div id="liveit_menu"><div id="typo" class="selector"></div><div id="color" class="selector"></div><div id="default" class="selector selected"></div><div class="right-arrow"></div></div><div id="toggle" class="btn"><div class="computed">COMPUTED</div><div class="direct">DIRECT</div></div></div><div class="up-arrow"></div><div id="liveit_rules"><div id="liveit_direct_rules"></div><div id="liveit_computed_rules"></div></div></div><div id="liveit_bottom"><ul id="liveit_breadcrumb" class="breadcrumb"></ul><div id="liveit_save_button" class="btn">Save</div></div></div>';
$('body').append(insert_html_text);
$('#liveit_bottom').append('<div class="liveit_notify"><div id="liveit_notify_spinner"></div></div>');
/*end*/
/*declarations*/
   
var liveit_spinner_opts = {
  lines: 12, // The number of lines to draw
  length: 4, // The length of each line
  width: 2, // The line thickness
  radius: 5, // The radius of the inner circle
  color: '#251255', // #rgb or #rrggbb
  speed: 1, // Rounds per second
  trail: 60, // Afterglow percentage
  shadow: false, // Whether to render a shadow
  hwaccel: false, // Whether to use hardware acceleration
  className: 'spinner', // The CSS class to assign to the spinner
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  top: 'auto', // Top position relative to parent in px
  left: 'auto' // Left position relative to parent in px
};

var spinner;
var liveedit_mode=0;
var liveit_save_index=0;
var current_edit_node='';
var stylesheets=document.styleSheets;
var stylesheet_text=new Array();
/*declarations end*/

var liveit_load_panel=function(){
   $('#liveit_sidebar').show('slow');
   $('#liveit_bottom').show('slow');

/*enter liveit mode on click on trigger*/
$("#liveit_edit").click(function(){
   liveedit_mode=1;
   $('body').animate({'width':'70%'},500);
   
   $('#liveit_sidebar').css("visibility","visible");
   $('#liveit_sidebar').animate({'width':'25%'},500);
   
   detect_hover();
});
/*end*/

/*leave liveit mode on click on trigger*/




/*Notification function*/


var liveit_notify=function(liveit_notify_text){
   $('#liveit_bottom .liveit_notify').append(liveit_notify_text + '<br>'); 
   
   if(liveit_save_index==0){
   var target = document.getElementById('liveit_notify_spinner');
   $('#liveit_bottom .liveit_notify').text('save completed. You may now refresh to see the changes'); 
   spinner.stop(target);
      
   }

}

/*end*/


/*code to cancel out hover and click on the sidebar*/
$('#liveit').mousemove(function(event){
      
      event.stopImmediatePropagation()
      return false;
   });
$('#liveit_bottom').click(function(event){
      event.stopImmediatePropagation()
      return false;
   });

/*click handler to for toggle button to toggle between direct/computed CSS rules*/

$('#toggle').click(function(){
      //$('#toggle').html('COMPUTED');
      $('#liveit_direct_rules').toggle();
      $('#liveit_computed_rules').toggle();
      $('#toggle .direct').toggle();
      $('#toggle .computed').toggle();
}
);

/*end*/


/*handler for save button*/

$('#liveit_save_button').click(function(event){
      //$('#toggle').html('COMPUTED');
            event.stopImmediatePropagation();
            liveit_save();
});
/*end*/

var liveit_edit_change=function(){
   if($('#input_text'))
      {
         var edited_text_val= $('#input_text').val();      

         if(edited_text_val)
         {   
            $('#input_text').remove();     
            var current_edit_node_parent = $(current_edit_node).parent();      
            var edited_text_prop = $(current_edit_node_parent).find('.prop_name');
            edited_text_prop=$(edited_text_prop).html();
            edited_text_prop=edited_text_prop.replace(" ","");
            var edited_text_style=$(current_edit_node_parent).parent();
            edited_text_style=$(edited_text_style).attr('class');
      
            if(edited_text_prop.indexOf('-')>-1)
               {
                  var edited_text_prop=edited_text_prop.split('-');
                  //edited_text_prop[1].charAt(0)=edited_text_prop[1].charAt(0).toUpperCase();
                  function toTitleCase(str)
                     {
                     return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
                     }
                  var camel_case=toTitleCase(edited_text_prop[1]);
                  edited_text_prop=edited_text_prop[0]+camel_case;
               }
      
            if(edited_text_style)
               {
                  edited_text_style=edited_text_style.split('_');
                  var edited_text_stylesheet=edited_text_style[1];
                  var edited_text_rule=edited_text_style[2];
                  console.log(edited_text_stylesheet + ':' + edited_text_rule);
                  set_property(edited_text_stylesheet,edited_text_rule,edited_text_prop,edited_text_val);                            
               }
            $(current_edit_node).html(edited_text_val);
            $(current_edit_node).css("display","inline");
         }
         
         else{
                        $('#input_text').remove();     

               $(current_edit_node).css("display","inline");
         }
      }
}


/*resolving clicks in the sidebar*/

$('#liveit_sidebar').click(function(event){
      
      event.stopImmediatePropagation();
      liveit_edit_change();
      
      return false;
   });

/*end*/

liveit_highlight_target=function(){
   if ($(event.target) !== currentNode) {
         $(currentNode).removeClass('liveit border');
         currentNode = $(event.target);
         $(currentNode).addClass('liveit border');
         }
}


//detecting hover over element
var detect_hover = function(){

   var currentNode = null;
   $('body').mousemove(function(event) {
        if ($(event.target) !== currentNode) {
            $(currentNode).removeClass('liveit border');
            currentNode = $(event.target);
            $(currentNode).addClass('liveit border');

         }
      }
   );

};



//getting the node of clicked element
$("body").click(function(event) {
   event.preventDefault();
   if(liveedit_mode==1){
   $('#liveit_direct_rules').text('');
   $('#liveit_computed_rules').text('');
   $('#liveit_bottom #liveit_breadcrumb').html('');
   
   var target = event.target;
   var parents = $(target).parents()
            .map(function () {   
                  if(this.id)
                     {
                    $('#liveit_bottom #liveit_breadcrumb').prepend('<li class=""><a href="#">'+this.tagName + '#' + this.id+'</a></li>'); 
                     }
                  else{
                   //console.log(this.tagName);
                  $('#liveit_bottom #liveit_breadcrumb').prepend('<li class=""><a href="#">'+this.tagName + '</a></li>'); 


                  }
                  
                  })
            .get().join(", ");  

/*if(target.id){
   getCSSRule('#'+target.id);   //call get CSSRule to generate the rules of the clicked element  
};
if(target.tagName){
   getCSSRule('#'+target.tagName);   //call get CSSRule to generate the rules of the clicked element  
};
*/
getCSSRule(target);
get_inherited_rule(target);
   }
});




//getting the inherited values of clicked element

   var get_inherited_rule= function(target){ var style = window.getComputedStyle(target);
   var i=-1;
   $('#liveit_computed_rules').append('<div class="title">Computed Style</div>');
   do{
         i++;

   var prop_name=style[i];
   prop_name=prop_name.toUpperCase();
   var prop_val=style.getPropertyValue(prop_name);
   var inherit_rule='<li><div class="prop_name">'+ prop_name + ': </div><div class="prop_val">' + prop_val +'</div></li>';
   $('#liveit_computed_rules').append(inherit_rule);
   
   }while(style[i]);
   liveit_edit();

  };
  

/*function to set the passed property*/

var set_property = function(stylesheet_index,rule_index,prop_name,prop_val){
  eval('document.styleSheets['+ stylesheet_index + '].cssRules[' + rule_index +']' + '.style.' + prop_name + '="' + prop_val + '"');
  console.log('document.styleSheets['+ stylesheet_index + '].cssRules[' + rule_index +']' + '.style.' + prop_name + '="' + prop_val + '"');
};
/*set_property() ends*/




/*function to get the CSS rule of the given element*/
   
function getCSSRule(ruleName, deleteFlag) {               // Return requested style obejct
   //ruleName=ruleName.toLowerCase();                      // Convert test string to lower case.
      ruleName=$(ruleName);


   if (document.styleSheets) {                            // If browser can play with stylesheets
      for (var i=0; i<document.styleSheets.length; i++)// For each stylesheet
       {
         styleSheet=document.styleSheets[i];          // Get the current Stylesheet
         var ii=0;                                        // Initialize subCounter.
         var cssRule=false;                               // Initialize cssRule. 
	 do {                                             // For each rule in stylesheet
            //stylesheet_text[ii]='';
            if (styleSheet.cssRules)
               { 
                  cssRule = styleSheet.cssRules[ii];
               }
            else
               {
                  cssRule=styleSheet.Rules[ii];
               }
            
	    if (cssRule){						// If we found a rule...    
		var selector=cssRule.selectorText;
		
		if(cssRule){
		    if(cssRule.type==1){
			
			if ($(ruleName).is(selector)){
                           var styleSheet_link=styleSheet.href;
                           styleSheet_link=styleSheet_link.split('/');
                           styleSheet_link=styleSheet_link[styleSheet_link.length-1];
                           
                            var stylesheet_name='<div class="stylesheet_name">' + styleSheet_link +'</div>';
			    var rule=cssRule.cssText;
                            var rule_split=rule.split('{');
                            var selector_name=rule_split[0];
                            var selector_name_text='<div class="selector_name">' + selector_name + '</div>';
                            
                            var rule_properties=rule_split[1].split('}');
                            rule_properties=rule_properties[0];
                            rule_properties=rule_properties.split(';');
                            j=0;
                            var rule_property_text='';
                            
                            do{
                              rule_properties[j]=rule_properties[j].split(':');
                              var rule_property= rule_properties[j][0];
                              var rule_value= rule_properties[j][1];
                              if(rule_property && rule_value){
                              rule_property_text=rule_property_text.concat('<li><div class="prop_name">' + rule_property + '</div>:<div class="prop_val">' + rule_value + '</div></li>'); 
                              }
                              j++;
                            }while(rule_properties[j]);
                            
                            if(selector!='.border'){
                            var cssrule_text='<div class="cssrule">' + rule + '</div>';
                            var rule_class='_'+ i + '_'+ ii;
                           $('#liveit_direct_rules').prepend('<ul class="'+rule_class+ '">'+stylesheet_name+selector_name_text +rule_property_text+'</ul>');
                            }
                            

			}
		    }
		}	       
							// End found rule name
	    }                                             // end found cssRule

            ii++;                                         // Increment sub-counter
         } while (cssRule)                                // end While loop
      }                                                   // end For loop
   }                                                      // end styleSheet ability check
   return false;                                          // we found NOTHING!
}                                                         // end getCSSRule 







/*function to edit the values */

var liveit_edit=function(){

$('#liveit_rules .prop_val').dblclick(function(event){
   event.preventDefault();
   current_edit_node=$(this);
   var value=$(event.target).html();
   $(this).css('display','none');
   $(event.target).parent().append('<input type="text" id="input_text" name="input" value="' +value +'" onclick="liveit_edit_change()"  />')
   $('#input_text').click(function(event){
      event.stopImmediatePropagation();
      return false;

});
   $("#input_text").keypress(function(event) {
  if ( event.which == 13 ) {
     liveit_edit_change();
   }
}); 

   
   });


};
    
var liveit_save=function(){
      $('#liveit_bottom .liveit_notify').show('fast');

            var target = document.getElementById('liveit_notify_spinner');
         spinner = new Spinner(liveit_spinner_opts).spin(target);


   
   if (document.styleSheets) {                            // If browser can play with stylesheets
      for (var i=0; i<document.styleSheets.length; i++) {
        liveit_save_stylesheet=document.styleSheets[i];
        console.log(liveit_save_stylesheet);
        var liveit_save_cssRule=false;
        var ii=0;
         stylesheet_text[i]='';

        do{
            if (liveit_save_stylesheet.cssRules) {                    // Browser uses cssRules?
	    liveit_save_cssRule = liveit_save_stylesheet.cssRules[ii];
            	    if (liveit_save_cssRule){						// If we found a rule...    
                  var save_cssRule_string=liveit_save_cssRule.cssText;
                  save_cssRule_string=save_cssRule_string.replace(/;/gi,';\n');
                  save_cssRule_string=save_cssRule_string.replace(/{/gi,'{\n');
                  save_cssRule_string=save_cssRule_string.replace(/}/gi,'\n}');
                  //save_cssRule_string=save_cssRule_string.replace(/\'\'/gi,'"');
                  //save_cssRule_string=save_cssRule_string.replace(/\'/gi,'\'');

                  stylesheet_text[i]=stylesheet_text[i].concat('\n');

                  stylesheet_text[i]=stylesheet_text[i].concat(save_cssRule_string);
                    }
	    }
            else{
            cssRule=stylesheet.Rules[ii];
            }// End IE check.
            ii++;
        }while(liveit_save_cssRule);
        
        
        var liveit_save_stylesheet_text=stylesheet_text[i];
        console.log(liveit_save_stylesheet_text);
        encodeURIComponent(liveit_save_stylesheet_text);
         //$('#liveit_save_confirm_dialog .save_dialog_content').append(liveit_save_stylesheet_text);
        
        var liveit_save_stylesheet_href = document.styleSheets[i].href;//post css up
        if(liveit_save_stylesheet_href)
        {
         liveit_save_index++;
        $.ajax({
            type: 'POST',
	    url: liveit.ajaxurl, //'./wp-admin/admin-ajax.php'
            data: {
                css: liveit_save_stylesheet_text,
                href: liveit_save_stylesheet_href,
	       action:"liveit_save"
            },
            dataType: "json",
            success: function(data){
                if(data.result == 'success')
                {
                  console.log(data.result+' ---> '+data.feedback);
                 // $('#liveit_bottom').tooltip('show');
                  liveit_save_index--;

                 liveit_notify(data.feedback + ' save successful');
                }
                else {console.log(data.result+' ---> '+data.feedback);}				
            }
        });
        };
    };
    
   };
}
});


    
    
