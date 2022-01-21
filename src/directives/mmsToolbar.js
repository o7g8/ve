'use strict';

angular.module('mms.directives').directive('mmsToolbar', ['$templateCache', 'SessionService', 'EventService',
	'ToolbarService', mmsToolbar]);

function mmsToolbar($templateCache, SessionService, EventService, ToolbarService)
{
	const session = SessionService;
	const eventSvc = EventService;
	var template = $templateCache.get('mms/templates/mmsToolbar.html');

	var mmsToolbarCtrl = function($scope)
		{
			$scope.init = false;
			$scope.$watch(() => {
				return $scope.mmsTbApi;
			},() => {
				if (!$scope.mmsTbApi){
					return null;
				}
				if ($scope.init === false && ToolbarService.isApi($scope.mmsTbApi)) {
					if ($scope.mmsTbApi.init) {
						$scope.mmsTbApi.init();
					}
					$scope.init = true;
				}
			});
		};

	var mmsToolbarLink = function(scope, element, attrs)
		{

			scope.clicked = function(button)
			{

				if (!button.permission) {
					return;
				}
				if (!button.active) {
					return;
				}

				var toggleDecativeFlag = false;
				if (typeof session.mmsPaneClosed() === 'boolean' && session.mmsPaneToggleable() !== false)
				{
					if (button.selected || session.mmsPaneClosed())
					{
						if (button.selected && !session.mmsPaneClosed()) toggleDecativeFlag = true;
						eventSvc.$broadcast('mms-pane-toggle', {closed: !session.mmsPaneClosed()});
					}
				}

				if (scope.mmsTbApi) scope.mmsTbApi.select(button.id);

				if (button.onClick) {
					button.onClick();
				} else if (scope.onClick) {
					scope.onClick({ button: button });
				}

				if (toggleDecativeFlag && scope.mmsTbApi) {
					scope.mmsTbApi.deactivate(button.id);
				}

/*if (! button.dynamic)
            {
                scope.buttons.forEach(function(b) {
                    if (b === button) {
                        b.selected = true;
                    } else
                        b.selected = false;
                });

                // de-activate all dynamic buttons
                scope.buttons.forEach(function(b) {
                    if (b.dynamic) {
                        b.active = false;
                    }
                });

                if (button.dynamic_buttons) {
                    button.dynamic_buttons.forEach(function(b) {
                        b.active = true;
                    });
                }
            }*/

			};
		};



	return {
		restrict: 'E',
		template: template,
		controller: ['$scope', mmsToolbarCtrl],
		link: mmsToolbarLink,
		scope: {
			buttons: '<',
			mmsTbApi: '<',
			onClick: '&',
			direction: '@'
		}
	};
}