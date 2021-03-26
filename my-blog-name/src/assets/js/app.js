const app = new Object();

window.addEventListener('load', (event) => {

    //Fuse library options
    app["fuseOptions"] = {
        isCaseSensitive: false,
        includeScore: false,
        shouldSort: true,
        includeMatches: false,
        findAllMatches: false,
        minMatchCharLength: 1,
        location: 0,
        threshold: 0.6,
        distance: 100,
        useExtendedSearch: false,
        ignoreLocation: false,
        ignoreFieldNorm: false,
        keys: [
            "title",
            "description"
        ]
    };
    //Create a instance of Fuse
    app["fuse"] = new Fuse(app.contentForSearch, app.fuseOptions);

});

const mySearch = () => {

    // Change the pattern
    let pattern = document.getElementById("mySearch").value;
    let result = app.fuse.search(pattern);
    document.getElementById("totalItemsLabel").innerText = result.length;

    if (result.length == 0) {
        if (pattern.length == 0) {
            document.getElementById("result-container").style.display = "none";
        }
        document.getElementById("results").innerText = '';
    } else {

        document.getElementById("result-container").style.display = "inline";
        document.getElementById("results").innerText = '';

        result.map(x => {
            document.getElementById("results").innerHTML += `

                    <div class="clearfix post-recent">
                        <div class="post-recent-thumb float-start"> 
                            <a href="${x.item.url}"> 
                                <img alt="img" src="${x.item.headerImage}" class="img-fluid rounded">        
                            </a>
                        </div>

                        <div class="post-recent-content float-start">
                            <a href="${x.item.url}">
                                ${x.item.title}
                            </a>
                            <div class="text-muted" style="max-width: 250px;
                                                                 white-space: nowrap;
                                                                 overflow: hidden;
                                                                 text-overflow: ellipsis;">
                                ${x.item.description}
                                <br />
                            </div>
                        </div>
                    </div>
                `;
        });
    }
}

//index-personal.html
if(document.getElementsByClassName('typed-personal').length > 0) {
    var typed = new Typed('.typed-personal', {
        stringsElement: '#typed-strings',
        typeSpeed: 150,
        strings: [
            document.getElementById("typedMessage1").innerText,
            document.getElementById("typedMessage2").innerText,
            document.getElementById("typedMessage3").innerText,
            document.getElementById("typedMessage4").innerText,
            document.getElementById("typedMessage5").innerText,
        ],
    });
}

