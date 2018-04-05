/*! elementor-pro - v1.5.4 - 22-06-2017 */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var EditorModule = function() {
	var self = this;

	this.init = function() {
		Backbone.$( window ).on( 'elementor:init', _.bind( this.onElementorReady, this ) );
	};

	this.onElementorReady = function() {
		self.onElementorInit();

		elementor.on( 'frontend:init', function() {
			self.onElementorFrontendInit();
		} );

		elementor.on( 'preview:loaded', function() {
			self.onElementorPreviewLoaded();
		} );
	};

	this.init();
};

EditorModule.prototype.onElementorInit = function() {};

EditorModule.prototype.onElementorPreviewLoaded = function() {};

EditorModule.prototype.onElementorFrontendInit = function() {};

EditorModule.extend = Backbone.View.extend;

module.exports = EditorModule;

},{}],2:[function(require,module,exports){
var ElementorPro = Marionette.Application.extend( {
	config: {},

	modules: {},

	initModules: function() {
		var PanelPostsControl = require( 'modules/panel-posts-control/assets/js/editor' ),
			Forms = require( 'modules/forms/assets/js/editor' ),
			Library = require( 'modules/library/assets/js/editor' ),
			CustomCSS = require( 'modules/custom-css/assets/js/editor' ),
			Slides = require( 'modules/slides/assets/js/editor' ),
			GlobalWidget = require( 'modules/global-widget/assets/js/editor/editor' ),
			FlipBox = require( 'modules/flip-box/assets/js/editor/editor' ),
			ShareButtons = require( 'modules/share-buttons/assets/js/editor/editor' );

		this.modules = {
			panelPostsControl: new PanelPostsControl(),
			forms: new Forms(),
			library: new Library(),
			customCSS: new CustomCSS(),
			slides: new Slides(),
			globalWidget: new GlobalWidget(),
			flipBox: new FlipBox(),
			shareButtons: new ShareButtons()
		};
	},

	ajax: {
		send: function() {
			var args = arguments;

			args[0] = 'pro_' + args[0];

			return elementor.ajax.send.apply( elementor.ajax, args );
		}
	},

	translate: function( stringKey, templateArgs ) {
		return elementor.translate( stringKey, templateArgs, this.config.i18n );
	},

	onStart: function() {
		this.config = ElementorProConfig;

		this.initModules();

		Backbone.$( window ).on( 'elementor:init', this.onElementorInit );
	},

	onElementorInit: function() {
		elementorPro.libraryRemoveGetProButtons();

		elementor.debug.addURLToWatch( 'elementor-pro/assets' );
	},

	libraryRemoveGetProButtons: function() {
		elementor.hooks.addFilter( 'elementor/editor/template-library/template/action-button', function( viewID, templateData ) {
			var insertTemplate = '#tmpl-elementor-template-library-insert-button';

			if ( ! templateData ) {
				return insertTemplate;
			}

			return templateData.isPro && ! elementorPro.config.isActive ? '#tmpl-elementor-pro-template-library-activate-license-button' : insertTemplate;
		} );
	}
} );

window.elementorPro = new ElementorPro();

elementorPro.start();

},{"modules/custom-css/assets/js/editor":3,"modules/flip-box/assets/js/editor/editor":5,"modules/forms/assets/js/editor":6,"modules/global-widget/assets/js/editor/editor":9,"modules/library/assets/js/editor":15,"modules/panel-posts-control/assets/js/editor":17,"modules/share-buttons/assets/js/editor/editor":19,"modules/slides/assets/js/editor":20}],3:[function(require,module,exports){
var EditorModule = require( 'elementor-pro/editor/editor-module' );

module.exports = EditorModule.extend( {
	onElementorInit: function() {
		var CustomCss = require( './editor/custom-css' );
		this.customCss = new CustomCss();
	}
} );

},{"./editor/custom-css":4,"elementor-pro/editor/editor-module":1}],4:[function(require,module,exports){
module.exports = function() {
	var self = this;

	self.init = function() {
		elementor.hooks.addFilter( 'editor/style/styleText', self.addCustomCss );

		elementor.pageSettings.addChangeCallback( 'custom_css', self.addPageCustomCss );

		self.addPageCustomCss.call(  elementor.pageSettings,  elementor.pageSettings.model.get( 'custom_css' ) );
	};

	self.addPageCustomCss = function( newValue ) {
		newValue = newValue.replace( /selector/g, '.elementor-page-' + elementor.config.post_id );

		this.controlsCSS.stylesheet.addRawCSS( 'page-settings-custom-css', newValue );
	};

	self.addCustomCss = function( css, view ) {
		var model = view.getEditModel(),
			customCSS = model.get( 'settings' ).get( 'custom_css' );

		if ( customCSS ) {
			css += customCSS.replace( /selector/g, '.elementor-element-' + view.model.id );
		}

		return css;
	};

	self.init();
};

},{}],5:[function(require,module,exports){
var EditorModule = require( 'elementor-pro/editor/editor-module' );

module.exports = EditorModule.extend( {
	onElementorInit: function() {
		elementor.channels.editor.on( 'section:activated', this.onSectionActivated );
	},

	onSectionActivated: function( sectionName, editor ) {
		var editedElement = editor.getOption( 'editedElementView' );

		if ( 'flip-box' !== editedElement.model.get( 'widgetType' ) ) {
			return;
		}

		var isSideBSection = -1 !== [ 'section_side_b_content', 'section_style_b' ].indexOf( sectionName );

		editedElement.$el.toggleClass( 'elementor-flip-box--flipped', isSideBSection );

		var $backLayer = editedElement.$el.find( '.elementor-flip-box__back' );

		if ( isSideBSection ) {
            $backLayer.css( 'transition', 'none' );
		}

		if ( ! isSideBSection ) {
			setTimeout( function() {
				$backLayer.css( 'transition', '' );
			}, 10 );
		}
	}
} );

},{"elementor-pro/editor/editor-module":1}],6:[function(require,module,exports){
var EditorModule = require( 'elementor-pro/editor/editor-module' );

module.exports = EditorModule.extend( {
	onElementorPreviewLoaded: function() {
		var ReplyToField = require( './editor/reply-to-field' );
		this.replyToField = new ReplyToField();

		elementor.addControlView( 'Fields_map', require( './editor/fields-map-control' ) );
	}
} );

},{"./editor/fields-map-control":7,"./editor/reply-to-field":8,"elementor-pro/editor/editor-module":1}],7:[function(require,module,exports){
module.exports = elementor.modules.controls.Repeater.extend( {
	onBeforeRender: function() {
		 this.$el.hide();
	},

	updateMap: function( fields ) {
		var self = this,
			savedMapObject = {};

		self.collection.each( function( model ) {
			savedMapObject[ model.get( 'remote_id' ) ] = model.get( 'local_id' );
		} );

		self.collection.reset();

		_.each( fields, function( field ) {
			var model = {
				remote_id: field.remote_id,
				remote_label: field.remote_label,
				remote_type: field.remote_type ? field.remote_type : '',
				remote_required: field.remote_required ? field.remote_required : false,
				local_id: savedMapObject[field.remote_id] ? savedMapObject[field.remote_id] : ''
			};

			self.collection.add( model );
		} );

		self.render();
	},

	onRender: function() {
		elementor.modules.controls.Base.prototype.onRender.apply( this, arguments );

		var self = this;

		self.children.each( function( view ) {
			var localFieldsControl = view.children.last(),
				options = {
					'': '- ' + elementor.translate( 'None' ) + ' -'
				},
				label = view.model.get( 'remote_label' );

			if ( view.model.get( 'remote_required' ) ) {
				label += '<span class="elementor-required">*</span>';
			}

			_.each( self.elementSettingsModel.get( 'form_fields' ).models, function( model, index ) {

				// If it's an email field, add only email fields from thr form
				var remoteType = view.model.get( 'remote_type' );

				if ( 'text' !== remoteType && remoteType !== model.get( 'field_type' ) ) {
					return;
				}

				options[ model.get( '_id' ) ] = model.get( 'field_label' ) || 'Field #' + ( index + 1 );
			} );

			localFieldsControl.model.set( 'label',  label );
			localFieldsControl.model.set( 'options', options );
			localFieldsControl.render();

			view.$el.find( '.elementor-repeater-row-tools' ).hide();
			view.$el.find( '.elementor-repeater-row-controls' )
				.removeClass( 'elementor-repeater-row-controls' )
				.find( '.elementor-control' )
				.css( {
					paddingBottom: 0
				} );
		} );

		self.$el.find( '.elementor-button-wrapper' ).remove();

		if ( self.children.length ) {
			self.$el.show();
		}
	}
} );

},{}],8:[function(require,module,exports){
module.exports = function() {
	var editor,
		editedModel,
		replyToControl;

	var setReplyToControl = function() {
		replyToControl = editor.collection.findWhere( { name: 'email_reply_to' } );
	};

	var getReplyToView = function() {
		return editor.children.findByModelCid( replyToControl.cid );
	};

	var refreshReplyToElement = function() {
		var replyToView = getReplyToView();

		if ( replyToView ) {
			replyToView.render();
		}
	};

	var updateReplyToOptions = function() {
		var settingsModel = editedModel.get( 'settings' ),
			emailModels = settingsModel.get( 'form_fields' ).where( { field_type: 'email' } ),
			emailFields;

		emailModels = _.reject( emailModels, { field_label: '' } );

		emailFields = _.map( emailModels, function( model ) {
			return {
				id: model.get( '_id' ),
				label: elementorPro.translate( 'x_field', [ model.get( 'field_label' ) ] )
			};
		} );

		replyToControl.set( 'options', { '': replyToControl.get( 'options' )[''] } );

		_.each( emailFields, function( emailField ) {
			replyToControl.get( 'options' )[ emailField.id ] = emailField.label;
		} );

		refreshReplyToElement();
	};

	var updateDefaultReplyTo = function( settingsModel ) {
		replyToControl.get( 'options' )[ '' ] = settingsModel.get( 'email_from' );

		refreshReplyToElement();
	};

	var onFormFieldsChange = function( changedModel ) {
		// If it's repeater field
		if ( changedModel.get( '_id' ) ) {
			if ( 'email' === changedModel.get( 'field_type' ) ) {
				updateReplyToOptions();
			}
		}

		if ( changedModel.changed.email_from ) {
			updateDefaultReplyTo( changedModel );
		}
	};

	var onPanelShow = function( panel, model ) {
		editor = panel.getCurrentPageView();

		editedModel = model;

		setReplyToControl();

		var settingsModel = editedModel.get( 'settings' );

		settingsModel.on( 'change', onFormFieldsChange );

		updateDefaultReplyTo( settingsModel );

		updateReplyToOptions();
	};

	var init = function() {
		elementor.hooks.addAction( 'panel/open_editor/widget/form', onPanelShow );
	};

	init();
};

},{}],9:[function(require,module,exports){
var EditorModule = require( 'elementor-pro/editor/editor-module' );

module.exports =  EditorModule.extend( {
	globalModels: {},

	panelWidgets: null,

	addGlobalWidget: function( id, args ) {
		args = _.extend( {}, args, {
			categories: [],
			icon: elementor.config.widgets[ args.widgetType ].icon,
			widgetType: args.widgetType,
			custom: {
				templateID: id
			}
		} );

		var globalModel = this.createGlobalModel( id, args );

		return this.panelWidgets.add( globalModel );
	},

	createGlobalModel: function( id, modelArgs ) {
		var globalModel = new elementor.modules.element.Model( modelArgs );

		globalModel.set( 'id', id );

		return this.globalModels[ id ] = globalModel;
	},

	setWidgetType: function() {
		elementor.hooks.addFilter( 'element/view', function( DefaultView, model ) {
			if ( model.get( 'templateID' ) ) {
				return require( './widget-view' );
			}

			return DefaultView;
		} );

		elementor.hooks.addFilter( 'element/model', function( DefaultModel, attrs ) {
			if ( attrs.templateID ) {
				return require( './widget-model' );
			}

			return DefaultModel;
		} );
	},

	registerTemplateType: function() {
		elementor.templates.registerTemplateType( 'widget', {
			showInLibrary: false,
			saveDialog: {
				title: elementorPro.translate( 'global_widget_save_title' ),
				description: elementorPro.translate( 'global_widget_save_description' )
			},
			prepareSavedData: function( data ) {
				// Todo: Temp patch since 1.3.0
				if ( data.content ) {
					data.widgetType = data.content[0].widgetType;
				} else {
					data.widgetType = data.data[0].widgetType;
				}
				// END patch

				return data;
			},
			ajaxParams: {
				success: _.bind( this.onWidgetTemplateSaved, this )
			}
		} );
	},

	addSavedWidgetsToPanel: function() {
		var self = this;

		self.panelWidgets = new Backbone.Collection();

		_.each( elementorPro.config.widget_templates, function( templateArgs, id ) {
			self.addGlobalWidget( id, templateArgs );
		} );

		elementor.hooks.addFilter( 'panel/elements/regionViews', function( regionViews ) {
			_.extend( regionViews.global, {
				view: require( './global-templates-view' ),
				options: {
					collection: self.panelWidgets
				}
			} );

			return regionViews;
		} );
	},

	addPanelPage: function() {
		elementor.getPanelView().addPage( 'globalWidget', {
			view: require( './panel-page' )
		} );
	},

	getGlobalModels: function( id ) {
		if ( ! id ) {
			return this.globalModels;
		}

		return this.globalModels[ id ];
	},

	saveTemplates: function() {
		if ( ! Object.keys( this.globalModels ).length ) {
			return;
		}

		var templatesData = [];

		_.each( this.globalModels, function( templateModel, id ) {
			if ( 'loaded' !== templateModel.get( 'settingsLoadedStatus' ) ) {
				return;
			}

			var data = {
				data: JSON.stringify( [ templateModel ] ),
				source: 'local',
				type: 'widget',
				id: id
			};

			templatesData.push( data );
		} );

		if ( ! templatesData.length ) {
			return;
		}

		elementor.ajax.send( 'update_templates', {
			data: {
				templates: templatesData
			}
		} );
	},

	setSaveButton: function() {
		elementor.getPanelView().footer.currentView.ui.buttonSave.on( 'click', _.bind( this.saveTemplates, this ) );
	},

	requestGlobalModelSettings: function( globalModel, callback ) {
		elementor.templates.requestTemplateContent( 'local', globalModel.get( 'id' ), {
			success: function( data ) {
				globalModel.set( 'settingsLoadedStatus', 'loaded' ).trigger( 'settings:loaded' );

				if ( data.content ) {
					data = data.content;
				}

				var settings = data[0].settings,
					settingsModel = globalModel.get( 'settings' );

				settingsModel.handleRepeaterData( settings );

				settingsModel.set( settings );

				if ( callback ) {
					callback( globalModel );
				}
			}
		} );
	},

	onElementorInit: function() {
		this.setWidgetType();
		this.registerTemplateType();

		// If it's before moving handlers scripts to frontend in edit mode
		if ( ! elementor.compareVersions ) {
			this.addSavedWidgetsToPanel();
		}
	},

	onElementorFrontendInit: function() {
		this.addSavedWidgetsToPanel();
	},

	onElementorPreviewLoaded: function() {
		this.addPanelPage();
		this.setSaveButton();
	},

	onWidgetTemplateSaved: function( data ) {
		var widgetModel = elementor.templates.getLayout().modalContent.currentView.model,
			widgetModelIndex = widgetModel.collection.indexOf( widgetModel );

		elementor.templates.closeModal();

		data.elType = data.type;
		data.settings = widgetModel.get( 'settings' ).attributes;

		var globalModel = this.addGlobalWidget( data.template_id, data ),
			globalModelAttributes = globalModel.attributes;

		widgetModel.collection.add( {
			id: elementor.helpers.getUniqueID(),
			elType: globalModelAttributes.type,
			templateID: globalModelAttributes.template_id,
			widgetType: 'global'
		}, { at: widgetModelIndex }, true );

		widgetModel.destroy();

		var panel = elementor.getPanelView();

		panel.setPage( 'elements' );

		panel.getCurrentPageView().activateTab( 'global' );
	}
} );

},{"./global-templates-view":10,"./panel-page":12,"./widget-model":13,"./widget-view":14,"elementor-pro/editor/editor-module":1}],10:[function(require,module,exports){
module.exports = elementor.modules.templateLibrary.ElementsCollectionView.extend( {
	id: 'elementor-global-templates',

	getEmptyView: function() {
		if ( this.collection.length ) {
			return null;
		}

		return require( './no-templates' );
	},

	onFilterEmpty: function() {}
} );

},{"./no-templates":11}],11:[function(require,module,exports){
module.exports = Marionette.ItemView.extend( {
	template: '#tmpl-elementor-panel-global-widget-no-templates',

	id: 'elementor-panel-global-widget-no-templates',

	className: 'elementor-panel-nerd-box',

	initialize: function() {
		elementor.getPanelView().getCurrentPageView().search.reset();
	},

	onDestroy: function() {
		elementor.getPanelView().getCurrentPageView().showView( 'search' );
	}
} );

},{}],12:[function(require,module,exports){

module.exports = Marionette.ItemView.extend( {
	id: 'elementor-panel-global-widget',

	template: '#tmpl-elementor-panel-global-widget',

	ui: {
		editButton: '#elementor-global-widget-locked-edit .elementor-button',
		unlinkButton: '#elementor-global-widget-locked-unlink .elementor-button',
		loading: '#elementor-global-widget-loading'
	},

	events: {
		'click @ui.editButton': 'onEditButtonClick',
		'click @ui.unlinkButton': 'onUnlinkButtonClick'
	},

	initialize: function() {
		this.initUnlinkDialog();
	},

	buildUnlinkDialog: function() {
		var self = this;

		return elementor.dialogsManager.createWidget( 'confirm', {
			id: 'elementor-global-widget-unlink-dialog',
			headerMessage: elementorPro.translate( 'unlink_widget' ),
			message: elementorPro.translate( 'dialog_confirm_unlink' ),
			position: {
				my: 'center center',
				at: 'center center'
			},
			strings: {
				confirm: elementorPro.translate( 'unlink' ),
				cancel: elementorPro.translate( 'cancel' )
			},
			onConfirm: function() {
				self.getOption( 'editedView' ).unlink();
			}
		} );
	},

	initUnlinkDialog: function() {
		var dialog;

		this.getUnlinkDialog = function() {
			if ( ! dialog ) {
				dialog = this.buildUnlinkDialog();
			}

			return dialog;
		};
	},

	editGlobalModel: function() {
		var editedView = this.getOption( 'editedView' );

		elementor.getPanelView().openEditor( editedView.getEditModel(), editedView );
	},

	onEditButtonClick: function() {
		var self = this,
			editedView = self.getOption( 'editedView' ),
			editedModel = editedView.getEditModel();

		if ( 'loaded' === editedModel.get( 'settingsLoadedStatus' ) ) {
			self.editGlobalModel();

			return;
		}

		self.ui.loading.removeClass( 'elementor-hidden' );

		elementorPro.modules.globalWidget.requestGlobalModelSettings( editedModel, function() {
			self.ui.loading.addClass( 'elementor-hidden' );

			self.editGlobalModel();
		} );
	},

	onUnlinkButtonClick: function() {
		this.getUnlinkDialog().show();
	}
} );

},{}],13:[function(require,module,exports){
module.exports = elementor.modules.element.Model.extend( {
	initialize: function() {
		this.set( { widgetType: 'global' }, { silent: true } );

		elementor.modules.element.Model.prototype.initialize.apply( this, arguments );
	},

	initSettings: function() {
		var templateID = this.get( 'templateID' ),
			globalModel = elementorPro.modules.globalWidget.getGlobalModels( templateID );

		elementorFrontend.config.elements.data[ this.cid ] = globalModel.get( 'settings' );
	},

	initEditSettings: function() {},

	onDestroy: function() {
		var panel = elementor.getPanelView(),
			currentPageName = panel.getCurrentPageName();

		if ( -1 !== [ 'editor', 'globalWidget' ].indexOf( currentPageName ) ) {
			panel.setPage( 'elements' );
		}
	}
} );

},{}],14:[function(require,module,exports){
var WidgetView = elementor.modules.WidgetView,
	GlobalWidgetView;

GlobalWidgetView = WidgetView.extend( {

	globalModel: null,

	className: function() {
		return WidgetView.prototype.className.apply( this, arguments ) + ' elementor-global-widget elementor-global-' + this.model.get( 'templateID' );
	},

	initialize: function() {
		var self = this,
			templateID = self.model.get( 'templateID' );

		self.globalModel = elementorPro.modules.globalWidget.getGlobalModels( templateID );

		var globalSettingsLoadedStatus = self.globalModel.get( 'settingsLoadedStatus' );

		if ( ! globalSettingsLoadedStatus ) {
			self.globalModel.set( 'settingsLoadedStatus', 'pending' );

			elementorPro.modules.globalWidget.requestGlobalModelSettings( self.globalModel );
		}

		if ( 'loaded' !== globalSettingsLoadedStatus ) {
			self.$el.addClass( 'elementor-loading' );
		}

		self.globalModel.on( 'settings:loaded', function() {
			self.$el.removeClass( 'elementor-loading' );

			self.render();
		} );

		WidgetView.prototype.initialize.apply( self, arguments );
	},

	getEditModel: function() {
		return this.globalModel;
	},

	getHTMLContent: function( html ) {
		if ( 'loaded' === this.globalModel.get( 'settingsLoadedStatus' ) ) {
			return WidgetView.prototype.getHTMLContent.call( this, html );
		}

		return '';
	},

	serializeModel: function() {
		return this.globalModel.toJSON.apply( this.globalModel, _.rest( arguments ) );
	},

	edit: function() {
		elementor.getPanelView().setPage( 'globalWidget', 'Global Editing', { editedView: this } );
	},

	unlink: function() {
		var newModel = new elementor.modules.element.Model( {
			elType: 'widget',
			widgetType: this.globalModel.get( 'widgetType' ),
			id: elementor.helpers.getUniqueID(),
			settings: elementor.helpers.cloneObject( this.globalModel.get( 'settings' ).attributes ),
			defaultEditSettings: elementor.helpers.cloneObject( this.globalModel.get( 'editSettings' ).attributes )
		} );

		this._parent.addChildModel( newModel, { at: this.model.collection.indexOf( this.model ) } );

		var newWidget = this._parent.children.findByModelCid( newModel.cid );

		this.model.destroy();

		newWidget.edit();
	}
} );

module.exports = GlobalWidgetView;

},{}],15:[function(require,module,exports){
var EditorModule = require( 'elementor-pro/editor/editor-module' );

module.exports = EditorModule.extend( {
	onElementorPreviewLoaded: function() {
		var EditButton = require( './editor/edit-button' );
		this.editButton = new EditButton();
	}
} );

},{"./editor/edit-button":16,"elementor-pro/editor/editor-module":1}],16:[function(require,module,exports){
module.exports = function() {
	var self = this;

	self.onPanelShow = function(  panel ) {
		var templateIdControl = panel.content.currentView.collection.findWhere( { name: 'template_id' } );

		if ( ! templateIdControl ) {
			return; // No templates
		}
		var templateIdInput = panel.content.currentView.children.findByModelCid( templateIdControl.cid );

		templateIdInput.on( 'input:change', self.onTemplateIdChange ).trigger( 'input:change' );
	};

	self.onTemplateIdChange = function() {
		var templateID = this.options.elementSettingsModel.attributes.template_id,
			type = this.options.model.attributes.types[ templateID ],
			$editButton = this.$el.find( '.elementor-edit-template' );

		if ( '0' === templateID || ! templateID || 'widget' === type ) { // '0' = first option, 'widget' is editable only from Elementor page
			if ( $editButton.length ) {
				$editButton.remove();
			}

			return;
		}

		var editUrl = ElementorConfig.home_url + '?p=' + templateID + '&elementor';

		if ( $editButton.length ) {
			$editButton.prop( 'href', editUrl );
		} else {
			$editButton = jQuery( '<a />', {
				target: '_blank',
				class: 'elementor-button elementor-button-default elementor-edit-template',
				href: editUrl,
				html: '<i class="fa fa-pencil" /> ' + ElementorProConfig.i18n.edit_template
		} );

			this.$el.find( '.elementor-control-input-wrapper' ).after( $editButton );
		}
	};

	self.init = function() {
		elementor.hooks.addAction( 'panel/open_editor/widget/template', self.onPanelShow );
	};

	self.init();
};

},{}],17:[function(require,module,exports){
var EditorModule = require( 'elementor-pro/editor/editor-module' );

module.exports = EditorModule.extend( {
	onElementorPreviewLoaded: function() {
		elementor.addControlView( 'Query', require( './editor/query-control' ) );
	}
} );

},{"./editor/query-control":18,"elementor-pro/editor/editor-module":1}],18:[function(require,module,exports){
module.exports = elementor.modules.controls.Select2.extend( {
	isTitlesReceived: false,

	getSelect2Options: function() {
		var self = this;

		return {
			ajax: {
				transport: function( params, success, failure ) {

					var data = {
						q: params.data.q,
						filter_type: self.model.get( 'filter_type' ),
						object_type: self.model.get( 'object_type' )
					};

					return elementorPro.ajax.send( 'panel_posts_control_filter_autocomplete', {
						data: data,
						success: success,
						error: failure
					} );
				},
				data: function( params ) {
					return {
						q: params.term,
						page: params.page
					};
				},
				cache: true
			},
			escapeMarkup: function( markup ) {
				return markup;
			},
			minimumInputLength: 2
		};
	},

	getValueTitles: function() {
		var self = this,
			value = self.getControlValue(),
			filterType = self.model.get( 'filter_type' );

		if ( ! value || ! filterType ) {
			return;
		}

		var data = {
			filter_type: filterType,
			object_type: self.model.get( 'object_type' ),
			value: value
		};

		var request = elementorPro.ajax.send( 'panel_posts_control_value_titles', { data: data });

		request.then( function( response ) {
			self.isTitlesReceived = true;

			self.model.set( 'options', response.data );

			self.render();

			self.ui.select.select2( {
				// Allow delete the value
				allowClear: true,
				// The placeholder is needed for the `allowClear`. @see http://select2.github.io/select2/#documentation
				placeholder: self.ui.select.children( 'option:first' ).text()
			} );
		});
	},

	onReady: function() {
		elementor.modules.controls.Select2.prototype.onReady.apply( this, arguments );

		if ( ! this.isTitlesReceived ) {
			this.getValueTitles();
		}
	}
} );

},{}],19:[function(require,module,exports){
var EditorModule = require( 'elementor-pro/editor/editor-module' );

module.exports = EditorModule.extend( {
	config: elementorPro.config.shareButtonsNetworks,

	networksClassDictionary: {
		google: 'fa fa-google-plus',
		pocket: 'fa fa-get-pocket',
		email: 'fa fa-envelope'
	},

	getNetworkClass: function( networkName ) {
		return this.networksClassDictionary[ networkName ] || 'fa fa-' + networkName;
	},

	getNetworkTitle: function( buttonSettings ) {
		return buttonSettings.text || this.config[ buttonSettings.button ].title;
	},

	hasCounter: function( networkName, settings ) {
		return 'icon' !== settings.view && 'yes' === settings.show_counter && this.config[ networkName ].has_counter;
	}
} );

},{"elementor-pro/editor/editor-module":1}],20:[function(require,module,exports){
var EditorModule = require( 'elementor-pro/editor/editor-module' );

module.exports = EditorModule.extend( {
	onElementorPreviewLoaded: function() {
		var StopSlider = require( './editor/stop-slider' );
		this.stopSlider = new StopSlider();
	}
} );

},{"./editor/stop-slider":21,"elementor-pro/editor/editor-module":1}],21:[function(require,module,exports){
module.exports = function() {
	var self = this;

	self.onPanelShow = function( panel, model, view ) {
		var $slider = view.$el.find( '.elementor-slides' );

		if ( $slider.length ) {
			$slider.slick( 'slickPause' );

			$slider.on( 'afterChange', function() {
				$slider.slick( 'slickPause' );
			} );
		}
	};

	self.init = function() {
		elementor.hooks.addAction( 'panel/open_editor/widget/slides', self.onPanelShow );
	};

	self.init();
};

},{}]},{},[2])
//# sourceMappingURL=editor.js.map
