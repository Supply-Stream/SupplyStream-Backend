"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function checkDate(dateString) {
    const date = new Date(dateString);
    return !isNaN(date);
}
exports.default = checkDate;
//# sourceMappingURL=checkDate.js.map