// Type definitions for Minecraft Bedrock Edition script APIs
// Project: https://docs.microsoft.com/minecraft/creator/
// Definitions by: Jake Shirley <https://github.com/JakeShirley>
//                 Mike Ammerlaan <https://github.com/mammerla>

/* *****************************************************************************
   Copyright (c) Microsoft Corporation.
   ***************************************************************************** */
/**
 * @beta
 * @packageDocumentation
 * The `@minecraft/server-ui` module contains types for
 * expressing simple dialog-based user experiences.
 *
 *   * {@link ActionFormData} contain a list of buttons with
 * captions and images that can be used for presenting a set of
 * options to a player.
 *   * {@link MessageFormData} are simple two-button message
 * experiences that are functional for Yes/No or OK/Cancel
 * questions.
 *   * {@link ModalFormData} allow for a more flexible
 * "questionnaire-style" list of controls that can be used to
 * take input.
 *
 * Manifest Details
 * ```json
 * {
 *   "module_name": "@minecraft/server-ui",
 *   "version": "2.1.0-beta"
 * }
 * ```
 *
 */
import * as minecraftcommon from '@minecraft/common';
import * as minecraftserver from '@minecraft/server';
export enum FormCancelationReason {
    UserBusy = 'UserBusy',
    UserClosed = 'UserClosed',
}

export enum FormRejectReason {
    MalformedResponse = 'MalformedResponse',
    PlayerQuit = 'PlayerQuit',
    ServerShutdown = 'ServerShutdown',
}

/**
 * Builds a simple player form with buttons that let the player
 * take action.
 * @example showActionForm.ts
 * ```typescript
 * import { world, DimensionLocation } from "@minecraft/server";
 * import { ActionFormData, ActionFormResponse } from "@minecraft/server-ui";
 *
 * function showActionForm(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
 *   const playerList = world.getPlayers();
 *
 *   if (playerList.length >= 1) {
 *     const form = new ActionFormData()
 *       .title("Test Title")
 *       .body("Body text here!")
 *       .button("btn 1")
 *       .button("btn 2")
 *       .button("btn 3")
 *       .button("btn 4")
 *       .button("btn 5");
 *
 *     form.show(playerList[0]).then((result: ActionFormResponse) => {
 *       if (result.canceled) {
 *         log("Player exited out of the dialog. Note that if the chat window is up, dialogs are automatically canceled.");
 *         return -1;
 *       } else {
 *         log("Your result was: " + result.selection);
 *       }
 *     });
 *   }
 * }
 * ```
 * @example showFavoriteMonth.ts
 * ```typescript
 * import { world, DimensionLocation } from "@minecraft/server";
 * import { ActionFormData, ActionFormResponse } from "@minecraft/server-ui";
 *
 * function showFavoriteMonth(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
 *   const players = world.getPlayers();
 *
 *   if (players.length >= 1) {
 *     const form = new ActionFormData()
 *       .title("Months")
 *       .body("Choose your favorite month!")
 *       .button("January")
 *       .button("February")
 *       .button("March")
 *       .button("April")
 *       .button("May");
 *
 *     form.show(players[0]).then((response: ActionFormResponse) => {
 *       if (response.selection === 3) {
 *         log("I like April too!");
 *         return -1;
 *       }
 *     });
 *   }
 * }
 * ```
 */
export class ActionFormData {
    /**
     * @remarks
     * Method that sets the body text for the modal form.
     *
     */
    body(bodyText: minecraftserver.RawMessage | string): ActionFormData;
    /**
     * @remarks
     * Adds a button to this form with an icon from a resource
     * pack.
     *
     */
    button(text: minecraftserver.RawMessage | string, iconPath?: string): ActionFormData;
    /**
     * @remarks
     * Adds a section divider to the form.
     *
     */
    divider(): ActionFormData;
    /**
     * @remarks
     * Adds a header to the form.
     *
     * @param text
     * Text to display.
     */
    header(text: minecraftserver.RawMessage | string): ActionFormData;
    /**
     * @remarks
     * Adds a label to the form.
     *
     * @param text
     * Text to display.
     */
    label(text: minecraftserver.RawMessage | string): ActionFormData;
    /**
     * @remarks
     * Creates and shows this modal popup form. Returns
     * asynchronously when the player confirms or cancels the
     * dialog.
     *
     * This function can't be called in read-only mode.
     *
     * @param player
     * Player to show this dialog to.
     * @throws This function can throw errors.
     *
     * {@link minecraftcommon.EngineError}
     *
     * {@link minecraftserver.InvalidEntityError}
     *
     * {@link minecraftserver.RawMessageError}
     */
    show(player: minecraftserver.Player): Promise<ActionFormResponse>;
    /**
     * @remarks
     * This builder method sets the title for the modal dialog.
     *
     */
    title(titleText: minecraftserver.RawMessage | string): ActionFormData;
}

/**
 * Returns data about the player results from a modal action
 * form.
 * @example showActionForm.ts
 * ```typescript
 * import { world, DimensionLocation } from "@minecraft/server";
 * import { ActionFormData, ActionFormResponse } from "@minecraft/server-ui";
 *
 * function showActionForm(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
 *   const playerList = world.getPlayers();
 *
 *   if (playerList.length >= 1) {
 *     const form = new ActionFormData()
 *       .title("Test Title")
 *       .body("Body text here!")
 *       .button("btn 1")
 *       .button("btn 2")
 *       .button("btn 3")
 *       .button("btn 4")
 *       .button("btn 5");
 *
 *     form.show(playerList[0]).then((result: ActionFormResponse) => {
 *       if (result.canceled) {
 *         log("Player exited out of the dialog. Note that if the chat window is up, dialogs are automatically canceled.");
 *         return -1;
 *       } else {
 *         log("Your result was: " + result.selection);
 *       }
 *     });
 *   }
 * }
 * ```
 * @example showFavoriteMonth.ts
 * ```typescript
 * import { world, DimensionLocation } from "@minecraft/server";
 * import { ActionFormData, ActionFormResponse } from "@minecraft/server-ui";
 *
 * function showFavoriteMonth(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
 *   const players = world.getPlayers();
 *
 *   if (players.length >= 1) {
 *     const form = new ActionFormData()
 *       .title("Months")
 *       .body("Choose your favorite month!")
 *       .button("January")
 *       .button("February")
 *       .button("March")
 *       .button("April")
 *       .button("May");
 *
 *     form.show(players[0]).then((response: ActionFormResponse) => {
 *       if (response.selection === 3) {
 *         log("I like April too!");
 *         return -1;
 *       }
 *     });
 *   }
 * }
 * ```
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class ActionFormResponse extends FormResponse {
    private constructor();
    /**
     * @remarks
     * Returns the index of the button that was pushed.
     *
     */
    readonly selection?: number;
}

/**
 * Base type for a form response.
 */
export class FormResponse {
    private constructor();
    /**
     * @remarks
     * Contains additional details as to why a form was canceled.
     *
     */
    readonly cancelationReason?: FormCancelationReason;
    /**
     * @remarks
     * If true, the form was canceled by the player (e.g., they
     * selected the pop-up X close button).
     *
     */
    readonly canceled: boolean;
}

/**
 * Builds a simple two-button modal dialog.
 * @example showBasicMessageForm.ts
 * ```typescript
 * import { world, DimensionLocation } from "@minecraft/server";
 * import { MessageFormResponse, MessageFormData } from "@minecraft/server-ui";
 *
 * function showBasicMessageForm(
 *   log: (message: string, status?: number) => void,
 *   targetLocation: DimensionLocation
 * ) {
 *   const players = world.getPlayers();
 *
 *   const messageForm = new MessageFormData()
 *     .title("Message Form Example")
 *     .body("This shows a simple example using §o§7MessageFormData§r.")
 *     .button1("Button 1")
 *     .button2("Button 2");
 *
 *   messageForm
 *     .show(players[0])
 *     .then((formData: MessageFormResponse) => {
 *       // player canceled the form, or another dialog was up and open.
 *       if (formData.canceled || formData.selection === undefined) {
 *         return;
 *       }
 *
 *       log(`You selected ${formData.selection === 0 ? "Button 1" : "Button 2"}`);
 *     })
 *     .catch((error: Error) => {
 *       log("Failed to show form: " + error);
 *       return -1;
 *     });
 * }
 * ```
 * @example showTranslatedMessageForm.ts
 * ```typescript
 * import { world, DimensionLocation } from "@minecraft/server";
 * import { MessageFormResponse, MessageFormData } from "@minecraft/server-ui";
 *
 * function showTranslatedMessageForm(
 *   log: (message: string, status?: number) => void,
 *   targetLocation: DimensionLocation
 * ) {
 *   const players = world.getPlayers();
 *
 *   const messageForm = new MessageFormData()
 *     .title({ translate: "permissions.removeplayer" })
 *     .body({ translate: "accessibility.list.or.two", with: ["Player 1", "Player 2"] })
 *     .button1("Player 1")
 *     .button2("Player 2");
 *
 *   messageForm
 *     .show(players[0])
 *     .then((formData: MessageFormResponse) => {
 *       // player canceled the form, or another dialog was up and open.
 *       if (formData.canceled || formData.selection === undefined) {
 *         return;
 *       }
 *
 *       log(`You selected ${formData.selection === 0 ? "Player 1" : "Player 2"}`);
 *     })
 *     .catch((error: Error) => {
 *       log("Failed to show form: " + error);
 *       return -1;
 *     });
 * }
 * ```
 */
export class MessageFormData {
    /**
     * @remarks
     * Method that sets the body text for the modal form.
     *
     */
    body(bodyText: minecraftserver.RawMessage | string): MessageFormData;
    /**
     * @remarks
     * Method that sets the text for the first button of the
     * dialog.
     *
     */
    button1(text: minecraftserver.RawMessage | string): MessageFormData;
    /**
     * @remarks
     * This method sets the text for the second button on the
     * dialog.
     *
     */
    button2(text: minecraftserver.RawMessage | string): MessageFormData;
    /**
     * @remarks
     * Creates and shows this modal popup form. Returns
     * asynchronously when the player confirms or cancels the
     * dialog.
     *
     * This function can't be called in read-only mode.
     *
     * @param player
     * Player to show this dialog to.
     * @throws This function can throw errors.
     *
     * {@link minecraftcommon.EngineError}
     *
     * {@link minecraftserver.InvalidEntityError}
     *
     * {@link minecraftserver.RawMessageError}
     */
    show(player: minecraftserver.Player): Promise<MessageFormResponse>;
    /**
     * @remarks
     * This builder method sets the title for the modal dialog.
     *
     */
    title(titleText: minecraftserver.RawMessage | string): MessageFormData;
}

/**
 * Returns data about the player results from a modal message
 * form.
 * @example showBasicMessageForm.ts
 * ```typescript
 * import { world, DimensionLocation } from "@minecraft/server";
 * import { MessageFormResponse, MessageFormData } from "@minecraft/server-ui";
 *
 * function showBasicMessageForm(
 *   log: (message: string, status?: number) => void,
 *   targetLocation: DimensionLocation
 * ) {
 *   const players = world.getPlayers();
 *
 *   const messageForm = new MessageFormData()
 *     .title("Message Form Example")
 *     .body("This shows a simple example using §o§7MessageFormData§r.")
 *     .button1("Button 1")
 *     .button2("Button 2");
 *
 *   messageForm
 *     .show(players[0])
 *     .then((formData: MessageFormResponse) => {
 *       // player canceled the form, or another dialog was up and open.
 *       if (formData.canceled || formData.selection === undefined) {
 *         return;
 *       }
 *
 *       log(`You selected ${formData.selection === 0 ? "Button 1" : "Button 2"}`);
 *     })
 *     .catch((error: Error) => {
 *       log("Failed to show form: " + error);
 *       return -1;
 *     });
 * }
 * ```
 * @example showTranslatedMessageForm.ts
 * ```typescript
 * import { world, DimensionLocation } from "@minecraft/server";
 * import { MessageFormResponse, MessageFormData } from "@minecraft/server-ui";
 *
 * function showTranslatedMessageForm(
 *   log: (message: string, status?: number) => void,
 *   targetLocation: DimensionLocation
 * ) {
 *   const players = world.getPlayers();
 *
 *   const messageForm = new MessageFormData()
 *     .title({ translate: "permissions.removeplayer" })
 *     .body({ translate: "accessibility.list.or.two", with: ["Player 1", "Player 2"] })
 *     .button1("Player 1")
 *     .button2("Player 2");
 *
 *   messageForm
 *     .show(players[0])
 *     .then((formData: MessageFormResponse) => {
 *       // player canceled the form, or another dialog was up and open.
 *       if (formData.canceled || formData.selection === undefined) {
 *         return;
 *       }
 *
 *       log(`You selected ${formData.selection === 0 ? "Player 1" : "Player 2"}`);
 *     })
 *     .catch((error: Error) => {
 *       log("Failed to show form: " + error);
 *       return -1;
 *     });
 * }
 * ```
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class MessageFormResponse extends FormResponse {
    private constructor();
    /**
     * @remarks
     * Returns the index of the button that was pushed.
     *
     */
    readonly selection?: number;
}

/**
 * Used to create a fully customizable pop-up form for a
 * player.
 * @example showBasicModalForm.ts
 * ```typescript
 * import { world, DimensionLocation } from "@minecraft/server";
 * import { ModalFormData } from "@minecraft/server-ui";
 *
 * function showBasicModalForm(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
 *   const players = world.getPlayers();
 *
 *   const modalForm = new ModalFormData().title("Example Modal Controls for §o§7ModalFormData§r");
 *
 *   modalForm.toggle("Toggle w/o default");
 *   modalForm.toggle("Toggle w/ default", true);
 *
 *   modalForm.slider("Slider w/o default", 0, 50, 5);
 *   modalForm.slider("Slider w/ default", 0, 50, 5, 30);
 *
 *   modalForm.dropdown("Dropdown w/o default", ["option 1", "option 2", "option 3"]);
 *   modalForm.dropdown("Dropdown w/ default", ["option 1", "option 2", "option 3"], 2);
 *
 *   modalForm.textField("Input w/o default", "type text here");
 *   modalForm.textField("Input w/ default", "type text here", "this is default");
 *
 *   modalForm
 *     .show(players[0])
 *     .then((formData) => {
 *       players[0].sendMessage(`Modal form results: ${JSON.stringify(formData.formValues, undefined, 2)}`);
 *     })
 *     .catch((error: Error) => {
 *       log("Failed to show form: " + error);
 *       return -1;
 *     });
 * }
 * ```
 */
export class ModalFormData {
    /**
     * @remarks
     * Adds a section divider to the form.
     *
     */
    divider(): ModalFormData;
    /**
     * @remarks
     * Adds a dropdown with choices to the form.
     *
     * @param label
     * The label to display for the dropdown.
     * @param items
     * The selectable items for the dropdown.
     * @param dropdownOptions
     * The optional additional values for the dropdown creation.
     */
    dropdown(
        label: minecraftserver.RawMessage | string,
        items: (minecraftserver.RawMessage | string)[],
        dropdownOptions?: ModalFormDataDropdownOptions,
    ): ModalFormData;
    /**
     * @remarks
     * Adds a header to the form.
     *
     * @param text
     * Text to display.
     */
    header(text: minecraftserver.RawMessage | string): ModalFormData;
    /**
     * @remarks
     * Adds a label to the form.
     *
     * @param text
     * Text to display.
     */
    label(text: minecraftserver.RawMessage | string): ModalFormData;
    /**
     * @remarks
     * Creates and shows this modal popup form. Returns
     * asynchronously when the player confirms or cancels the
     * dialog.
     *
     * This function can't be called in read-only mode.
     *
     * @param player
     * Player to show this dialog to.
     * @throws This function can throw errors.
     *
     * {@link minecraftcommon.EngineError}
     *
     * {@link minecraftserver.InvalidEntityError}
     *
     * {@link minecraftserver.RawMessageError}
     */
    show(player: minecraftserver.Player): Promise<ModalFormResponse>;
    /**
     * @remarks
     * Adds a numeric slider to the form.
     *
     * @param label
     * The label to display for the slider.
     * @param minimumValue
     * The minimum selectable possible value.
     * @param maximumValue
     * The maximum selectable possible value.
     * @param sliderOptions
     * The optional additional values for the slider creation.
     */
    slider(
        label: minecraftserver.RawMessage | string,
        minimumValue: number,
        maximumValue: number,
        sliderOptions?: ModalFormDataSliderOptions,
    ): ModalFormData;
    submitButton(submitButtonText: minecraftserver.RawMessage | string): ModalFormData;
    /**
     * @remarks
     * Adds a textbox to the form.
     *
     * @param label
     * The label to display for the textfield.
     * @param placeholderText
     * The place holder text to display.
     * @param textFieldOptions
     * The optional additional values for the textfield creation.
     */
    textField(
        label: minecraftserver.RawMessage | string,
        placeholderText: minecraftserver.RawMessage | string,
        textFieldOptions?: ModalFormDataTextFieldOptions,
    ): ModalFormData;
    /**
     * @remarks
     * This builder method sets the title for the modal dialog.
     *
     */
    title(titleText: minecraftserver.RawMessage | string): ModalFormData;
    /**
     * @remarks
     * Adds a toggle checkbox button to the form.
     *
     * @param label
     * The label to display for the toggle.
     * @param toggleOptions
     * The optional additional values for the toggle creation.
     */
    toggle(label: minecraftserver.RawMessage | string, toggleOptions?: ModalFormDataToggleOptions): ModalFormData;
}

/**
 * Returns data about player responses to a modal form.
 * @example showBasicModalForm.ts
 * ```typescript
 * import { world, DimensionLocation } from "@minecraft/server";
 * import { ModalFormData } from "@minecraft/server-ui";
 *
 * function showBasicModalForm(log: (message: string, status?: number) => void, targetLocation: DimensionLocation) {
 *   const players = world.getPlayers();
 *
 *   const modalForm = new ModalFormData().title("Example Modal Controls for §o§7ModalFormData§r");
 *
 *   modalForm.toggle("Toggle w/o default");
 *   modalForm.toggle("Toggle w/ default", true);
 *
 *   modalForm.slider("Slider w/o default", 0, 50, 5);
 *   modalForm.slider("Slider w/ default", 0, 50, 5, 30);
 *
 *   modalForm.dropdown("Dropdown w/o default", ["option 1", "option 2", "option 3"]);
 *   modalForm.dropdown("Dropdown w/ default", ["option 1", "option 2", "option 3"], 2);
 *
 *   modalForm.textField("Input w/o default", "type text here");
 *   modalForm.textField("Input w/ default", "type text here", "this is default");
 *
 *   modalForm
 *     .show(players[0])
 *     .then((formData) => {
 *       players[0].sendMessage(`Modal form results: ${JSON.stringify(formData.formValues, undefined, 2)}`);
 *     })
 *     .catch((error: Error) => {
 *       log("Failed to show form: " + error);
 *       return -1;
 *     });
 * }
 * ```
 */
// @ts-ignore Class inheritance allowed for native defined classes
export class ModalFormResponse extends FormResponse {
    private constructor();
    /**
     * @remarks
     * An ordered set of values based on the order of controls
     * specified by ModalFormData.
     *
     */
    readonly formValues?: (boolean | number | string | undefined)[];
}

export class UIManager {
    private constructor();
    /**
     * @remarks
     * This function can't be called in read-only mode.
     *
     * @throws This function can throw errors.
     */
    closeAllForms(player: minecraftserver.Player): void;
}

/**
 * An interface that is passed into {@link
 * @minecraft/Server-ui.ModalFormData.dropdown} to provide
 * additional options for the dropdown creation.
 */
export interface ModalFormDataDropdownOptions {
    /**
     * @remarks
     * The default selected item index. It will be zero in case of
     * not setting this value.
     *
     */
    defaultValueIndex?: number;
    /**
     * @remarks
     * It will show an exclamation icon that will display a tooltip
     * if it is hovered.
     *
     */
    tooltip?: minecraftserver.RawMessage | string;
}

/**
 * An interface that is passed into {@link
 * @minecraft/Server-ui.ModalFormData.slider} to provide
 * additional options for the slider creation.
 */
export interface ModalFormDataSliderOptions {
    /**
     * @remarks
     * The default value for the slider.
     *
     */
    defaultValue?: number;
    /**
     * @remarks
     * It will show an exclamation icon that will display a tooltip
     * if it is hovered.
     *
     */
    tooltip?: minecraftserver.RawMessage | string;
    /**
     * @remarks
     * Defines the increment of values that the slider generates
     * when moved. It will be '1' in case of not providing this.
     *
     */
    valueStep?: number;
}

/**
 * An interface that is passed into {@link
 * @minecraft/Server-ui.ModalFormData.textField} to provide
 * additional options for the textfield creation.
 */
export interface ModalFormDataTextFieldOptions {
    /**
     * @remarks
     * The default value for the textfield.
     *
     */
    defaultValue?: string;
    /**
     * @remarks
     * It will show an exclamation icon that will display a tooltip
     * if it is hovered.
     *
     */
    tooltip?: minecraftserver.RawMessage | string;
}

/**
 * An interface that is passed into {@link
 * @minecraft/Server-ui.ModalFormData.toggle} to provide
 * additional options for the toggle creation.
 */
export interface ModalFormDataToggleOptions {
    /**
     * @remarks
     * The default value for the toggle.
     *
     */
    defaultValue?: boolean;
    /**
     * @remarks
     * It will show an exclamation icon that will display a tooltip
     * if it is hovered.
     *
     */
    tooltip?: minecraftserver.RawMessage | string;
}

// @ts-ignore Class inheritance allowed for native defined classes
export class FormRejectError extends Error {
    private constructor();
    /**
     * @remarks
     * This property can be read in early-execution mode.
     *
     */
    reason: FormRejectReason;
}

export const uiManager: UIManager;
