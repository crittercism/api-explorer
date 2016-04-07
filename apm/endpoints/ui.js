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

  function query($scope, $cookies, $http){
    $scope.submit = function() {
      var httpReq = {
        method: 'POST',
        url: '/endpoints',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + $scope.accessToken
        },
        data: JSON.stringify({'app_id': this.app_id, 'sort': this.sort,
                              'duration': this.duration})};
      $http(httpReq).
      success(function(data){$scope.endpointData = data}).
      error(function(status) {$scope.error = status});
    };
    $scope.deleteToken = function() {
      $cookies.remove('accessToken');
      window.location.reload();
    }
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
                              'sort': this.sort}})};
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
  }

  var thisApp = angular.module("app", ["ngCookies"]);
  thisApp.controller("cookieController", ["$scope", "$cookies", setCookie]);
  thisApp.controller("tokenController", ["$scope", "$cookies", tokens]);
  thisApp.controller("endpointsController", ["$scope", "$cookies", "$http", directQuery]);
  thisApp.controller("tableController", ["$scope", "$filter", tableOrder]);
})();

