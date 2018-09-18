const names = [
    "Ranzlaube", "Gruppenzwerg", "Taschentuch", "Marcele", "Bollinator", "Nebelmaschine", "Der Ranz",
    "Ranz izz Life", "Pocketbike", "Da machste nix!", "1:30 oder 30:1 ?", "Gruppen-mechaniker", "Hoesqvarna?",
    "Sumo ist Life"
]
let previews = [0,0,0,0,0];
let thisItem = null;
let features = null;
let currentPrice = 0;

let templateSliderImage = Handlebars.compile(`
{{#each imageLink}}
<a class="carousel-item" href="#{{../itemName}}"><img src="{{this}}"></a>
{{/each}}
`);

let templateFeatureText = Handlebars.compile(`
<div class="input-field col s12 l{{width}}">
    <input id="feature_{{featureName}}" type="text" onkeyup="refreshPreview()" value="{{valuePrefill}}">
    <label for="feature_{{featureName}}">{{displayName}}</label>
</div>
`);
let templateFeatureSel = Handlebars.compile(`
<div class="input-field col s12 l{{width}}">
    <select id="feature_{{featureName}}" onchange="refreshPreview()">
        <option value="" disabled>auswählen</option>
        {{#each possibleValues}}
        <option value="{{@key}}">{{this}}</option>
        {{/each}}
    </select>
    <label>{{displayName}}</label>
</div>
`);

let templateFeatureSelArray = Handlebars.compile(`
<div class="input-field col s12 l{{width}}">
    <select id="feature_{{featureName}}" onchange="refreshPreview()">
        <option value="" disabled>auswählen</option>
        {{#each possibleValues}}
        <option value="{{@index}}">{{this}}</option>
        {{/each}}
    </select>
    <label>{{displayName}}</label>
</div>
`);

let templatePreviewFrontName = Handlebars.compile(`
<div class="col s6" style="line-height: normal;">
    <p class="bolden">Vorderseite:</p>
    <img src="img/preview/sport.png" width="100%" id="preview-heart"/>
    <div class="white-text center preview" id="preview-front">
        <span>NAME</span>
    </div>
</div>
`);
let templatePreviewFrontHeart = Handlebars.compile(`
<div class="col s6" style="line-height: normal;">
    <p class="bolden">Vorderseite:</p>
    <img src="img/preview/sport.png" width="100%" id="preview-heart"/>
    <div class="white-text center preview" id="preview-front">
        <span>RHEINHESSENRIDERS</span>
    </div>
</div>
`);
let templatePreviewBack = Handlebars.compile(`
<div class="col s6">
    <p class="bolden">Rückseite:</p>
    <img src="img/preview/RH%20Mainz.png" width="100%" id="preview-back"/>
</div>
`);
let templatePreviewSticker = Handlebars.compile(`
<div class="col s6">
    <p class="bolden">Vorderseite:</p>
    <img src="img/preview/RR-Sticker-Insta2.jpg" width="100%" id="preview-back"/>
</div>
`);
function detail(hash) {
    //Base Data:
    console.log(hash);
    thisItem = itemData[hash];
    $("#detailNameL").html(thisItem.displayName);
    $("#detailNameS").html(thisItem.displayName);
    $("#detailDescription").html(thisItem.description);
    $("#detailPrice").html("ab "+thisItem.basePrice+"€*");
    let slider = $("#detailSlider");
    slider.html(templateSliderImage(thisItem));

    $.getJSON("backend/api/item/getItemDetail.php",{itemName: hash}, (json) => {
        let widths = [6,6,4,4,4,4,4,4,4,4,4];
        let htmlElem = $("#detailFeatures");
        let previewElem = $("#preview-color");
        htmlElem.html("");
        previewElem.html("");
        features = json;

        for(let i=0; i < json.length; i++) {
            if(json[i].featureType === "1") {
                let random = Math.floor(Math.random()*names.length);
                htmlElem.append(templateFeatureText({
                    width: widths[i],
                    featureName: json[i].featureName,
                    displayName: json[i].displayName,
                    valuePrefill: names[random]
                }));
            } else if (json[i].featureType === "2") {
                json[i].width = widths[i];
                json[i].possibleValues = JSON.parse(json[i].possibleValues);
                htmlElem.append(templateFeatureSel(json[i]));
                $("#feature_"+json[i].featureName).selectedIndex = 1;
            }

            if(json[i].featureName === "frontName") { previewElem.append(templatePreviewFrontName()); previews[0]=1;}
            else if (json[i].featureName === "backCity") { previewElem.append(templatePreviewBack()); previews[1]=1;}
            else if (json[i].featureName === "type") { previewElem.append(templatePreviewSticker()); previews[2]=1;}
            else if (json[i].featureName === "color") previews[3]=1;
            else if (json[i].featureName === "frontHerz" && previews[0] === 0) {previewElem.append(templatePreviewFrontHeart()); previews[4]=1;}

        }
        htmlElem.append(templateFeatureSelArray({
            width: widths[json.length],
            possibleValues: [thisItem.baseAmount,thisItem.baseAmount*2,thisItem.baseAmount*3,thisItem.baseAmount*4,thisItem.baseAmount*5],
            featureName: "amount",
            displayName: "Anzahl"
        }));
        $("#feature_amount").selectedIndex = 1;

        M.updateTextFields();
        $('select').formSelect();

        refreshPreview();
    });

    $("#shopHome").hide();
    $("#shopDetail").show();
    $("#backbutton").show();

    document.title = thisItem.displayName+" - RheinhessenRiders Shop";
    _paq.push(['setReferrerUrl', currentUrl]);
    currentUrl = '' + window.location.hash;
    _paq.push(['setCustomUrl', currentUrl]);
    _paq.push(['setDocumentTitle', document.title]);

    // remove all previously assigned custom variables, requires Piwik 3.0.2
    _paq.push(['deleteCustomVariables', 'page']);
    _paq.push(['setGenerationTimeMs', 0]);
    _paq.push(['trackPageView']);

    _paq.push(['setEcommerceView',
        thisItem.itemID, // (required) SKU: Product unique identifier
        thisItem.invoiceName, // (optional) Product name
        "Merchandise" // (optional) Product category, or array of up to 5 categories
    ]);
    _paq.push(['trackPageView']);

    slider1 = $('#detailSlider');
    slider1.carousel({fullWidth: true, indicators: true});
    slider1.css('height', $('#slider1 .carousel-item img').height()+"px");
}

function refreshPreview() {
    if(previews[0] === 1) {
        let name = $("#feature_frontName").val().toUpperCase();
        let heart = $("#feature_frontHerz").val();
        let previewFront = $("#preview-front");
        let previewHeart = $("#preview-heart");

        previewFront.html("<span>"+name+"</span>");
        previewFront.textfill({maxFontPixels:100, minFontPixels:10});
        previewHeart.attr('src', "img/preview/"+heart+".png");

    }
    if(previews[1] === 1) {
        let city = $("#feature_backCity").val();
        let previewBack = $("#preview-back");
        console.log(city);

        if(city === "mz") previewBack.attr('src', "img/preview/RH%20Mainz.png");
        else if(city === "az") previewBack.attr('src', "img/preview/RH%20Alzey.png");
        else if(city === "wo") previewBack.attr('src', "img/preview/RH%20Worms.png");
        else if(city === "ffm") previewBack.attr('src', "img/preview/RH%20Frankfurt.png");
        else if(city === "wi") previewBack.attr('src', "img/preview/RH%20Wiesbaden.png");
    }
    if(previews[2] === 1) {
        //Stickerpreview
    }
    if(previews[3] === 1) {
        let color = $("#feature_color").val();
        let previewColor = $("#preview-color");

        previewColor.removeClass("black");
        previewColor.removeClass("indigo darken-4");
        previewColor.removeClass("black-text");
        previewColor.removeClass("white-text");
        previewColor.removeClass("red");
        previewColor.removeClass("yellow");
        previewColor.removeClass("green");
        previewColor.removeClass("blue");
        previewColor.removeClass("cyan");
        previewColor.removeClass("purple");

        if(color === "schwarz") previewColor.addClass("black");
        if(color === "natoblau") previewColor.addClass("indigo darken-4");
        if(color === "gelb") previewColor.addClass("yellow");
        if(color === "gruen") previewColor.addClass("green");
        if(color === "blau") previewColor.addClass("blue");
        if(color === "cyan") previewColor.addClass("cyan");
        if(color === "magenta") previewColor.addClass("purple");
        if(color === "weiss") {previewColor.addClass("white"); previewColor.addClass("black-text");}
        else previewColor.addClass("white-text");
    }
    if(previews[4] === 1) {
        let heart = $("#feature_frontHerz").val();
        let previewFront = $("#preview-front");
        let previewHeart = $("#preview-heart");

        previewFront.textfill({maxFontPixels:100, minFontPixels:10});
        previewHeart.attr('src', "img/preview/"+heart+".png");
    }
    refreshPrice();
}

function refreshPrice() {
    let price = parseInt(thisItem.basePrice);

    for(let i=0; i < features.length; i++) {
        if(features[i].featureType === "2") {
            let index = $("#feature_"+features[i].featureName).prop('selectedIndex');
            let addPrice = JSON.parse(features[i].addPrice)[index-1];
            console.log(features[i].featureName+": "+index+" = "+addPrice);
            price += parseInt(addPrice);
        }
    }

    price *= parseInt($("#feature_amount").val())+1;

    $("#detailPrice").html(price+" €*");
    currentPrice = price;
}

function addToCart() {
    refreshPrice();

    let toAdd = {
        itemType: parseInt(thisItem.itemID),
        itemName: thisItem.itemName,
        amount: parseInt($("#feature_amount").val())+1,
        price: parseInt(currentPrice),
        itemData: {}
    }

    for(let i=0; i < features.length; i++) {
        toAdd.itemData[features[i].featureName] = $("#feature_"+features[i].featureName).val();
    }

    Lockr.sadd("items", toAdd);
    M.toast({html: "Zum Einkaufswagen hinzugefügt", duration: 1000, classes:"green"});
    updateCartAmount();
}