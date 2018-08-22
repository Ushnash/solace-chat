sap.ui.define([ 'sap/ui/core/mvc/Controller', 'sap/m/Button',
		'sap/m/FeedInput', 'sap/ui/model/json/JSONModel', 'sap/m/Text',
		'sap/m/MessageToast', 'sap/ui/core/format/DateFormat' ], function(
		Controller, Button, FeedInput, JSONModel, Text, MessageToast,
		DateFormat) {

	"use strict";

	return Controller.extend("solchat.controller.SolChat", {

		/**
		 * Called when a controller is instantiated and its View controls (if
		 * available) are already created. Can be used to modify the View before
		 * it is displayed, to bind event handlers and do other one-time
		 * initialization.
		 * 
		 * @memberOf solchat.SolChat
		 */
		onInit : function() {

		},
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
		/**
		 * Called when the user decides to connect to a topic. This initializes
		 * the chat window, clearing any previous entries.
		 */
		onConnectPress : function(oEvent) {

			// define an empty data model for
			// our chat window.
			// updates to this model get
			// reflected on screen as new
			// messages.
			var oChatModel = new JSONModel({
				"EntryCollection" : []
			});

			// assign this model to our chat
			// feed
			this.byId("feedList").setModel(oChatModel);

			// get a reference to the
			// topic/queue we want to connect to
			var sChannel = this.byId("channelInput").getValue();

			// the user didn't tell us what to connect to!
			if ($.trim(sChannel) == "") {
				var oErrorTopicDialog = this.byId("errorTopicDialog");
				oErrorTopicDialog.open();
			} else {

				// TODO: do your connection logic here
				var bConnected = false;
				// bConnected = connect(sChannel);

				if (bConnected) {
					MessageToast.show("Connected to " + sChannel + "!");
					this.setChatTitle(sChannel);
				}

				// show & enable the chat input
				this.byId("feedInput").setVisible(true);
			}
		},

		/**
		 * Updates the chat window with the new post and sends it off to the
		 * message broker.
		 */
		onFeedInputPost : function(oControlEvent) {

			// Get the input text posted by the
			// user
			var sValue = oControlEvent.getParameter("value");

			// TODO: Send the input to the message broker
			// Explode if there is an error
			// broker.send(sValue);

			// update the chat window
			this.setChatMessage(sValue);
		},

		/**
		 * Updates the chat window with a given text entry.
		 */
		setChatMessage : function(sChatText) {

			// Get the current timestamp in a human-readable format
			var oFormat = DateFormat.getDateTimeInstance({
				style : "short"
			});
			var oDate = new Date();
			var sDate = oFormat.format(oDate);

			// Convert the message to a JSON
			// object for our chat model
			var oEntry = {
				Text : sChatText,
				Timestamp : sDate
			};

			// get the data model of the Chat
			// list control
			var oChatModel = this.byId("feedList").getModel();

			// Put the new message on top of the
			// message stack
			var aEntries = oChatModel.getData().EntryCollection;
			aEntries.unshift(oEntry);

			// reset the Chat window's model to
			// our updated message stack
			oChatModel.setData({
				EntryCollection : aEntries
			});
		},

		/**
		 * Sets the title for the chat window
		 */
		setChatTitle : function(sTitle) {
			this.byId("chatPage").setTitle(sTitle);
		},

		/**
		 * Simple function that closes a dialog after the users accepts it (i.e.
		 * presses the OK button)
		 */
		onDialogAccept : function(oEvent) {
			var oParentDialog = oEvent.getSource().getParent();
			oParentDialog.close();
		}
	});
});