jQuery(function ($) {
    
    var x = 100000000; 
    var count = Math.floor(Math.random()*x) + 1;
    
	var me = this;
    var connection = null;
    var object_selected = null;
    var windows;
    var arrow_style = "Flowchart";
	var diagram;

	$( "#sortable-element li" ).draggable({
        appendTo: "body",
        helper: function() {
            return $("<ul class='sortable-element'></ul>").append( $(this).clone() );
        }
    });

		$( "#editor" ).droppable({
        accept: "#sortable-element li",
        drop: function(event,ui){
            
            var input;
            var type = $(ui.draggable).attr('attr-type');
            var class_type = 'diagrama';
            count++;
			var sub;

            switch(type){
				case "rectangle":
					class_type = 'rectangle';
					var converter = count.toString();
					sub = converter.concat("task");
					console.log(sub);
				break;
				
				case "circle":
					class_type = 'circle';
					var converter = count.toString();
					sub = converter.concat("start");
					console.log(sub);
				break;
				
				case "diamond":
					class_type = 'diamond';
					var converter = count.toString();
					sub= converter.concat("decision");
					console.log(sub);
				break;
				
				case "para":
					class_type = 'para';
					var converter = count.toString();
					sub= converter.concat("input");
					console.log(sub);
					
				break;
				
				case "swimlane":
					class_type = 'resizable';
				break;

                default:
                    class_type = 'diagrama';
                break;
            }
            
			 $("body").on('click','.object',function(){
			object_selected = this;
			console.log(this);
			me.menu_shape();
			
			
		
			});
			
			
			
			input = "<span>Text</span>"+
                   "<div class='connect'></div>";
            
            var something = $(" <div style='"+position_drop(ui)+"' id='"+sub+"' class='object "+class_type+"'></div> ").append(input).appendTo(this);
            workflow();
        }
    });


    $("body").on('dblclick','.object span',function(){
        var text = prompt("Input Text");
        $(this).html(text);
    });
	

    workflow = function(){
        
       jsPlumb.importDefaults({
            Endpoint : ["Dot", {radius:2}],
            HoverPaintStyle : {strokeStyle:"#1e8151", lineWidth:0 },
            ConnectionOverlays : [
                [ "Arrow", {  
                    location:1,
                    id:"arrow",
                    length:14,
                    foldback:0.8
                } ]
            
			]
        });       

        windows = jsPlumb.getSelector('.object');
		
        
        jsPlumb.makeSource(windows, {

            filter:".connect",               
            anchor:"Continuous",
            connector:[ arrow_style, { curviness:63 } ],
            connectorStyle:{ 
                strokeStyle:"#5c96bc", 
                lineWidth:2, 
                outlineColor:"transparent", 
                outlineWidth:4
            },
            isTarget:true,
            dropOptions : targetDropOptions
            
        }); 

        jsPlumb.makeTarget(windows, {
            dropOptions:{ hoverClass:"dragHover" },
            anchor: "Continuous"             
        });


        var targetDropOptions = {
            tolerance:'touch',
            hoverClass:'dropHover',
            activeClass:'dragActive'
        };
        
        me.arrastrable();

 
		jsPlumb.bind("click", function(conn, originalEvent){
			connection = conn;
			console.log(this);
			me.menu_arrow();
		});
		

    }


    position_drop = function(ui){
        var top = parseInt(ui.position['top'], 10) - 200;
        var left = parseInt(ui.position['left'], 10) - 500;
        var style = 'position:absolute;top:' + top + 'px;left:' + left + 'px;'
        return style;
    }

    
    //Eliminate connection
    $(document).keyup(function(e){
        if(e.keyCode == 46){
            if(connection != null){
                jsPlumb.detach(connection);
                connection = null;
            }

            if(object_selected != null){
                jsPlumb.remove(object_selected);
                object_selected = null;
            }
        }

        console.log(jsPlumb.getSelector('.object'));
    }) 

    //Menu for the connection
    me.menu_arrow = function(){
        $.contextMenu({
            selector: '._jsPlumb_connector ',
            trigger: 'left',
            callback: function(key, options) {
                var m = key;
                me.menu_action(key);
            },
            items: {
                
                "fold1":{
                    "name": "Connector", 
                    "items": {
                        "straight":{"name": "Straight"},
                        "flowchart":{"name": "Flowchart"},
                        "bezier":{"name": "Bezier"},
                        "statemach":{"name": "State Machine"},
                    }
                },
                "fold1a": {
                    "name": "Style", 
                    "items": {
                        "solid":{"name": "Solid"},
                        "broken":  {"name": "Broken"}
                    }
                },
                "sep1": "---------",
				"add_label":{"name": "Set Label", "icon": "add"},
				"del":{"name": "Delete", "icon": "delete"},
            }
        });
    }


    me.menu_action = function(action){
        console.log(connection);
        if(action == "del"){
            jsPlumb.detach(connection, {
                fireEvent: false, 
                forceDetach: false 
            })
        }

        if(action == "straight"){
            connection.setConnector("Straight");
        }

        if(action == "flowchart"){
            connection.setConnector("Flowchart");
        }

        if(action == "bezier"){
            connection.setConnector("Bezier");
        }

        if(action == "statemach"){
            connection.setConnector("StateMachine");
        }

        if(action == "broken"){
            connection.setPaintStyle({ 
                strokeStyle:"#4679BD", 
                lineWidth:2, 
                outlineColor:"transparent", 
                outlineWidth:4,
                dashstyle: "4 2"
            });
        }

        if(action == "solid"){
            connection.setPaintStyle({ 
                strokeStyle:"#000", 
                lineWidth:4, 
                outlineColor:"transparent", 
                outlineWidth:4
            });
        }
		
		if(action == "add_label"){
			connection.setLabel({
				label: "Yes",
				location:0.5,
				id:"label",
				color:"black",
				events:{
						"click":function(label, evt){
							var lb = prompt("Input Label");
							connection.getOverlay("label").setLabel(lb);
							}
						}
			});
		}
    }
        
    me.arrastrable = function(){
        jsPlumb.draggable($(".object"), {
          containment:"editor"
        });
    }


	//right click of the object selected
	 me.menu_shape = function(){
        $.contextMenu({
			selector:'.object',
            trigger: 'right',
            callback: function(key, options) {
                var o = key;
                me.menu_shapes_action(key);
            },
            items: {
				"shapes_desc":{"name": "Edit", "icon":"add"},
				"delete":{"name": "Delete", "icon": "delete"},
				"copy":{"name":"Copy"},
            }
        });
    }
	 me.menu_shapes_action = function(action){
        console.log(object_selected);
        if(action == "delete"){
            jsPlumb.remove(object_selected, {
                fireEvent: false, 
                forceDetach: false 
            })
			$("shape_details").hide();
        }

        if(action == "shapes_desc"){
           $(function showDetails(){
			$("#shape_details").show();
		});
        }
		
		
		if(action == "copy"){
		var before = jsPlumb.getSelector('.object');
		var obj = before.clone();
		$(before).prepend(obj);
		
		
		}
	
	}
	$(document).ready(function(){
		$('#editor').bind({
		copy: function(){
			$('#editor').text('copy behavior detected!');
		},
		paste: function(){
			$('#editor').text('paste behavior detected!');
		},
		cut: function(){
			$('#editor').text('cut behavior detected!');
		}
	});
   });
	
	
	
	
	
});
