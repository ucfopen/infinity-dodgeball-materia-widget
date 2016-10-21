describe('materiaCreator module', function(){
	// grab the demo widget for easy reference
	var widgetInfo = window.__demo__['build/demo'];
	var qset = widgetInfo.qset;

	var $scope = {};
	var $compiler = {};
	var ctrl;

	describe('creatorCtrl', function() {
		beforeEach(module('materiaCreator'));

		beforeEach(inject(function($rootScope, $controller){
			//instantiate $scope with all of the generic $scope methods/properties
			$scope = $rootScope.$new();
			//pass $scope through the 'creatorCtrl' controller
			ctrl = $controller('creatorCtrl', { $scope: $scope });
		}));

		// override the method that runs if the widget is saved properly
		Materia.CreatorCore.save = function(title, qset, version) {
			return true;
		};
		// override the method that runs if the widget is saved without a title
		Materia.CreatorCore.cancelSave = function(msg) {
			return msg;
		};

		it('should make a new widget', function(){
			$scope.initNewWidget({name: 'be-finder'});

			expect($scope.widget.engineName).toBe('be-finder');
			expect($scope.widget.title).toBe('be-finder');
		});

		it('should cause an issue when saved without a title', function(){
			expect($scope.onSaveClicked()).toBe('This widget has no title!');
		});

		it('should save properly when it has a title', function(){
			$scope.widget.title = 'be-finder';
			expect($scope.onSaveClicked()).toBe(true);
		});

		it('should edit an existing widget', function(){
			$scope.initExistingWidget('Be Finder', {name: 'be-finder'}, {});
			expect($scope.initExistingWidget).toBeDefined();
		});
	});

	describe('dodgeballPlayerCtrl', function(){
		module.sharedInjector();
		beforeAll(module('dodgeball'));

		beforeAll(inject(function($rootScope, $controller, $compile){
			$compiler = $compile;
			//instantiate $scope with all of the generic $scope methods/properties
			$scope = $rootScope.$new();
			//pass $scope through the 'dodgeballPlayerCtrl' controller
			ctrl = $controller('dodgeballPlayerCtrl', { $scope: $scope });
		}));

		it('should start properly', function(){
			$scope.start(widgetInfo, qset.data);
			expect($scope.title).toBe('Dodgeball');
			expect($scope.instructionsStep).toBe(1);
			expect($scope.choosingMode).toBe(false);
			expect($scope.choosingSize).toBe(false);
		});

		// //since we've just started the widget, the instructions should be up
		// it('should have the correct heading for the modal content window', function(){
		// 	var element = $compiler('<h1 content-header></h1>')($scope);
		// 	$scope.$digest();

		// 	expect(element.html()).toContain('How to play Dodgeball');
		// });

		it('should progress through the instructions', function(){
			//make sure we're still on the first page of instructions
			expect($scope.instructionsStep).toBe(1);

			//this action is normally tied to a button press
			$scope.nextInstruction();
			expect($scope.instructionsStep).toBe(2);

			//make sure we stop incrementing the step counter when we hit the cap - should be 5
			$scope.nextInstruction();
			expect($scope.instructionsStep).toBe(3);
			$scope.nextInstruction();
			expect($scope.instructionsStep).toBe(4);
			//step 5 is the mode select screen, basically indicating the instructions are over
			$scope.nextInstruction();
			expect($scope.instructionsStep).toBe(5);

			//this action shouldn't be possible - make sure the instruction step doesn't go past the cap
			$scope.nextInstruction();
			expect($scope.instructionsStep).toBe(5);
		});
	});
});
