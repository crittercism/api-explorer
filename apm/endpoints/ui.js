(function() {

  function setCookie($scope, $cookies) {
    $scope.submit = function() {
      if ($scope.text) {
        $cookies.put('accessToken', this.text);
        window.location.reload();
      }
    };
  }

  function tokens($scope, $cookies) {
    $scope.checkToken = function() {
      $scope.accessToken = $cookies.get('accessToken');
    };
  }


  function directQuery($scope, $cookies, $http){
    $scope.submit = function() {
      var httpReq = {
        method: 'POST',
        url: 'https://developers.crittercism.com/v1.0/apm/endpoints',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + $scope.accessToken
        },
        data: JSON.stringify({'params': {'appId': this.app_id, 'limit': 100000,
                              'duration': parseInt(this.duration),
                              'sort': this.sort}})
      };
      $http(httpReq).
      success(function(res){
        $scope.endpointData = {'data':[]};
        var endpoints = res.data.endpoints;
        for (var ep in endpoints) {
          $scope.endpointData.data.push(
              {
                'start': res.data.start,
                'end': res.data.end,
                'domain': endpoints[ep].d,
                'uri': endpoints[ep].u,
                'value': endpoints[ep].s
              }
          )
        }
      }).
      error(function(status) {$scope.error = status});
    };
    $scope.deleteToken = function() {
      $cookies.remove('accessToken');
      window.location.reload();
    }
  }

  function tableOrder($scope){
    $scope.orderByFunction = function(endpoint){
      return parseFloat(endpoint.value);
    };


    $scope.exportCSV = function() {
      var list_dict = $scope.endpointData.data;
      var csv_file = "Domain,URI,Value,Start,End\n";
      for (var x in list_dict) {
        var dict = list_dict[x];
        csv_file += [
          String(dict['domain']), 
          String(dict['uri']), 
          String(dict['value']),
          String(dict['start']),
          String(dict['end']),
          ].join();
        csv_file += "\n";
      }

      var element = document.createElement('a'); 
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(csv_file)); 
      element.setAttribute('download', "endpoint.csv"); 
      element.style.display = 'none'; 
      document.body.appendChild(element); element.click(); 
      document.body.removeChild(element);
      };
    };


  var thisApp = angular.module("app", ["ngCookies"]);
  thisApp.controller("cookieController", ["$scope", "$cookies", setCookie]);
  thisApp.controller("tokenController", ["$scope", "$cookies", tokens]);
  thisApp.controller("endpointsController", ["$scope", "$cookies", "$http", directQuery]);
  thisApp.controller("tableController", ["$scope", "$filter", tableOrder]);
})();

