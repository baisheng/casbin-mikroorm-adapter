"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CasbinMongoRule = void 0;
const core_1 = require("@mikro-orm/core");
let CasbinMongoRule = class CasbinMongoRule extends core_1.BaseEntity {
    constructor() {
        super();
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }
};
__decorate([
    (0, core_1.PrimaryKey)()
], CasbinMongoRule.prototype, "_id", void 0);
__decorate([
    (0, core_1.SerializedPrimaryKey)()
], CasbinMongoRule.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)()
], CasbinMongoRule.prototype, "ptype", void 0);
__decorate([
    (0, core_1.Property)()
], CasbinMongoRule.prototype, "v0", void 0);
__decorate([
    (0, core_1.Property)()
], CasbinMongoRule.prototype, "v1", void 0);
__decorate([
    (0, core_1.Property)()
], CasbinMongoRule.prototype, "v2", void 0);
__decorate([
    (0, core_1.Property)()
], CasbinMongoRule.prototype, "v3", void 0);
__decorate([
    (0, core_1.Property)()
], CasbinMongoRule.prototype, "v4", void 0);
__decorate([
    (0, core_1.Property)()
], CasbinMongoRule.prototype, "v5", void 0);
__decorate([
    (0, core_1.Property)()
], CasbinMongoRule.prototype, "v6", void 0);
__decorate([
    (0, core_1.Property)()
], CasbinMongoRule.prototype, "createdAt", void 0);
__decorate([
    (0, core_1.Property)()
], CasbinMongoRule.prototype, "updatedAt", void 0);
CasbinMongoRule = __decorate([
    (0, core_1.Entity)()
], CasbinMongoRule);
exports.CasbinMongoRule = CasbinMongoRule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FzYmluTW9uZ29SdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2Nhc2Jpbk1vbmdvUnVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSwwQ0FBaUc7QUFLakcsSUFBYSxlQUFlLEdBQTVCLE1BQWEsZUFBZ0IsU0FBUSxpQkFBaUM7SUFxQ3BFO1FBQ0UsS0FBSyxFQUFFLENBQUE7UUFDUCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDMUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQzVDLENBQUM7Q0FFRixDQUFBO0FBeENDO0lBREMsSUFBQSxpQkFBVSxHQUFFOzRDQUNFO0FBR2Y7SUFEQyxJQUFBLDJCQUFvQixHQUFFOzJDQUNYO0FBR1o7SUFEQyxJQUFBLGVBQVEsR0FBRTs4Q0FDVztBQUd0QjtJQURDLElBQUEsZUFBUSxHQUFFOzJDQUNRO0FBR25CO0lBREMsSUFBQSxlQUFRLEdBQUU7MkNBQ1E7QUFHbkI7SUFEQyxJQUFBLGVBQVEsR0FBRTsyQ0FDUTtBQUduQjtJQURDLElBQUEsZUFBUSxHQUFFOzJDQUNRO0FBR25CO0lBREMsSUFBQSxlQUFRLEdBQUU7MkNBQ1E7QUFHbkI7SUFEQyxJQUFBLGVBQVEsR0FBRTsyQ0FDUTtBQUduQjtJQURDLElBQUEsZUFBUSxHQUFFOzJDQUNRO0FBR25CO0lBREMsSUFBQSxlQUFRLEdBQUU7a0RBQ3NCO0FBRWpDO0lBREMsSUFBQSxlQUFRLEdBQUU7a0RBQ3NCO0FBbkN0QixlQUFlO0lBRDNCLElBQUEsYUFBTSxHQUFFO0dBQ0ksZUFBZSxDQTJDM0I7QUEzQ1ksMENBQWUifQ==