angular.module('starter.controllers', [])

.controller('SettingsCtrl', function($scope, $rootScope, Bluetooth, Chats) {
	$scope.params = {
		visible: Bluetooth.isVisible(),
		searching: Bluetooth.isSearching(),
		name: Bluetooth.getName(),
	}
	$scope.setVisible = () => Bluetooth.setVisible($scope.params.visible)
	$scope.setSearching = () => Bluetooth.setSearching($scope.params.searching)
	$scope.setName = () => Bluetooth.setName($scope.params.name)
	$scope.clearHistory = () => Chats.clearHistory()
	$rootScope.$on("adapterStateChanged", function(){
        $scope.$evalAsync(function () {
			$scope.params.visible = Bluetooth.isVisible()
			$scope.params.searching = Bluetooth.isSearching()
			$scope.params.name = Bluetooth.getName()
		})
	});
	Bluetooth.refreshList()
})

.controller('PeopleCtrl', function($scope, $rootScope, Chats, Bluetooth) {
	$scope.$on("$ionicView.enter", () => Bluetooth.refreshList());
	$scope.chats = Chats.list();
	$scope.refresh = () => Bluetooth.refreshList()
	$scope.startChat = addr => Chats.startChat(addr);
	$rootScope.$on("newDevice", function() {
        $scope.$evalAsync(function () {
			$scope.chats = Chats.list();
		})
	});
})

.controller('ChatCtrl', function($scope, $rootScope, $stateParams, $interval, Chats, Bluetooth) {
	$scope.params = {}
	$scope.send = () => {
		Chats.onInput($scope.params.message)
		$scope.params.message = ""
	}
	$rootScope.$on("newMessage", () => {
		$scope.$evalAsync(() => {
			$scope.other = $scope.other;
		});
	});
	$scope.$on("$ionicView.enter", () => {
		$scope.other = Chats.getChat($stateParams.chatId)
	});
	$scope.$on("$ionicView.leave", () => Bluetooth.disconnect());
});
