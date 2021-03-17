const app = new Object();

window.addEventListener('load', (event) => {

    //Fuse library options
    app["fuseOptions"] = {
        // isCaseSensitive: false,
        // includeScore: false,
        // shouldSort: true,
        // includeMatches: false,
        // findAllMatches: false,
        // minMatchCharLength: 1,
        // location: 0,
        // threshold: 0.6,
        // distance: 100,
        // useExtendedSearch: false,
        // ignoreLocation: false,
        // ignoreFieldNorm: false,
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

// use plugins and options as needed, for options, detail see
// http://i18next.com/docs/
// i18next.init({
//     lng: 'en', // evtl. use language-detector https://github.com/i18next/i18next-browser-languageDetector
//     resources: { // evtl. load via xhr https://github.com/i18next/i18next-xhr-backend
//         en: {
//             translation: {
//                 input: {
//                     placeholder: "A translated placeholder"
//                 },
//                 nav: {
//                     home: 'Home',
//                     page1: 'Page One',
//                     page2: 'Page Two'
//                 },
//                 key: {
//                     title: "Title translated"
//                 }
//             }
//         },
//         es: {
//             translation: {
//                 input: {
//                     placeholder: "Un marcador de posición traducido"
//                 },
//                 nav: {
//                     home: 'Inicio',
//                     page1: 'Página uno',
//                     page2: 'Página dos'
//                 },
//                 key: {
//                     title: "Título traducido"
//                 }
//             }
//         }
//     }
// }, function (err, t) {

//     localize = locI18next.init(i18next);

//     localize('.nav');
//     localize('.content');
//     localize('#btn1');
// });


// changeL = (lang) => {
//     // using Promises
//     i18next
//         .changeLanguage(lang)
//         .then((t) => {
//             localize('.nav');
//             localize('.content');
//             localize('#btn1');
//         });
// }