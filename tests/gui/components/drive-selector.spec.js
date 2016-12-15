'use strict';

const _ = require('lodash');
const m = require('mochainon');
const angular = require('angular');
require('angular-mocks');

describe('Browser: DriveSelector', function() {

  beforeEach(angular.mock.module(
    require('angular-ui-bootstrap'),
    require('../../../lib/gui/components/modal/modal'),
    require('../../../lib/gui/components/drive-selector/drive-selector')
  ));

  beforeEach(angular.mock.module({
    SelectionStateModel: {
      getDrive: () => {
        return {
          device: '/dev/disk2',
          name: 'My Drive',
          size: 123456789,
          protected: false,
          system: true
        };
      },
      hasDrive: () => {
        return true;
      }

    }
  }));

  let $controller;

  beforeEach(angular.mock.inject(function(_$controller_) {
    $controller = _$controller_;
  }));

  describe('DriveSelectorController', function() {

    let SelectionStateModel;

    beforeEach(angular.mock.inject(function(_SelectionStateModel_) {
      SelectionStateModel = _SelectionStateModel_;
    }));

    let DriveSelectorController;

    describe('.getButtonStatus()', function() {

      describe('given there is no selected drive', function() {

        it('should return "disabled"', function() {
          const $scope = {};
          DriveSelectorController = $controller('DriveSelectorController', {
            scope: $scope
          });
          $scope.load();

          const result = DriveSelectorController.getButtonStatus() === 'disabled';
          m.chai.expect(result).to.be.true;
        });

      });

      describe('given there is a protected drive', function() {
        it('should return "disabled"', function() {
          const result = undefined;
          m.chai.expect(result).to.be.true;
        });
      });

      describe('given there is a system drive', function() {

        beforeEach(function() {
          SelectionStateModel.getDrive = _.constant({
            device: '/dev/disk2',
            name: 'My Drive',
            size: 123456789,
            protected: false,
            system: true
          });
        });

        it('should return "danger"', function() {
          const result = DriveSelectorController.getButtonStatus() === 'danger';
          m.chai.expect(result).to.be.true;
        });

      });

      describe('given there is a removable drive', function() {

        beforeEach(function() {
          SelectionStateModel.getDrive = _.constant({
            device: '/dev/disk2',
            name: 'My Drive',
            size: 123456789,
            protected: false,
            system: false
          });
        });

        it('should return "primary"', function() {
          const result = DriveSelectorController.getButtonStatus() === 'primary';
          m.chai.expect(result).to.be.true;
        });

      });

    });

    describe('.getFooterMessage()', function() {

      describe('given there is a system drive', function() {

        it('should not be undefined', function() {
          const result = DriveSelectorController.getFooterMessage() !== undefined;

          m.chai.expect(result).to.be.true;
        });

      });

      describe('given the latest version is greater than the current version', function() {

        let $q;
        let $rootScope;
        let DriveSelectorService;

        beforeEach(angular.mock.inject(function(_$q_, _$rootScope_, _DriveSelectorService_) {
          $q = _$q_;
          $rootScope = _$rootScope_;
          DriveSelectorService = _DriveSelectorService_;
        }));

        beforeEach(function() {
          this.getLatestVersionStub = m.sinon.stub(DriveSelectorService, 'getLatestVersion');
          this.getLatestVersionStub.returns($q.resolve('99999.9.9'));
        });

        afterEach(function() {
          this.getLatestVersionStub.restore();
        });

        it('should resolve false', function() {
          let result = null;

          DriveSelectorService.isLatestVersion().then(function(isLatestVersion) {
            result = isLatestVersion;
          });

          $rootScope.$apply();
          m.chai.expect(result).to.be.false;
        });

      });

      describe('given the latest version is less than the current version', function() {

        let $q;
        let $rootScope;
        let DriveSelectorService;

        beforeEach(angular.mock.inject(function(_$q_, _$rootScope_, _DriveSelectorService_) {
          $q = _$q_;
          $rootScope = _$rootScope_;
          DriveSelectorService = _DriveSelectorService_;
        }));

        beforeEach(function() {
          this.getLatestVersionStub = m.sinon.stub(DriveSelectorService, 'getLatestVersion');
          this.getLatestVersionStub.returns($q.resolve('0.0.0'));
        });

        afterEach(function() {
          this.getLatestVersionStub.restore();
        });

        it('should resolve true', function() {
          let result = null;

          DriveSelectorService.isLatestVersion().then(function(isLatestVersion) {
            result = isLatestVersion;
          });

          $rootScope.$apply();
          m.chai.expect(result).to.be.true;
        });

      });

    });

  });

});
