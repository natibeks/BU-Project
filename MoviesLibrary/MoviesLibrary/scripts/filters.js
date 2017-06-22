app.filter('capitalizeeachword', function () {
    return function (input) {
        if (input != null)
            return input
                .toLowerCase()
                .split(' ')
                .map(function (word) {
                    return word[0].toUpperCase() + word.substr(1);
                })
                .join(' ');

    }

});

app.filter('onlyengletters', function () {
    return function (input) {
        if (input != null)       
            return input.replace(/[^a-z0-9\s]+/ig, '');
    }
});

app.filter('pagination', function () {
    return function (input, start) {
        start =+ start;
        return input.slice(start);
    };
});

app.filter('propsFilter', function () {
    return function (items, props) {
        var out = [];

        if (angular.isArray(items)) {
            var keys = Object.keys(props);

            items.forEach(function (item) {
                var itemMatches = false;

                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    };
});