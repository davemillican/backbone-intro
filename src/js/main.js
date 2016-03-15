
    var images = ['images/bldg.jpg', 'images/skyscraper-day-fun.jpg',
                    'images/beach.jpg', 'images/jaguar1.jpg',
                    'images/chile.jpg', 'images/Argentina_gaucho.jpg'];

  //  images.forEach (function (image) {
   //     $('body').append($('<div>').html($('<img>',{src:image})));
   // });

    var collection = new Backbone.Collection();

    function addNewItem (image) {
        var model = new Backbone.Model({
            url:image,
            likes:0
        });
        collection.add(model);        
    }

    images.forEach (addNewItem);


/********   Ready for *******************/
    function createDisplayView ( model ) {
        var block = $('<div>')
        var image = $('<img>',{src:model.get('url')});

        var btnWrapper = $('<div>',{class:"wrapper"});
        var likesBtn = $('<button>',{class:"likes"});
        var deleteBtn = $('<button>',{class:"delete"});
        var labelFor = $('<label>');
        labelFor.html("Likes");
        deleteBtn.html("Delete");
        btnWrapper.append(labelFor, likesBtn, deleteBtn);

        likesBtn.html(model.get('likes'));

        block.append(image, btnWrapper);

        //  The "likes" button
        $(likesBtn).on ('click', function () {
            model.set('likes', (model.get('likes') + 1) );
        });

        // The delete button 
        $(deleteBtn).on ('click', function () {
            model.destroy();
            console.log ("triggered destroy");
        });

        //  Bacbone Watch for the "Likes" changes
        function update () {
            likesBtn.html(model.get('likes'));
        }
        model.on('change:likes', update);

        return {
            el: block,
            destroy: function () {
                block.remove();
                model.off('change:likes', update);
            }
        };
    } 

        var children = [];

    function createApplicationView ( collection ) {
        var container = $('<div>');


        function render () {

            //Each time we create a new View, we have to
            //first delete the old view (cleanup).
            children.forEach( function (child) {
                child.destroy();
            });

            // REMOVE!!!  container.empty();
            children = collection.map(createDisplayView);

            children.forEach (function (model) {
                container.append(model.el);
            });
        } 

        collection.on('remove', function () {
            render();
        });

        $('.add-button').on('click', function () {
            addNewItem($('input').val());
            console.log($('input').val());
            render();
        });

        render();

        return container;
    }

    $(document.body).append(createApplicationView( collection ));
 
