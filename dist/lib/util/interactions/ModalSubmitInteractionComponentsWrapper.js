"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** @module ModalSubmitInteractionComponentsWrapper */
const Errors_1 = require("../Errors");
const Constants_1 = require("../../Constants");
/** A wrapper for interaction components. */
class ModalSubmitInteractionComponentsWrapper {
    /** The raw components from Discord.  */
    raw;
    constructor(data) {
        this.raw = data;
    }
    _getComponent(customID, required = false, type) {
        const opt = this.getComponents().find(o => o.customID === customID && o.type === type);
        if (!opt && required) {
            throw new Errors_1.WrapperError(`Missing required component: ${customID}`);
        }
        else {
            return opt;
        }
    }
    /** Get the components in this interaction. */
    getComponents() {
        return this.raw.reduce((a, b) => a.concat(...(b.type === Constants_1.ComponentTypes.ACTION_ROW ? b.components : [b.component])), []);
    }
    getTextInput(name, required) {
        return this.getTextInputComponent(name, required)?.value;
    }
    getTextInputComponent(name, required) {
        return this._getComponent(name, required, Constants_1.ComponentTypes.TEXT_INPUT);
    }
}
exports.default = ModalSubmitInteractionComponentsWrapper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9kYWxTdWJtaXRJbnRlcmFjdGlvbkNvbXBvbmVudHNXcmFwcGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbGliL3V0aWwvaW50ZXJhY3Rpb25zL01vZGFsU3VibWl0SW50ZXJhY3Rpb25Db21wb25lbnRzV3JhcHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNEQUFzRDtBQUN0RCxzQ0FBeUM7QUFDekMsK0NBQTJFO0FBRzNFLDRDQUE0QztBQUM1QyxNQUFxQix1Q0FBdUM7SUFDeEQsd0NBQXdDO0lBQ3hDLEdBQUcsQ0FBcUU7SUFDeEUsWUFBWSxJQUF3RTtRQUNoRixJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQztJQUNwQixDQUFDO0lBRU8sYUFBYSxDQUEwRCxRQUFnQixFQUFFLFFBQVEsR0FBRyxLQUFLLEVBQUUsSUFBeUI7UUFDeEksTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLEtBQUssUUFBUSxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFrQixDQUFDO1FBQ3hHLElBQUksQ0FBQyxHQUFHLElBQUksUUFBUSxFQUFFLENBQUM7WUFDbkIsTUFBTSxJQUFJLHFCQUFZLENBQUMsK0JBQStCLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDdEUsQ0FBQzthQUFNLENBQUM7WUFDSixPQUFPLEdBQUcsQ0FBQztRQUNmLENBQUM7SUFDTCxDQUFDO0lBRUQsOENBQThDO0lBQzlDLGFBQWE7UUFDVCxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSywwQkFBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQWtDLENBQUMsQ0FBQztJQUM3SixDQUFDO0lBU0QsWUFBWSxDQUFDLElBQVksRUFBRSxRQUFrQjtRQUN6QyxPQUFPLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLEVBQUUsUUFBaUIsQ0FBQyxFQUFFLEtBQUssQ0FBQztJQUN0RSxDQUFDO0lBU0QscUJBQXFCLENBQUMsSUFBWSxFQUFFLFFBQWtCO1FBQ2xELE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLDBCQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDekUsQ0FBQztDQUNKO0FBMUNELDBEQTBDQyJ9