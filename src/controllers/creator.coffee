MateriaCreator = angular.module 'materiaCreator'

MateriaCreator.controller 'creatorCtrl', ['$scope', ($scope) ->
	$scope.widget =
		engineName : ''
		title      : ''

	$scope.state =
		isEditingExistingWidget: false

	$scope.initNewWidget = (widget) ->
		$scope.$apply ->
			$scope.widget.engineName = $scope.widget.title = widget.name

	$scope.initExistingWidget = (title, widget) ->
		$scope.state.isEditingExistingWidget = true
		$scope.$apply ->
			$scope.widget.engineName = widget.name
			$scope.widget.title      = title

	$scope.onSaveClicked = ->
		if $scope.widget.title
			Materia.CreatorCore.save $scope.widget.title, _buildSaveData()
		else Materia.CreatorCore.cancelSave 'This widget has no title!'

	# Private methods
	_buildSaveData = ->
		name    : ''
		items   : []

	Materia.CreatorCore.start $scope
]