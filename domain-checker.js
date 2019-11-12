var statuses = {
    testing: '? Test en cours',
    working: '&#10004; Semble fonctionner depuis votre navigateur',
    notworking: '&#10060; Ne semble pas fonctionner depuis votre navigateur',
    unknown: '? État inconnu'
    };


var timestamp = new Date().getTime();

var domainUrlsChecked = [];

function setStatus(idx, stat) {
    $('#domain-' + idx)
        .removeClass('status-testing')
        .addClass('status-' + stat)
        .find('.status').html(statuses[stat]);
}

function updateRecommendation() {
    for(var i = 0; i < window.domains.length; i++) {
        if(domainUrlsChecked[i] == domains[i].test.length) {
            $('#recommended').html('<a href="' + domains[i].url + '" target="_new">' + domains[i].name + '</a>');
            return;
        }
    }
}

function checkOneUrl(url, idx) {
    url = url + '?v=' + timestamp;
    $.ajax({url: url, timeout: 10000, dataType: 'text'})
        .success(function() {
            domainUrlsChecked[idx] += 1;
            if(domainUrlsChecked[idx] == domains[idx].test.length) {
                setStatus(idx, 'working');
                updateRecommendation();
            }
        })
        .fail(function() {
            console.log(arguments);
            setStatus(idx, 'notworking');
            updateRecommendation();
        });
}

function checkUrls() {
    for(var i = 0; i < window.domains.length; i++) {
        var domain = window.domains[i];
        domainUrlsChecked.push(0);
        if(!domain.test) {
            setStatus(i, 'unknown');
            continue;
        }
        setStatus(i, 'testing');
        for(var j = 0; j < domain.test.length; j++) {
            checkOneUrl(domain.test[j], i);
        }
    }
}

function makeTable() {
    var html = '<table>'
             + '<thead><tr>'
             + '<td>Miroir</td><td>Statut</td><td>Description</td>'
             + '</tr></thead>';
    for(var i = 0; i < window.domains.length; i++) {
        var domain = window.domains[i];
        html += '<tr id="domain-' + i + '">'
             +  '<td><a href="' + domain.url + '" target="_new">' + domain.name + '</a></td>'
             +  '<td class="status"></td>'
             +  '<td>' + domain.description + '</td>'
             +  '</tr>'
    }
    html += '</table>';
    $('#main-table').html(html);
    checkUrls();
}

function init() {
    $('#loading').hide();
    makeTable();
}

$(init);
