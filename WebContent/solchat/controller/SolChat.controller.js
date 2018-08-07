sap.ui.define([ 'sap/ui/core/mvc/Controller', 'sap/m/TabContainerItem',
		'sap/m/Button', 'sap/m/FeedInput' ], function(Controller,
		TabContainerItem, Button, FeedInput) {
	"use strict";

	return Controller.extend("solchat.SolChat", {

		/**
		 * Called when a controller is instantiated and its View controls (if
		 * available) are already created. Can be used to modify the View before
		 * it is displayed, to bind event handlers and do other one-time
		 * initialization.
		 * 
		 * @memberOf solchat.SolChat
		 */
		// onInit: function() {
		//
		// },
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the
		 * controller's View is re-rendered (NOT before the first rendering!
		 * onInit() is used for that one!).
		 * 
		 * @memberOf solchat.SolChat
		 */
		// onBeforeRendering: function() {
		//
		// },
		/**
		 * Called when the View has been rendered (so its HTML is part of the
		 * document). Post-rendering manipulations of the HTML could be done
		 * here. This hook is the same one that SAPUI5 controls get after being
		 * rendered.
		 * 
		 * @memberOf solchat.SolChat
		 */
		// onAfterRendering: function() {
		//
		// },
		/**
		 * Called when the Controller is destroyed. Use this one to free
		 * resources and finalize activities.
		 * 
		 * @memberOf solchat.SolChat
		 */
		// onExit: function() {
		//
		// }
		addNewChatTab : function() {
			var channelDialog = this.byId("enterAddressDialog");		
			channelDialog.open();
		},
	   
		/*
		 * If the user pressed Cancel, close the dialog that asks for Address input. 
		 */
		onAddressDialogCancel: function(event){
			
			//get a reference to the parent dialog of the 'cancel' button & close it
			var dialog = event.getSource().getEventingParent();
			dialog.close();
		},
	   
		/*
		 * Use this function to setup our chat tab once the user confirms their 
		 * input.
		 */
		onAddressDialogAccept: function(event){
			
			//get the user's input
			var nameInput = this.byId("channelNameInput").getValue();
			var addressInput = this.byId("channelAddressInput").getValue();
			
			//get a reference to our Tab template
			//use the user's input to name the tab object & provide text for the tab
			var tabContent = sap.ui.xmlfragment(nameInput,"solchat.view.ChatWindow");
			tabContent.setName(nameInput);
			
			//get a reference to our main application container and add in the new tab
			var tabContainer =this.byId("chatTabContainer");
			tabContainer.addItem(tabContent);
			
			//all done! close the dialog
			var dialog = event.getSource().getEventingParent();
			dialog.close();
		}
	});
});