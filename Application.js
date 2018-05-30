(function() {
    var app = {
        'routes': {
            'game': {
                'rendered': function() {
                    
                }
            },
            'scores': {
                'rendered': function() {
                    const table = document.getElementsByTagName('tbody')[0]
                    let rowCount = table.rows.length
                    for (let i = rowCount; i > 0; i--) {
                      table.deleteRow(i - 1)
                    }
                    let scores = JSON.parse(localStorage.getItem('allPlayers'))
                    let topScore = scores.sort((a, b) => a.score > b.score ? -1 : 1)
          
                    for (let i = 0; i < (scores.length > 10 ? 10 : scores.length); i++) {
                      table.innerHTML += '<tr><td>' + topScore[i].Mangija + '</td><td>' +
                        topScore[i].Skoor + '</td></tr>'
                    }
                }
            }
        },
        'default': 'about',
        'routeChange': function() {
            app.routeID = location.hash.slice(1);
            app.route = app.routes[app.routeID];
            app.routeElem = document.getElementById(app.routeID);
            app.route.rendered();
        },
        // The function to start the app
        'init': function() {
            window.addEventListener('hashchange', function() {
                app.routeChange();
            });
            // If there is no hash in the URL, change the URL to
            // include the default view's hash.
            if (!window.location.hash) {
                window.location.hash = app.default;
            } else {
                // Execute routeChange() for the first time
                app.routeChange();
            }
        }
    };
    window.app = app;
  })();
  
  app.init();