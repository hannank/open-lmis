/*
 * This program was produced for the U.S. Agency for International Development. It was prepared by the USAID | DELIVER PROJECT, Task Order 4. It is part of a project which utilizes code originally licensed under the terms of the Mozilla Public License (MPL) v2 and therefore is licensed under MPL v2 or later.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the Mozilla Public License as published by the Mozilla Foundation, either version 2 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the Mozilla Public License for more details.
 *
 * You should have received a copy of the Mozilla Public License along with this program. If not, see http://www.mozilla.org/MPL/
 */
function ViewVaccineReportDetailController($scope, $location, $filter, report, discardingReasons) {

  // initial state of the display
  $scope.report = report;
  $scope.discardingReasons = discardingReasons;
  // populate scope with tab visibility info
  $scope.tabVisibility = {};
  _.chain(report.tabVisibilitySettings).groupBy('tab').map(function(key, value){
                                                                $scope.tabVisibility[value] =  key[0].visible;
                                                              });

  $scope.cancel = function () {
    $location.path('/');
  };


  $scope.showAdverseEffect = function (effect, editMode) {
    effect.date = $filter('date')(new Date(effect.date), 'yyyy-MM-dd');
    effect.expiry = $filter('date')(new Date(effect.expiry), 'yyyy-MM-dd');

    $scope.currentEffect = effect;
    $scope.currentEffectMode = editMode;

    $scope.adverseEffectModal = true;
  };


  $scope.closeAdverseEffectsModal = function () {
    $scope.adverseEffectModal = false;
  };

  $scope.showCampaignForm = function (campaign, editMode) {

    campaign.startDate = $filter('date')(new Date(campaign.startDate), 'yyyy-MM-dd');
    campaign.endDate = $filter('date')(new Date(campaign.endDate), 'yyyy-MM-dd');

    $scope.currentCampaign = campaign;
    $scope.currentCampaignMode = editMode;

    $scope.campaignsModal = true;
  };

  $scope.closeCampaign = function () {
    $scope.campaignsModal = false;
  };

  $scope.toNumber = function (val) {
    if (angular.isDefined(val) && val !== null) {
      return parseInt(val, 10);
    }
    return 0;
  };


  $scope.rowRequiresExplanation = function (product) {
    if (!isUndefined(product.discardingReasonId)) {
      var reason = _.findWhere($scope.discardingReasons, {id: parseInt(product.discardingReasonId, 10)});
      return reason.requiresExplanation;
    }
    return false;
  };

}
ViewVaccineReportDetailController.resolve = {
  report: function ($q, $timeout, $route, VaccineReport) {
    var deferred = $q.defer();

    $timeout(function () {
      VaccineReport.get({id: $route.current.params.id}, function (data) {
        data.report.coverageLineItemViews = _.groupBy(data.report.coverageLineItems, 'productId');
        deferred.resolve(data.report);
      });
    }, 100);
    return deferred.promise;
  },
  discardingReasons: function ($q, $timeout, $route, VaccineDiscardingReasons) {
    var deferred = $q.defer();

    $timeout(function () {
      VaccineDiscardingReasons.get(function (data) {
        deferred.resolve(data.reasons);
      });
    }, 100);
    return deferred.promise;
  }
};